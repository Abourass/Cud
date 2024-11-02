import { Show, type Component } from "solid-js";
import type { ImageService } from "~/services/imageService";
import { LORAOptionsMenu } from "./LORAOptionsMenu";
import type { LoRAOptions } from "~/types";
import { useApp } from "~/context/AppContext";

export const LORAOptionsMenuButton: Component = () => {
  const { imageStore } = useApp();

  return (
    <Show when={imageStore.state.selectedLoras.size > 0}>
      <div class="flex items-start z-[100] fixed top-[14.5dvh] -right-9">
        <button
          type="button"
          onClick={imageStore.toggleLoraOptions}
          class="transform -translate-x-12 rotate-90 origin-right
          bg-slate-800 text-white px-4 py-2 rounded-b-lg
          hover:bg-slate-700 transition-colors
          flex items-center gap-2 whitespace-nowrap"
        >
          LORAs
          <span
            class={`transform transition-transform duration-300 ${
              imageStore.state.showLoraOptions ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        <LORAOptionsMenu
          isOpen={imageStore.state.showLoraOptions}
          onClose={imageStore.toggleLoraOptions}
        />
      </div>
    </Show>
  );
};
