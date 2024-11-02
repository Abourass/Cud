import {
  createSignal,
  createResource,
  type Component,
  Index,
  onMount,
  onCleanup,
  Show,
  For,
} from "solid-js";
import { useApp } from "~/context/AppContext";

interface LORASelectorProps {
  isLoading: boolean;
  // selectedLoras: Set<string>;
  // onLoraToggle: (lora: string) => void;
}

export const LORASelector: Component<LORASelectorProps> = (props) => {
  const { imageStore } = useApp();
  const [loras] = createResource(() => imageStore.getLoRAs());
  const [isDropdownOpen, setIsDropdownOpen] = createSignal(false);

  // Close dropdown when clicking outside
  let dropdownRef: HTMLDivElement | undefined;
  onMount(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Get the clicked element
      const target = event.target as HTMLElement;

      // Check if the click is on a scrollbar by checking if the click position
      // is beyond the element's content width/height
      const isScrollbarClick =
        dropdownRef &&
        event.clientX > dropdownRef.getBoundingClientRect().right - 15; // 15px is approximate scrollbar width

      // Only close if it's not a scrollbar click and the click is outside the dropdown
      if (!isScrollbarClick && dropdownRef && !dropdownRef.contains(target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    onCleanup(() =>
      document.removeEventListener("mousedown", handleClickOutside),
    );
  });

  return (
    <div class="relative m-2" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen())}
        disabled={props.isLoading || loras.loading}
        class="bg-slate-800 text-white rounded-md px-4 py-2 flex items-center justify-between w-48
              focus:outline-none focus:ring-2 focus:ring-sky-600 disabled:opacity-50"
      >
        <span>
          {imageStore.state.selectedLoras.size === 0
            ? "Select LORAs"
            : `Selected: ${imageStore.state.selectedLoras.size}`}
        </span>
        <span
          class={`transform transition-transform duration-200 ${
            isDropdownOpen() ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      <Show when={isDropdownOpen()}>
        <div
          class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-[60dvw] bg-slate-800 rounded-md shadow-lg
              max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent z-50"
        >
          <For each={loras() || []}>
            {(lora) => (
              <button
                type="button"
                class="w-full px-4 py-2 text-left text-white hover:bg-slate-700 flex items-center gap-2"
                onClick={() => imageStore.toggleLora(lora)}
              >
                <span class="w-4">
                  {imageStore.state.selectedLoras.has(lora) && "✓"}
                </span>
                {lora}
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};
