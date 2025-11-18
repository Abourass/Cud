import type { createChatStore } from "~/stores/chatStore";
import type { createImageStore } from "~/stores/imageStore";

export interface ChatMessage {
  role: "USER" | "ASSISTANT" | "SYSTEM";
  content: string;
}

export type ChatStore = ReturnType<typeof createChatStore>;
export type ImageStore = ReturnType<typeof createImageStore>;

export interface LoRAOptions {
  clip_strength?: number;
  strength?: number;
  weight?: number;
}

export type ImageResolution =
  | "selfie"
  | "profile"
  | "landscape"
  | "square"
  | "portrait";

export interface ImagePresets {
  selfie: { width: number; height: number; description: string };
  profile: { width: number; height: number; description: string };
  landscape: { width: number; height: number; description: string };
  square: { width: number; height: number; description: string };
  portrait: { width: number; height: number; description: string };
}

export interface Message {
  role: "USER" | "ASSISTANT";
  content: string;
  type: "text" | "image";
  url?: string;
  isGenerating?: boolean;
  progress?: number;
}

export interface ImageGenerationParams {
  prompt: string;
  negative?: string;
}

export type ChatModels =
  | "Elora"
  | "agentGreen"
  | "Aureial"
  | "Socrates"
  | "wizzy"
  | "Crysta";
