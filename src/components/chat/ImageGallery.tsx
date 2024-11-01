import { type Component, For, Show, createSignal } from "solid-js";
import { ImageModal } from "./ImageModal";

interface ImageGalleryProps {
  images: Blob[];
}

export const ImageGallery: Component<ImageGalleryProps> = (props) => {
  const [selectedImage, setSelectedImage] = createSignal<string | null>(null);
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <>
      <div class="relative w-full">
        {/* Toggle Button - Always visible */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen())}
          class="absolute left-1/2 -translate-x-1/2
            bg-sky-800 text-white px-4 py-1 gap-2 -mt-5
            rounded-b-md
            hover:bg-sky-700 transition-colors z-10 flex items-center"
        >
          Gallery {props.images.length > 0 && `(${props.images.length})`}
          <span
            class={`transform transition-transform ${isOpen() ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </button>

        {/* Sliding Panel */}
        <div
          class={`w-full bg-slate-900 overflow-hidden transition-[height,opacity] duration-300 ease-in-out rounded-md
            ${isOpen() ? "h-[200px] opacity-100" : "h-0 opacity-0"}`}
        >
          <Show when={props.images.length > 0}>
            <div
              class="flex overflow-x-auto gap-4 p-4 snap-x snap-mandatory h-full
              scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent
              hover:scrollbar-thumb-gray-500"
            >
              <For each={props.images}>
                {(blob, index) => {
                  const imageUrl = URL.createObjectURL(blob);
                  return (
                    <div class="flex-none snap-center">
                      <img
                        src={imageUrl}
                        alt={`Generated ${index() + 1}`}
                        class="h-40 rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedImage(imageUrl)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setSelectedImage(imageUrl);
                          }
                        }}
                      />
                    </div>
                  );
                }}
              </For>
            </div>

            <Show when={props.images.length > 1}>
              <button
                type="button"
                class="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2
                  rounded-full hover:bg-opacity-75"
                onClick={() => {
                  const container = document.querySelector(".overflow-x-auto");
                  if (container) {
                    container.scrollBy({ left: -300, behavior: "smooth" });
                  }
                }}
              >
                ←
              </button>
              <button
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2
                  rounded-full hover:bg-opacity-75"
                onClick={() => {
                  const container = document.querySelector(".overflow-x-auto");
                  if (container) {
                    container.scrollBy({ left: 300, behavior: "smooth" });
                  }
                }}
              >
                →
              </button>
            </Show>
          </Show>
        </div>
      </div>

      <ImageModal
        src={selectedImage() ?? ""}
        isOpen={selectedImage() !== null}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
};
