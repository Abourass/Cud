# CUD - Chat + Image Generation

An AI-powered chat application that seamlessly integrates conversational AI with image generation. Built with SolidJS, connecting Ollama for dynamic chat experiences and ComfyUI for high-quality image generation with LoRA support.

## Features

- **Multiple AI Models**: Choose from Elora, agentGreen, Aureial, Socrates, wizzy, and Crysta
- **Real-time Streaming**: Watch responses appear in real-time as the AI generates them
- **Dynamic Image Generation**: Trigger image generation through natural conversation
- **5 Resolution Presets**: Selfie, Profile, Landscape, Square, and Portrait
- **LoRA Customization**: Fine-tune image generation with Low-Rank Adaptation parameters
- **Image Gallery**: View and download all generated images
- **Download Functionality**: Export generated images with a single click
- **Responsive Design**: Beautiful UI with smooth animations and transitions

## Tech Stack

- **Frontend**: SolidJS v1.9.3 with SolidStart v1.0.10
- **Styling**: TailwindCSS v3.4.3 with custom scrollbar support
- **Type Safety**: TypeScript with strict mode
- **Build Tool**: Vinxi v0.4.3
- **APIs**: Ollama (chat) + ComfyUI (image generation)
- **State Management**: SolidJS fine-grained reactivity with stores

## Prerequisites

- Node.js >= 18
- pnpm (recommended) or npm
- [Ollama](https://ollama.ai) running locally on port 11434
- [ComfyUI](https://github.com/comfyanonymous/ComfyUI) running locally on port 8188

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Cud
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables** (optional)
   ```bash
   cp .env.example .env
   ```

   Edit `.env` to customize:
   - `VITE_OLLAMA_API_URL` - Ollama API endpoint (default: http://localhost:11434/api/chat)
   - `VITE_COMFYUI_API_URL` - ComfyUI endpoint (default: localhost:8188)
   - `VITE_DEFAULT_MODEL` - Default chat model (default: Socrates)
   - `VITE_DEFAULT_RESOLUTION` - Default image resolution (default: landscape)

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
src/
├── components/          # UI components
│   ├── chat/           # Chat-related components
│   │   ├── ChatInput.tsx
│   │   ├── MessageList.tsx
│   │   ├── ModelSelector.tsx
│   │   ├── LORASelector.tsx
│   │   ├── ImageGallery.tsx
│   │   └── ImageModal.tsx
│   ├── layout/         # Layout components
│   └── Nav.tsx         # Navigation bar
├── services/           # Business logic & API integration
│   ├── Services.ts     # Service factory singleton
│   ├── chatService.ts  # Ollama API integration
│   ├── imageService.ts # ComfyUI integration
│   └── resourceManager.ts  # URL lifecycle management
├── stores/             # Reactive state management
│   ├── chatStore.ts    # Chat state & messaging
│   └── imageStore.ts   # Image state & generation
├── context/            # React-like Context API
│   └── AppContext.tsx  # Dependency injection
├── routes/             # File-based routing
│   ├── index.tsx       # Main chat page
│   ├── about.tsx       # About page
│   └── [...404].tsx    # 404 fallback
├── types/              # TypeScript definitions
├── config/             # Configuration
│   └── environment.ts  # API endpoints & presets
└── app.css             # Global styles
```

## Architecture Highlights

### Service Layer
- **Singleton Pattern**: Services are managed through `Services.getInstance()`
- **Resource Management**: `ResourceManager` handles all Object URL lifecycle
- **Health Checks**: Both services include health check methods for monitoring

### State Management
- **Reactive Stores**: Built on SolidJS fine-grained reactivity
- **Centralized URLs**: All Object URLs managed by ResourceManager to prevent memory leaks
- **Proper Cleanup**: All resources cleaned up on unmount

### Component Architecture
- **Dependency Injection**: Services and stores provided via Context
- **Separation of Concerns**: UI components separated from business logic
- **Error Boundaries**: Graceful error handling throughout

## Recent Improvements

### Phase 1: Critical Fixes
- ✅ Fixed 3 memory leaks related to Object URL management
- ✅ Removed duplicate/unused code (Stores.ts)
- ✅ Added environment variable support
- ✅ Replaced console.log with proper logging (consola)

### Phase 2: Resource Management
- ✅ Created centralized ResourceManager service
- ✅ Migrated all URL creation to use ResourceManager
- ✅ Consolidated cleanup logic
- ✅ Simplified component code

### Phase 3: Polish
- ✅ Added connection health checks for both APIs
- ✅ Implemented image download functionality
- ✅ Removed unused components
- ✅ Updated About page with project information

## Usage

### Starting a Chat
1. Select a model from the dropdown (Socrates is default)
2. Type your message in the chat input
3. Press Enter or click "Compile" to send

### Generating Images
Simply ask the AI to create an image in natural language:
- "Take a selfie of a cat"
- "Create a landscape photo of mountains at sunset"
- "Draw a portrait of a wizard"

The AI will automatically trigger image generation with appropriate settings.

### Using LoRAs
1. Click the LoRA selector dropdown
2. Choose desired LoRA adapters
3. Click the options button to fine-tune parameters:
   - Clip Strength
   - Strength
   - Weight
4. Generated images will use your selected LoRAs

### Downloading Images
- Click any image in the gallery or message list to open full-screen view
- Click the "Download" button in the top-right corner
- Image will be saved as `generated-image-{timestamp}.png`

## Configuration

### Available Models
- **Elora** - Purple theme
- **agentGreen** - Green theme
- **Aureial** - Yellow theme
- **Socrates** - Indigo theme (default)
- **wizzy** - Sky blue theme
- **Crysta** - Rose theme

### Image Resolutions
- **Selfie**: 512x768 - Vertical, close-up shots
- **Profile**: 768x512 - Horizontal, profile views
- **Landscape**: 1024x768 - Wide format (default)
- **Square**: 768x768 - Balanced compositions
- **Portrait**: 768x1024 - Tall, full body shots

## Troubleshooting

### Ollama not connecting
- Ensure Ollama is running: `ollama serve`
- Check the API URL in your `.env` file
- Verify port 11434 is accessible

### ComfyUI not connecting
- Start ComfyUI server
- Check the API URL in your `.env` file
- Verify port 8188 is accessible

### Images not generating
- Ensure the ComfyUI model `Pony/cyberrealisticPony_v65.safetensors` is installed
- Check ComfyUI console for errors
- Verify LoRA files exist if using LoRA options

## Development

### Type Checking
```bash
pnpm tsc --noEmit
```

### Linting
```bash
pnpm eslint src/
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[Add your license here]

## Acknowledgments

- [SolidJS](https://solidjs.com) - Reactive UI framework
- [Ollama](https://ollama.ai) - Local AI models
- [ComfyUI](https://github.com/comfyanonymous/ComfyUI) - Image generation
- [TailwindCSS](https://tailwindcss.com) - Styling framework
