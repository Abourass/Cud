import type { Component } from "solid-js";

interface ErrorMessageProps {
  message: string | null;
}

export const ErrorMessage: Component<ErrorMessageProps> = (props) => {
  return props.message ? (
    <div class="bg-red-500 text-white p-2 rounded-md mb-2">{props.message}</div>
  ) : null;
};
