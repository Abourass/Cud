export const config = {
  apiUrl:
    import.meta.env.VITE_OLLAMA_API_URL || "http://localhost:11434/api/chat",
  imageApiUrl: import.meta.env.VITE_COMFYUI_API_URL || "localhost:8188",
  defaults: {
    model: (import.meta.env.VITE_DEFAULT_MODEL as const) || ("Socrates" as const),
    resolution: (import.meta.env.VITE_DEFAULT_RESOLUTION as const) || ("landscape" as const),
  },
  imagePresets: {
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
  },
} as const;
