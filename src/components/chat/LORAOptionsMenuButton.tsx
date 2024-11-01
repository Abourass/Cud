import { Show, type Component } from "solid-js";
import type { ImageService } from "~/services/imageService";
import { LORAOptionsMenu } from "./LORAOptionsMenu";
import type { LoRAOptions } from "~/types";

interface LORAOptionsMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  imageService: ImageService;
  selectedLoras: Set<string>;
  loraOptions: Map<string, LoRAOptions>;
  onOptionsUpdate: (lora: string, options: LoRAOptions) => void;
}

export const LORAOptionsMenuButton: Component<LORAOptionsMenuButtonProps> = (
  props,
) => {
  return (
    <Show when={props.selectedLoras.size > 0}>
      <div class="flex items-start z-[100] fixed top-[14.5dvh] -right-9">
        <button
          type="button"
          onClick={props.onToggle}
          class="transform -translate-x-12 rotate-90 origin-right
          bg-slate-800 text-white px-4 py-2 rounded-b-lg
          hover:bg-slate-700 transition-colors
          flex items-center gap-2 whitespace-nowrap"
        >
          LORAs
          <span
            class={`transform transition-transform duration-300 ${
              props.isOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        <LORAOptionsMenu
          isOpen={props.isOpen}
          selectedLoras={props.loraOptions}
          imageService={props.imageService}
          onClose={props.onToggle}
          onOptionsUpdate={props.onOptionsUpdate}
        />
      </div>
    </Show>
  );
};
