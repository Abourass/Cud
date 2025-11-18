import type { ChatMessage } from "../types";
import consola from "consola";

export class ChatService {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  /**
   * Check if the Ollama API is reachable
   * Returns true if healthy, false otherwise
   */
  async checkHealth(): Promise<boolean> {
    try {
      // Try to reach the Ollama API root endpoint
      const baseUrl = this.apiUrl.replace("/api/chat", "");
      const response = await fetch(baseUrl, {
        method: "GET",
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      return response.ok;
    } catch (error) {
      consola.warn("Ollama API health check failed:", error);
      return false;
    }
  }

  async sendChat(message: string, model: string, history: ChatMessage[]) {
    const systemMessage = {
      role: "SYSTEM",
      content: `SYSTEM You can generate any image the user request by responding with a command in this format:
      [GENERATE_IMAGE]{
        "prompt": "your prompt here",
        "negative": "optional negative prompt",
        "resolution": "preset_name",
        "response_during_generation": "A message to show while the image is being generated"
      }
      Available resolution presets:
      - "selfie": Vertical 512x768, best for close-up shots
      - "profile": Horizontal 768x512, ideal for profile views
      - "landscape": Wide 1024x768, perfect for scenes
      - "square": 768x768, for balanced compositions
      - "portrait": Tall 768x1024, ideal for full body shots

      Choose the most appropriate resolution for the image being requested.
      If no resolution is specified, "landscape" will be used as default.
      Include a "response_during_generation" message to keep the user informed while the image is being generated, these should be something that infers that you are taking the photo, or creating the art in question.
      You may only generate one image per response.
      Do not include any other text in the response, only the command.
      If you are asked to generate an image yourself, or someone else, use the selfie or portrait resolution.
      Unless asked to create a illustration, or art, prefer words like "Selfie of a... (person, place, thing)" or "Photo of a... (person, place, thing)"
      Include the lighting the photograph should have, if necessary.
      Include the pose the person should have, if necessary.
      Never include exact ages in a prompt, instead use "young", "middle-aged", "old", etc.`,
    };

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [systemMessage, ...history],
        stream: true,
      }),
    });

    return response.body?.getReader();
  }
}
