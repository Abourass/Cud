import type { Component } from "solid-js";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
}

export const LoadingSpinner: Component<LoadingSpinnerProps> = (props) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div class="flex justify-center items-center">
      <div
        class={`animate-spin rounded-full border-b-2 border-sky-600
          ${sizes[props.size ?? "md"]}`}
      />
    </div>
  );
};
