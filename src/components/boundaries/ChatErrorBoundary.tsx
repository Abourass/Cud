import { type Component, type JSX, ErrorBoundary } from "solid-js";
import consola from "consola";

interface ChatErrorBoundaryProps {
  children: JSX.Element;
  onError?: (error: Error) => void;
}

export const ChatErrorBoundary: Component<ChatErrorBoundaryProps> = (
  props,
) => {
  const handleError = (error: Error) => {
    consola.error("Chat error:", error);
    props.onError?.(error);
  };

  return (
    <ErrorBoundary
      fallback={(err: Error, reset) => (
        <div class="bg-red-900/20 border border-red-500 text-red-200 p-4 rounded-md m-2">
          <div class="flex items-start gap-3">
            <svg
              class="w-6 h-6 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            <div class="flex-1">
              <h3 class="text-lg font-semibold mb-2">Chat Error</h3>
              <p class="text-sm mb-3">{err.message}</p>
              <div class="flex gap-2">
                <button
                  type="button"
                  onClick={reset}
                  class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
                >
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  class="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded-md text-sm transition-colors"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      {props.children}
    </ErrorBoundary>
  );
};
