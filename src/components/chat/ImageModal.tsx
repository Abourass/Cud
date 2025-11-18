import { type Component, Show } from "solid-js";

interface ImageModalProps {
  src: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageModal: Component<ImageModalProps> = (props) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(props.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  return (
    <Show when={props.isOpen}>
      <div
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={props.onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            props.onClose();
          }
        }}
      >
        <div class="relative max-w-[90vw] max-h-[90vh]">
          <img
            src={props.src}
            alt="Full size"
            class="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
            onKeyDown={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            class="absolute top-4 right-4 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md
                   transition-colors flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
          >
            ⬇ Download
          </button>
        </div>
      </div>
    </Show>
  );
};
