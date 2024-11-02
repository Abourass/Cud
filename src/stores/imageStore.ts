import { createStore } from "solid-js/store";
import type { ImageResolution, LoRAOptions } from "~/types";
import type { ImageService } from "~/services/imageService";

interface ImageState {
  images: Blob[];
  selectedLoras: Set<string>;
  loraOptions: Map<string, LoRAOptions>;
  isLoading: boolean;
  error: string | null;
  showLoraOptions: boolean;
}

const initialState: ImageState = {
  images: [],
  selectedLoras: new Set(),
  loraOptions: new Map(),
  isLoading: false,
  error: null,
  showLoraOptions: false,
};

export function createImageStore(imageService: ImageService) {
  const [state, setState] = createStore(initialState);

  const addImages = (images: Blob[]) => {
    setState("images", (prev) => [...prev, ...images]);
  };

  const generateImage = async (
    prompt: string,
    negative?: string,
    resolution?: ImageResolution,
  ) => {
    setState("isLoading", true);
    setState("error", null);

    try {
      const imageBlobs = await imageService.generateImage(
        prompt,
        negative,
        resolution,
      );
      setState("images", (prev) => [...prev, ...imageBlobs]);
      return imageBlobs;
    } catch (error) {
      setState("error", `Image generation failed: ${error}`);
      return null;
    } finally {
      setState("isLoading", false);
    }
  };

  const addLora = (lora: string) => {
    const newSelected = new Set(state.selectedLoras).add(lora);
    const newOptions = new Map(state.loraOptions);
    newOptions.set(lora, {});
    setState("selectedLoras", newSelected);
    setState("loraOptions", newOptions);
    imageService.addLoRA(lora);
  };

  const removeLora = (lora: string) => {
    const newSelected = new Set(state.selectedLoras);
    newSelected.delete(lora);
    const newOptions = new Map(state.loraOptions);
    newOptions.delete(lora);
    setState("selectedLoras", newSelected);
    setState("loraOptions", newOptions);
    imageService.removeLoRA(lora);
  };

  const toggleLora = (lora: string) => {
    if (state.selectedLoras.has(lora)) {
      removeLora(lora);
    } else {
      addLora(lora);
    }
  };

  return {
    state,
    generateImage,
    setError: (error: string | null) => setState("error", error),
    addLora,
    removeLora,
    getLoRAs: () => imageService.getLoRAs(),
    toggleLora,
    addImages,
    setSelectedLoras: (loras: Set<string>) => setState("selectedLoras", loras),
    setLoraOptions: (options: Map<string, LoRAOptions>) =>
      setState("loraOptions", options),
    toggleLoraOptions: () => setState("showLoraOptions", (show) => !show),
    updateLoraOptions: (lora: string, options: LoRAOptions) => {
      const newOptions = new Map(state.loraOptions);
      newOptions.set(lora, options);
      setState("loraOptions", newOptions);
      imageService.updateLoRAOptions(lora, options);
    },
    cleanup: () => {
      imageService.cleanup();
      for (const blob of state.images) {
        URL.revokeObjectURL(URL.createObjectURL(blob));
      }
    },
  };
}
