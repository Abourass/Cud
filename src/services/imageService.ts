import { Client, EfficientPipe } from "@stable-canvas/comfyui-client";
import type { ImagePresets, ImageResolution } from "~/types";
import consola from "consola";

interface LoRAOptions {
  clip_strength?: number;
  strength?: number;
  weight?: number;
}

export class ImageService {
  private client: Client;
  private isConnected = false;
  private currentLoRAs = new Map<string, LoRAOptions>();
  private activeLoRAs = new Set<string>();
  private readonly presets: ImagePresets = {
    selfie: {
      width: 512,
      height: 768,
      description:
        "Vertical orientation optimized for close-up shots (512x768)",
    },
    profile: {
      width: 768,
      height: 512,
      description: "Horizontal orientation good for profile views (768x512)",
    },
    landscape: {
      width: 1024,
      height: 768,
      description: "Wide format ideal for landscapes and scenes (1024x768)",
    },
    square: {
      width: 768,
      height: 768,
      description: "Perfect square format (768x768)",
    },
    portrait: {
      width: 768,
      height: 1024,
      description: "Tall vertical format for full body shots (768x1024)",
    },
  };

  public addLoRA(lora: string, options: LoRAOptions = {}) {
    this.currentLoRAs.set(lora, options);
  }

  public removeLoRA(lora: string) {
    this.currentLoRAs.delete(lora);
  }

  public hasLoRAs() {
    return this.currentLoRAs.size > 0;
  }

  public getCurrentLoRAs() {
    return this.currentLoRAs;
  }

  public resetLoRAs() {
    this.currentLoRAs.clear();
  }

  public updateLoRAOptions(lora: string, options: LoRAOptions) {
    if (this.currentLoRAs.has(lora)) {
      this.currentLoRAs.set(lora, options);
    }
  }

  constructor(apiHost: string) {
    this.client = new Client({
      api_host: apiHost,
      clientId: "solidjs-app",
    });
  }

  private async ensureConnection() {
    if (!this.isConnected) {
      try {
        this.client.connect();
        this.isConnected = true;
      } catch (error) {
        consola.error("Failed to connect to ComfyUI:", error);
        throw error;
      }
    }
  }

  async getLoRAs() {
    await this.ensureConnection();
    const LoRAs = await this.client.getLoRAs();
    return LoRAs;
  }

  async generateImage(
    prompt: string,
    negative?: string,
    resolution: ImageResolution = "landscape",
  ) {
    try {
      await this.ensureConnection();

      const { width, height } = this.presets[resolution];

      let pipe = new EfficientPipe()
        .with(this.client)
        .model("Pony/cyberrealisticPony_v65.safetensors")
        .prompt(prompt)
        .negative(`${negative}, Low quality, blurry, bad anotomy`)
        .size(width, height)
        .steps(35)
        .cfg(5);

      if (this.hasLoRAs()) {
        for (const [lora, options] of this.currentLoRAs) {
          // Only add if not already active
          if (!this.activeLoRAs.has(lora)) {
            pipe = pipe.lora(lora, options);
            this.activeLoRAs.add(lora);
          }
        }
      }

      const result = await pipe.save().wait();

      return result.images.map(
        (img) => new Blob([img.data], { type: "image/png" }),
      );
    } catch (error) {
      consola.error("Failed to generate image:", error);
      this.isConnected = false; // Reset connection state on error
      throw error;
    }
  }

  // Add a cleanup method
  cleanup() {
    if (this.isConnected) {
      this.client.close();
      this.isConnected = false;
    }
  }
}
