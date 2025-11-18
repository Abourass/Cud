import { type Component, createSignal, For, Show } from "solid-js";
import type { Message } from "../../types";
import { ImageModal } from "./ImageModal";
import { MessageSkeleton } from "./MessageSkeleton";
import { ProgressIndicator } from "./ProgressIndicator";

interface MessageListProps {
  messages: Message[];
  selectBGColor: () => string;
  currentModel: string;
  isLoading?: boolean;
}

export const MessageList: Component<MessageListProps> = (props) => {
  const [selectedImage, setSelectedImage] = createSignal<string | null>(null);
  const handleImageSelect = (url: string | undefined) => {
    if (url) {
      setSelectedImage(url);
    }
  };

  return (
    <>
      <ul
        class="bg-slate-900 text-white rounded-md p-4 mb-2
          list-none flex flex-col
          overflow-y-auto h-[60vh]
          scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent
          hover:scrollbar-thumb-gray-500"
        id="messages"
      >
        <Show
          when={!props.isLoading}
          fallback={<MessageSkeleton count={3} align="alternate" />}
        >
          <For each={props.messages}>
            {(message) => (
              <li class={message.role === "USER" ? "ml-auto" : "mr-auto"}>
                {message.isGenerating ? (
                  <div class="my-2">
                    <ProgressIndicator
                      message={message.content}
                      progress={message.progress}
                      isIndeterminate={message.progress === undefined}
                    />
                  </div>
                ) : message.type === "text" ? (
                  <p
                    class={`${
                      message.role === "USER"
                        ? "bg-sky-600"
                        : props.selectBGColor()
                    } text-white rounded-md p-1 my-2 w-fit`}
                  >
                    {message.content}
                  </p>
                ) : (
                  <button
                    type="button"
                    class="p-0 border-0 bg-transparent"
                    onClick={() => handleImageSelect(message.url)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleImageSelect(message.url);
                      }
                    }}
                  >
                    <img
                      src={message.url ?? ""}
                      class="max-w-[300px] rounded-md my-2 hover:opacity-90 transition-opacity"
                      alt="Generated content"
                    />
                  </button>
                )}
              </li>
            )}
          </For>
        </Show>
      </ul>

      <ImageModal
        src={selectedImage() ?? ""}
        isOpen={selectedImage() !== null}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
};
