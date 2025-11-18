import { Component, Show } from "solid-js";

export interface ProgressIndicatorProps {
  message: string;
  progress?: number;
  isIndeterminate?: boolean;
}

export const ProgressIndicator: Component<ProgressIndicatorProps> = (props) => {
  return (
    <div class="flex flex-col gap-2 p-4 bg-slate-700 rounded-lg">
      <div class="flex items-center gap-3">
        <Show
          when={!props.isIndeterminate && props.progress !== undefined}
          fallback={
            <div class="w-5 h-5">
              <svg
                class="animate-spin text-sky-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          }
        >
          <div class="text-sky-500 font-semibold">{props.progress}%</div>
        </Show>
        <span class="text-slate-200">{props.message}</span>
      </div>

      {/* Progress bar for determinate progress */}
      <Show when={!props.isIndeterminate && props.progress !== undefined}>
        <div class="w-full bg-slate-600 rounded-full h-2 overflow-hidden">
          <div
            class="bg-sky-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${props.progress}%` }}
          />
        </div>
      </Show>
    </div>
  );
};
