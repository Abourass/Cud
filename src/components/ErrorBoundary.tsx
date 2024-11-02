import {
  type Component,
  ErrorBoundary as SolidErrorBoundary,
  type JSX,
} from "solid-js";

interface ErrorBoundaryProps {
  children?: JSX.Element | JSX.Element[];
}

export const ErrorBoundary: Component<ErrorBoundaryProps> = (props) => {
  return (
    <SolidErrorBoundary
      fallback={(err: Error) => (
        <div class="bg-red-500 text-white p-4 rounded-md">
          <h2 class="text-lg font-bold">Something went wrong</h2>
          <p class="mt-2">{err.message}</p>
        </div>
      )}
    >
      {props.children}
    </SolidErrorBoundary>
  );
};
