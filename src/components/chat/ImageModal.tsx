import { type Component, Show } from "solid-js";

interface ImageModalProps {
  src: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageModal: Component<ImageModalProps> = (props) => {
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
        <div class="max-w-[90vw] max-h-[90vh]">
          <img
            src={props.src}
            alt="Full size"
            class="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </Show>
  );
};
