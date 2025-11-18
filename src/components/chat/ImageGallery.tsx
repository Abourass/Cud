import {
  type Component,
  For,
  Show,
  createEffect,
  createSignal,
  onCleanup,
} from "solid-js";
import { ImageModal } from "./ImageModal";
import { useApp } from "~/context/AppContext";

export const ImageGallery: Component = () => {
  const { imageStore } = useApp();
  const [selectedImage, setSelectedImage] = createSignal<string | null>(null);
  const [isOpen, setIsOpen] = createSignal(false);
  const [imageUrls, setImageUrls] = createSignal<string[]>([]);

  // Update URLs when images change
  createEffect(() => {
    // Clean up old URLs first
    const oldUrls = imageUrls();
    for (const url of oldUrls) {
      URL.revokeObjectURL(url);
    }

    // Create new URLs
    const newUrls = imageStore.state.images.map((blob) =>
      URL.createObjectURL(blob),
    );
    setImageUrls(newUrls);
  });

  // Cleanup URLs when component unmounts
  onCleanup(() => {
    for (const url of imageUrls()) {
      URL.revokeObjectURL(url);
    }
  });

  return (
    <>
      <div class="relative w-full">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen())}
          class="absolute left-1/2 -translate-x-1/2
              bg-sky-800 text-white px-4 py-1 gap-2 -mt-5
              rounded-b-md
              hover:bg-sky-700 transition-colors z-10 flex items-center"
        >
          Gallery{" "}
          {imageUrls().length > 0 && `(${imageUrls().length})`}
          <span
            class={`transform transition-transform ${isOpen() ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </button>

        {/* Key changes in the container div below */}
        <div
          class={`w-full bg-slate-900 transition-all duration-300 ease-in-out rounded-md
              ${isOpen() ? "max-h-[200px] opacity-100 py-4" : "max-h-0 opacity-0 py-0"}
              overflow-hidden`}
        >
          <Show when={imageUrls().length > 0}>
            <div
              class="flex overflow-x-auto gap-4 px-4 snap-x snap-mandatory h-full
                  scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent
                  hover:scrollbar-thumb-gray-500"
            >
              <For each={imageUrls()}>
                {(imageUrl, index) => (
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
                )}
              </For>
            </div>

            <Show when={imageUrls().length > 1}>
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
