import { A } from "@solidjs/router";

export default function About() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4 max-w-4xl">
      <h1 class="text-6xl text-sky-700 font-thin uppercase my-16">CUD</h1>

      <div class="text-left space-y-6 text-gray-800">
        <section>
          <h2 class="text-2xl font-semibold text-sky-600 mb-3">
            Chat + Image Generation
          </h2>
          <p class="leading-relaxed">
            CUD is an AI-powered chat application that seamlessly integrates
            conversational AI with image generation. Built with SolidJS, it
            connects to Ollama for dynamic chat experiences and ComfyUI for
            high-quality image generation with LoRA support.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-sky-600 mb-3">Features</h2>
          <ul class="list-disc list-inside space-y-2 leading-relaxed">
            <li>
              Multiple AI models: Elora, agentGreen, Aureial, Socrates, wizzy,
              Crysta
            </li>
            <li>Real-time streaming chat responses</li>
            <li>
              Dynamic image generation triggered by conversation with 5
              resolution presets
            </li>
            <li>LoRA (Low-Rank Adaptation) customization support</li>
            <li>Image gallery with download functionality</li>
            <li>Responsive design with smooth animations</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-sky-600 mb-3">
            Tech Stack
          </h2>
          <ul class="list-disc list-inside space-y-2 leading-relaxed">
            <li>SolidJS - Reactive UI framework</li>
            <li>TypeScript - Type-safe development</li>
            <li>TailwindCSS - Utility-first styling</li>
            <li>Ollama API - Conversational AI</li>
            <li>ComfyUI - Image generation backend</li>
          </ul>
        </section>

        <p class="mt-8 text-center">
          <A href="/" class="text-sky-600 hover:underline text-lg">
            ← Back to Chat
          </A>
        </p>
      </div>
    </main>
  );
}
