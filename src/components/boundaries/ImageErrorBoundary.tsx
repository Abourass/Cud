import { type Component, type JSX, ErrorBoundary } from "solid-js";
import consola from "consola";

interface ImageErrorBoundaryProps {
  children: JSX.Element;
  onError?: (error: Error) => void;
}

export const ImageErrorBoundary: Component<ImageErrorBoundaryProps> = (
  props,
) => {
  const handleError = (error: Error) => {
    consola.error("Image generation error:", error);
    props.onError?.(error);
  };

  return (
    <ErrorBoundary
      fallback={(err: Error, reset) => (
        <div class="bg-orange-900/20 border border-orange-500 text-orange-200 p-4 rounded-md m-2">
          <div class="flex items-start gap-3">
            <svg
              class="w-6 h-6 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <div class="flex-1">
              <h3 class="text-lg font-semibold mb-2">
                Image Generation Error
              </h3>
              <p class="text-sm mb-3">{err.message}</p>
              <details class="mb-3">
                <summary class="cursor-pointer text-sm hover:text-orange-100">
                  Technical Details
                </summary>
                <pre class="mt-2 text-xs bg-slate-900 p-2 rounded overflow-x-auto">
                  {err.stack}
                </pre>
              </details>
              <div class="flex gap-2">
                <button
                  type="button"
                  onClick={reset}
                  class="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm transition-colors"
                >
                  Try Again
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
