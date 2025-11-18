import { createStore } from "solid-js/store";
import { createEffect, on } from "solid-js";
import type { ChatMessage, ChatModels, Message } from "~/types";
import type { ChatService } from "~/services/chatService";
import type { ImageService } from "~/services/imageService";
import type { ResourceManager } from "~/services/resourceManager";
import type { createImageStore } from "./imageStore";
import { StorageManager } from "~/utils/storageManager";

interface ChatState {
  messages: Message[];
  history: ChatMessage[];
  currentModel: ChatModels;
  isLoading: boolean;
  error: string | null;
}

export function createChatStore(
  chatService: ChatService,
  imageService: ImageService,
  imageStore: ReturnType<typeof createImageStore>,
  resourceManager: ResourceManager,
) {
  // Load persisted state from localStorage
  const persistedState = StorageManager.loadState();

  const [state, setState] = createStore<ChatState>({
    messages: persistedState.messages || [],
    history: persistedState.history || [],
    currentModel: persistedState.currentModel || "Socrates",
    isLoading: false,
    error: null,
  });

  // Auto-save messages to localStorage whenever they change
  createEffect(
    on(
      () => state.messages,
      (messages) => {
        StorageManager.saveMessages(messages);
      },
      { defer: true },
    ),
  );

  // Auto-save history to localStorage whenever it changes
  createEffect(
    on(
      () => state.history,
      (history) => {
        StorageManager.saveHistory(history);
      },
      { defer: true },
    ),
  );

  // Auto-save current model to localStorage whenever it changes
  createEffect(
    on(
      () => state.currentModel,
      (model) => {
        StorageManager.saveCurrentModel(model);
      },
      { defer: true },
    ),
  );

  const handleError = (error: unknown) => {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    setState("error", `Chat request failed: ${message}`);
    console.error("Chat error:", error);
  };

  const createMessage = (
    role: Message["role"],
    type: Message["type"],
    content: string,
    url?: string,
  ): Message => ({
    role,
    type,
    content,
    ...(url ? { url } : {}),
  });

  const processStreamingResponse = async (
    reader: ReadableStreamDefaultReader<Uint8Array>,
  ) => {
    const decoder = new TextDecoder();
    let buffer = "";
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const boundary = buffer.lastIndexOf("\n");

      if (boundary !== -1) {
        const chunk = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 1);

        try {
          const chunkObj = JSON.parse(chunk);
          fullResponse += chunkObj.message.content;

          // Update messages in real-time as they stream in
          setState("messages", (messages) => {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage?.role === "ASSISTANT") {
              // Update existing assistant message
              return messages.map((msg, index) =>
                index === messages.length - 1
                  ? { ...msg, content: fullResponse }
                  : msg,
              );
            }

            // Add new assistant message
            return [
              ...messages,
              { role: "ASSISTANT", type: "text", content: fullResponse },
            ];
          });
        } catch (e) {
          console.error("Failed to parse chunk:", e);
        }
      }
    }

    return fullResponse;
  };

  const handleImageGeneration = async (
    response: string,
    responseElement: HTMLElement,
  ) => {
    if (response.includes("[GENERATE_IMAGE]")) {
      const commandMatch = response.match(/\[GENERATE_IMAGE\]{([\s\S]+?)}/);

      if (commandMatch) {
        const rawCommand = commandMatch[1];
        const fixedJson = rawCommand
          .replace(/prompt:/g, '"prompt":')
          .replace(/negative:/g, '"negative":')
          .replace(/resolution:/g, '"resolution":')
          .replace(
            /response_during_generation:/g,
            '"response_during_generation":',
          );

        const params = JSON.parse(`{${fixedJson}}`);

        if (params.response_during_generation) {
          // Update the message with the generation status and mark as generating
          setState("messages", (messages) =>
            messages.map((msg, index) =>
              index === messages.length - 1
                ? {
                    ...msg,
                    content: params.response_during_generation,
                    isGenerating: true,
                  }
                : msg,
            ),
          );
        }

        try {
          const imageBlobs = await imageService.generateImage(
            params.prompt,
            params.negative,
            params.resolution,
          );

          if (imageBlobs) {
            imageStore.addImages(imageBlobs);

            // Clear the generating state from the progress message
            setState("messages", (messages) =>
              messages.map((msg, index) =>
                index === messages.length - 1 && msg.isGenerating
                  ? { ...msg, isGenerating: false }
                  : msg,
              ),
            );

            // Create and track URLs using ResourceManager
            const imageMessages = imageBlobs.map((blob) => {
              const url = resourceManager.getOrCreateURL(blob);
              return createMessage("ASSISTANT", "image", "", url);
            });

            setState("messages", (messages) => [
              ...messages,
              ...imageMessages,
            ]);
          }
        } catch (error) {
          // Clear generating state on error
          setState("messages", (messages) =>
            messages.map((msg, index) =>
              index === messages.length - 1 && msg.isGenerating
                ? {
                    ...msg,
                    isGenerating: false,
                    content: "Failed to generate image. Please try again.",
                  }
                : msg,
            ),
          );
          throw error;
        }
      }
    }
  };

  const sendMessage = async (message: string) => {
    setState("isLoading", true);
    setState("error", null);

    try {
      // Add user message
      const newMessage: Message = createMessage("USER", "text", message);
      setState("messages", (messages) => [...messages, newMessage]);

      const reader = await chatService.sendChat(message, state.currentModel, [
        ...state.history,
        { role: "USER", content: message },
      ]);

      if (!reader) throw new Error("Failed to get response reader");

      const fullResponse = await processStreamingResponse(reader);
      await handleImageGeneration(fullResponse, document.createElement("div"));

      // Update history after completion
      setState("history", (history) => [
        ...history,
        { role: "ASSISTANT", content: fullResponse },
      ]);
    } catch (error) {
      setState("error", `Chat request failed: ${error}`);
    } finally {
      setState("isLoading", false);
    }
  };

  return {
    state,
    sendMessage,
    setError: (error: string | null) => setState("error", error),
    setModel: (model: ChatModels) => setState("currentModel", model),
    clearHistory: () => {
      setState("messages", []);
      setState("history", []);
      StorageManager.clear();
    },
    cleanup: () => {
      // URL cleanup is now handled by ResourceManager in Services.cleanup()
      // This method is kept for future cleanup needs (e.g., aborting requests)
    },
  };
}
