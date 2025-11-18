import { type Component, type JSX, ErrorBoundary } from "solid-js";
import consola from "consola";

interface FeatureErrorBoundaryProps {
  children: JSX.Element;
  featureName: string;
  onError?: (error: Error) => void;
}

/**
 * Generic error boundary for any feature
 * Provides a consistent error UI across different features
 */
export const FeatureErrorBoundary: Component<FeatureErrorBoundaryProps> = (
  props,
) => {
  const handleError = (error: Error) => {
    consola.error(`${props.featureName} error:`, error);
    props.onError?.(error);
  };

  return (
    <ErrorBoundary
      fallback={(err: Error, reset) => (
        <div class="bg-yellow-900/20 border border-yellow-500 text-yellow-200 p-4 rounded-md m-2">
          <div class="flex items-start gap-3">
            <svg
              class="w-6 h-6 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <div class="flex-1">
              <h3 class="text-lg font-semibold mb-2">
                {props.featureName} Error
              </h3>
              <p class="text-sm mb-3">
                An error occurred in {props.featureName.toLowerCase()}: {err.message}
              </p>
              <div class="flex gap-2">
                <button
                  type="button"
                  onClick={reset}
                  class="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm transition-colors"
                >
                  Retry
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
