import {
  type Component,
  createSignal,
  createEffect,
  Show,
  For,
} from "solid-js";
import { useApp } from "~/context/AppContext";

interface LORAOptionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LORAOptionsMenu: Component<LORAOptionsMenuProps> = (props) => {
  const { imageStore } = useApp();
  const [activeTab, setActiveTab] = createSignal<string>(
    Array.from(imageStore.state.loraOptions.keys())[0] || "",
  );

  const loraKeys = () => Array.from(imageStore.state.loraOptions.keys());

  const getCurrentOptions = () => {
    const currentLora = activeTab();
    return currentLora
      ? imageStore.state.loraOptions.get(currentLora) || {}
      : {};
  };

  createEffect(() => {
    const selectedLoras = loraKeys();
    if (
      (selectedLoras.length > 0 && !activeTab()) ||
      !selectedLoras.includes(activeTab())
    ) {
      setActiveTab(selectedLoras[0]);
    }
  });

  const handleSubmit = (e: Event, lora: string) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const options = {
      clip_strength: Number(formData.get("clip_strength")) || undefined,
      strength: Number(formData.get("strength")) || undefined,
      weight: Number(formData.get("weight")) || undefined,
    };

    imageStore.updateLoraOptions(lora, options);
  };

  return (
    <div class="fixed right-0 top-1/4 flex items-start z-50">
      <div
        class={`w-80 bg-slate-800 text-white transform transition-transform duration-300 ease-in-out
            ${props.isOpen ? "translate-x-0" : "translate-x-full"}
            shadow-lg max-h-[70vh] overflow-y-auto`}
      >
        <div class="p-4">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">LORA Options</h2>
            <button
              type="button"
              onClick={props.onClose}
              class="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* LORA Selection Tabs */}
          <div
            class="flex flex-col gap-2 mb-4 max-h-[30vh] overflow-y-auto
                      scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent
                      hover:scrollbar-thumb-gray-500"
          >
            <For each={loraKeys()}>
              {(lora) => (
                <button
                  type="button"
                  onClick={() => setActiveTab(lora)}
                  class={`text-left p-2 rounded transition-colors ${
                    activeTab() === lora
                      ? "bg-sky-600"
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                >
                  {lora}
                </button>
              )}
            </For>
          </div>

          <Show when={activeTab()}>
            <form
              onSubmit={(e) => handleSubmit(e, activeTab())}
              class="space-y-4"
            >
              <div>
                <label for="clip_strength" class="block text-sm mb-1">
                  Clip Strength
                </label>
                <input
                  id="clip_strength"
                  type="number"
                  name="clip_strength"
                  step="0.1"
                  value={getCurrentOptions().clip_strength ?? ""}
                  class="w-full bg-slate-700 rounded px-3 py-2"
                  placeholder="Default: 1.0"
                />
              </div>

              <div>
                <label for="strength" class="block text-sm mb-1">
                  Strength
                </label>
                <input
                  id="strength"
                  type="number"
                  name="strength"
                  step="0.1"
                  value={getCurrentOptions().strength ?? ""}
                  class="w-full bg-slate-700 rounded px-3 py-2"
                  placeholder="Default: 1.0"
                />
              </div>

              <div>
                <label for="weight" class="block text-sm mb-1">
                  Weight
                </label>
                <input
                  id="weight"
                  type="number"
                  name="weight"
                  step="0.1"
                  value={getCurrentOptions().weight ?? ""}
                  class="w-full bg-slate-700 rounded px-3 py-2"
                  placeholder="Default: 1.0"
                />
              </div>

              <button
                type="submit"
                class="w-full bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded"
              >
                Apply Options
              </button>
            </form>
          </Show>
        </div>
      </div>
    </div>
  );
};
