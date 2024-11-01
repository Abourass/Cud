import { createSignal, onMount, onCleanup } from "solid-js";
import { A } from "@solidjs/router";
import { debounce } from "@solid-primitives/scheduled";
import { ChatInput } from "../components/chat/ChatInput";
import { ModelSelector } from "../components/chat/ModelSelector";
import { MessageList } from "../components/chat/MessageList";
import { ImageGallery } from "../components/chat/ImageGallery";
import { ErrorMessage } from "../components/chat/ErrorMessage";
import { ImageService } from "~/services/imageService";
import type {
  ChatModels,
  ChatMessage,
  Message,
  ImageResolution,
  LoRAOptions,
} from "~/types";
import { ChatService } from "~/services/chatService";
import { LORASelector } from "~/components/chat/LORASelector";
import { LORAOptionsMenuButton } from "~/components/chat/LORAOptionsMenuButton";

interface ImageGenerationParams {
  prompt: string;
  negative?: string;
  resolution?: ImageResolution;
  response_during_generation?: string;
}

export default function Home() {
  const [chatModel, setChatModel] = createSignal<ChatModels>("Socrates");
  const [messages, setMessages] = createSignal<Message[]>([]);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [error, setError] = createSignal<string | null>(null);
  const [messagesHistory, setMessagesHistory] = createSignal<ChatMessage[]>([]);
  const [images, setImages] = createSignal<Array<Blob>>([]);

  const [selectedLoras, setSelectedLoras] = createSignal<Set<string>>(
    new Set(),
  );
  const [loraOptions, setLoraOptions] = createSignal<Map<string, LoRAOptions>>(
    new Map(),
  );
  const [showLoraOptions, setShowLoraOptions] = createSignal(false);

  const imageService = new ImageService("localhost:8188");
  const chatService = new ChatService("http://localhost:11434/api/chat");

  const getChat = () => {
    const chatContainer = document.querySelector<HTMLTextAreaElement>("#cud");
    if (!chatContainer) throw new Error("Chat container not found");
    return chatContainer;
  };

  const selectBGColor = () => {
    const model = chatModel();
    switch (model) {
      case "Elora":
        return "bg-purple-600";
      case "agentGreen":
        return "bg-green-600";
      case "Aureial":
        return "bg-yellow-600";
      case "Socrates":
        return "bg-indigo-600";
      case "wizzy":
        return "bg-sky-600";
      case "Crysta":
        return "bg-rose-600";
    }
    return "bg-slate-600";
  };

  const handleChat = async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Add user message to messages
      const messages = document.querySelector<HTMLUListElement>("#messages");
      if (!messages) throw new Error("Messages container not found");

      // Add user message using DOM
      const userElement = document.createElement("li");
      userElement.classList.add(
        "text-right",
        "bg-sky-600",
        "text-white",
        "rounded-md",
        "p-1",
        "my-2",
        "w-fit",
        "ml-auto",
      );
      userElement.textContent = message;
      messages.appendChild(userElement);

      const newMessage = { role: "USER", content: message } as Message;
      const updatedHistory = [...messagesHistory(), newMessage];
      setMessagesHistory(updatedHistory);

      const reader = await chatService.sendChat(
        message,
        chatModel(),
        updatedHistory,
      );
      if (!reader) throw new Error("Failed to get response reader");

      const decoder = new TextDecoder();
      let buffer = "";
      let fullResponse = "";

      // Create and append the response element immediately after user message
      const responseElement = document.createElement("li");
      responseElement.classList.add(
        "text-left",
        selectBGColor(),
        "text-white",
        "rounded-md",
        "p-1",
        "my-2",
        "w-fit",
        "mr-auto",
      );
      messages.appendChild(responseElement);

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

            // Update the response element's text content
            responseElement.textContent = fullResponse;

            // Scroll to bottom
            scrollToBottom();
          } catch (e) {
            console.error("Failed to parse chunk:", e);
          }
        }
      }

      // After the streaming is complete, log the final response
      console.log("Final response:", fullResponse);

      // Modify the image generation check to be more verbose:
      if (fullResponse.includes("[GENERATE_IMAGE]")) {
        console.log("Found [GENERATE_IMAGE] tag in response");
        try {
          const commandMatch = fullResponse.match(
            /\[GENERATE_IMAGE\]{([\s\S]+?)}/,
          );
          console.log("Command match result:", commandMatch);

          if (commandMatch) {
            const rawCommand = commandMatch[1];
            console.log("Raw command match data:", rawCommand);

            const fixedJson = rawCommand
              .replace(/prompt:/g, '"prompt":')
              .replace(/negative:/g, '"negative":')
              .replace(/resolution:/g, '"resolution":')
              .replace(
                /response_during_generation:/g,
                '"response_during_generation":',
              );

            console.log("Fixed JSON:", fixedJson);

            const params = JSON.parse(
              `{${fixedJson}}`,
            ) as ImageGenerationParams;
            console.log("Parsed params:", params);

            if (params.response_during_generation) {
              responseElement.textContent = params.response_during_generation;
            }

            const imageBlobs = await imageService.generateImage(
              params.prompt,
              params.negative,
              params.resolution,
            );

            if (!imageBlobs) throw new Error("Failed to generate image");

            // Modify the image element creation to include the necessary classes
            for (const blob of imageBlobs) {
              const imageUrl = URL.createObjectURL(blob);
              const imageElement = document.createElement("li");
              imageElement.classList.add("mr-auto"); // Add alignment class

              const img = document.createElement("img");
              img.src = imageUrl;
              img.classList.add(
                "max-w-[300px]", // Limit the initial size
                "rounded-md",
                "my-2",
                "cursor-pointer",
                "hover:opacity-90",
                "transition-opacity",
              );

              // Add click event listener for modal
              img.addEventListener("click", (e) => {
                const modalContainer = document.createElement("div");
                modalContainer.classList.add(
                  "fixed",
                  "inset-0",
                  "bg-black",
                  "bg-opacity-50",
                  "z-50",
                  "flex",
                  "items-center",
                  "justify-center",
                  "p-4",
                );

                const modalImage = document.createElement("img");
                modalImage.src = imageUrl;
                modalImage.classList.add(
                  "max-w-[90vw]",
                  "max-h-[90vh]",
                  "object-contain",
                );

                modalContainer.appendChild(modalImage);

                // Close modal when clicking outside the image
                modalContainer.addEventListener("click", (e) => {
                  if (e.target === modalContainer) {
                    modalContainer.remove();
                  }
                });

                document.body.appendChild(modalContainer);
              });

              imageElement.appendChild(img);
              messages.appendChild(imageElement);
            }

            setImages((prev) => [...prev, ...imageBlobs]);
          }
        } catch (error) {
          console.error("Error with full details:", error);
          setError(`Failed to generate image: ${error}`);
        }
      }

      // Update messages history after completion
      setMessagesHistory((prev) => [
        ...prev,
        { role: "ASSISTANT", content: fullResponse },
      ]);
    } catch (error) {
      setError(`Chat request failed: ${error}`);
      console.error("Chat request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedChat = debounce(handleChat, 500);

  const handleLoraToggle = (lora: string) => {
    const current = selectedLoras();
    const newSelected = new Set(current);
    const newOptions = new Map(loraOptions());

    if (current.has(lora)) {
      newSelected.delete(lora);
      newOptions.delete(lora);
      imageService.removeLoRA(lora);
    } else {
      newSelected.add(lora);
      newOptions.set(lora, {}); // Initialize with empty options
      imageService.addLoRA(lora);
    }

    setSelectedLoras(newSelected);
    setLoraOptions(newOptions);

    if (newSelected.size > 0 && !showLoraOptions()) {
      setShowLoraOptions(true);
    }
  };

  const handleLoraOptionsUpdate = (lora: string, options: LoRAOptions) => {
    const newOptions = new Map(loraOptions());
    newOptions.set(lora, options);
    setLoraOptions(newOptions);
    imageService.updateLoRAOptions(lora, options);
  };

  onMount(() => {
    onCleanup(() => {
      for (const blob of images()) {
        URL.revokeObjectURL(URL.createObjectURL(blob));
      }

      imageService.cleanup();
    });
  });

  const scrollToBottom = () => {
    const messagesContainer =
      document.querySelector<HTMLUListElement>("#messages");
    if (!messagesContainer) throw new Error("Messages container not found");

    // Check if user is already near bottom (within 100px)
    const isNearBottom =
      messagesContainer.scrollHeight -
        messagesContainer.scrollTop -
        messagesContainer.clientHeight <
      100;

    if (isNearBottom) {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <LORAOptionsMenuButton
        isOpen={showLoraOptions()}
        onToggle={() => setShowLoraOptions((prev) => !prev)}
        imageService={imageService}
        selectedLoras={selectedLoras()}
        loraOptions={loraOptions()}
        onOptionsUpdate={handleLoraOptionsUpdate}
      />
      <main class="text-center mx-auto text-gray-700 p-4 flex flex-col h-[94dvh]">
        <div class="flex-none relative">
          <ImageGallery images={images()} />
        </div>

        <div class="flex-1 flex flex-col min-h-0 p-4">
          <ErrorMessage message={error()} />
          <MessageList
            messages={messages()}
            selectBGColor={selectBGColor}
            currentModel={chatModel()}
          />

          <section class="flex-none bg-slate-900 rounded-md p-4">
            <ChatInput onSubmit={debouncedChat} isLoading={isLoading()} />

            <div class="flex flex-row justify-between w-full">
              <ModelSelector
                currentModel={chatModel()}
                onModelChange={setChatModel}
                isLoading={isLoading()}
              />

              <LORASelector
                imageService={imageService}
                isLoading={isLoading()}
                selectedLoras={selectedLoras()}
                onLoraToggle={handleLoraToggle}
              />

              <button
                type="button"
                class="bg-sky-600 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-600"
                onClick={() => debouncedChat(getChat().value)}
                disabled={isLoading()}
              >
                {isLoading() ? "Processing..." : "Compile"}
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
