import { createSignal, onCleanup } from "solid-js";
import { debounce } from "@solid-primitives/scheduled";
import { ChatInput } from "~/components/chat/ChatInput";
import { ModelSelector } from "~/components/chat/ModelSelector";
import { MessageList } from "~/components/chat/MessageList";
import { ImageGallery } from "~/components/chat/ImageGallery";
import { ErrorMessage } from "~/components/chat/ErrorMessage";
import type { ChatModels, ImageResolution } from "~/types";
import { LORASelector } from "~/components/chat/LORASelector";
import { LORAOptionsMenuButton } from "~/components/chat/LORAOptionsMenuButton";
import { Services } from "~/services/Services";
import { useApp } from "~/context/AppContext";

interface ImageGenerationParams {
  prompt: string;
  negative?: string;
  resolution?: ImageResolution;
  response_during_generation?: string;
}

export default function Home() {
  // Services and Stores setup
  const services = Services.getInstance();
  const chatService = services.getChatService();
  const imageService = services.getImageService();
  const { chatStore, imageStore } = useApp();

  // Local state for UI
  const [isLoading, setIsLoading] = createSignal(false);

  // Background color selection based on chat model
  const selectBGColor = () => {
    const model = chatStore.state.currentModel;
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
      default:
        return "bg-slate-600";
    }
  };

  // Chat handling
  const handleChat = async (message: string) => {
    if (!message.trim()) return;
    setIsLoading(true);

    try {
      await chatStore.sendMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedChat = debounce(handleChat, 500);

  // LORA handling
  const handleLoraToggle = (lora: string) => {
    const current = imageStore.state.selectedLoras;
    if (current.has(lora)) {
      imageStore.removeLora(lora);
    } else {
      imageStore.addLora(lora);
    }
  };

  // Cleanup
  onCleanup(() => {
    imageStore.cleanup();
    // chatStore.cleanup();
  });

  return (
    <>
      <LORAOptionsMenuButton />
      <main class="text-center mx-auto text-gray-700 p-4 flex flex-col h-[94dvh]">
        <div class="flex-none relative">
          <ImageGallery />
        </div>

        <div class="flex-1 flex flex-col min-h-0 p-4">
          <ErrorMessage
            message={chatStore.state.error || imageStore.state.error}
          />
          <MessageList
            messages={chatStore.state.messages}
            selectBGColor={selectBGColor}
            currentModel={chatStore.state.currentModel}
          />

          <section class="flex-none bg-slate-900 rounded-md p-4">
            <ChatInput onSubmit={debouncedChat} isLoading={isLoading()} />

            <div class="flex flex-row justify-between w-full">
              <ModelSelector
                currentModel={chatStore.state.currentModel}
                onModelChange={chatStore.setModel}
                isLoading={isLoading()}
              />

              <LORASelector isLoading={isLoading()} />

              <button
                type="button"
                class="bg-sky-600 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-600"
                onClick={() => {
                  const chatInput =
                    document.querySelector<HTMLTextAreaElement>("#cud");
                  if (chatInput) {
                    debouncedChat(chatInput.value);
                  }
                }}
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
