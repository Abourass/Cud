import { Component, createSignal, onMount, onCleanup, Show } from "solid-js";
import { Services } from "~/services/Services";
import consola from "consola";

interface ServiceStatus {
  chat: boolean;
  image: boolean;
  lastChecked: Date | null;
}

export const ConnectionStatus: Component = () => {
  const [status, setStatus] = createSignal<ServiceStatus>({
    chat: false,
    image: false,
    lastChecked: null,
  });
  const [isExpanded, setIsExpanded] = createSignal(false);
  const [isChecking, setIsChecking] = createSignal(false);

  let intervalId: number | undefined;

  const checkHealth = async () => {
    if (isChecking()) return;

    setIsChecking(true);
    const services = Services.getInstance();

    try {
      const [chatHealth, imageHealth] = await Promise.all([
        services.getChatService().checkHealth(),
        services.getImageService().checkHealth(),
      ]);

      setStatus({
        chat: chatHealth,
        image: imageHealth,
        lastChecked: new Date(),
      });

      consola.info("Health check:", { chatHealth, imageHealth });
    } catch (error) {
      consola.error("Health check failed:", error);
    } finally {
      setIsChecking(false);
    }
  };

  onMount(() => {
    // Initial health check
    checkHealth();

    // Periodic health check every 30 seconds
    intervalId = window.setInterval(checkHealth, 30000);
  });

  onCleanup(() => {
    if (intervalId !== undefined) {
      clearInterval(intervalId);
    }
  });

  const getStatusColor = (isHealthy: boolean) =>
    isHealthy ? "bg-green-500" : "bg-red-500";

  const getStatusIcon = (isHealthy: boolean) =>
    isHealthy ? "✓" : "✗";

  const allHealthy = () => status().chat && status().image;
  const anyUnhealthy = () => !status().chat || !status().image;

  return (
    <div class="fixed bottom-4 right-4 z-50">
      <div class="bg-slate-800 rounded-lg shadow-lg border border-slate-700">
        {/* Collapsed view */}
        <Show when={!isExpanded()}>
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            class="flex items-center gap-2 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors"
            title="Connection Status"
          >
            <div class="flex gap-1">
              <div
                class={`w-2 h-2 rounded-full ${getStatusColor(status().chat)}`}
                title="Chat Service"
              />
              <div
                class={`w-2 h-2 rounded-full ${getStatusColor(status().image)}`}
                title="Image Service"
              />
            </div>
            <span class="text-slate-300 text-sm">
              {allHealthy()
                ? "All Systems Operational"
                : anyUnhealthy()
                  ? "Service Issues Detected"
                  : "Checking..."}
            </span>
          </button>
        </Show>

        {/* Expanded view */}
        <Show when={isExpanded()}>
          <div class="p-4 min-w-[300px]">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-slate-200 font-semibold">Connection Status</h3>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                class="text-slate-400 hover:text-slate-200 transition-colors"
                title="Collapse"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div class="space-y-2">
              {/* Chat Service Status */}
              <div class="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                <div class="flex items-center gap-2">
                  <div
                    class={`w-3 h-3 rounded-full ${getStatusColor(status().chat)}`}
                  />
                  <span class="text-slate-300 text-sm">Chat (Ollama)</span>
                </div>
                <span class="text-xs text-slate-400">
                  {getStatusIcon(status().chat)}
                </span>
              </div>

              {/* Image Service Status */}
              <div class="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                <div class="flex items-center gap-2">
                  <div
                    class={`w-3 h-3 rounded-full ${getStatusColor(status().image)}`}
                  />
                  <span class="text-slate-300 text-sm">Image (ComfyUI)</span>
                </div>
                <span class="text-xs text-slate-400">
                  {getStatusIcon(status().image)}
                </span>
              </div>
            </div>

            {/* Last checked time */}
            <Show when={status().lastChecked}>
              <div class="mt-3 pt-3 border-t border-slate-700">
                <p class="text-xs text-slate-400">
                  Last checked:{" "}
                  {status().lastChecked?.toLocaleTimeString()}
                </p>
              </div>
            </Show>

            {/* Manual refresh button */}
            <button
              type="button"
              onClick={checkHealth}
              disabled={isChecking()}
              class="mt-3 w-full px-3 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-600 text-white text-sm rounded transition-colors"
            >
              {isChecking() ? "Checking..." : "Refresh Status"}
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
};
