import { type Component, createSignal, onMount } from "solid-js";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: Component<ChatInputProps> = (props) => {
  const [inputValue, setInputValue] = createSignal("");
  let inputRef: HTMLTextAreaElement | undefined;

  onMount(() => {
    if (inputRef) {
      inputRef.focus();
    }
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      props.onSubmit(inputValue());
      setInputValue("");
      // Refocus after submission
      if (inputRef) {
        inputRef.focus();
      }
    }
  };

  return (
    <textarea
      ref={inputRef}
      value={inputValue()}
      onInput={(e) => setInputValue(e.currentTarget.value)}
      onKeyDown={handleKeyDown}
      name="cud"
      id="cud"
      rows="10"
      class="w-full bg-slate-800 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-600"
      disabled={props.isLoading}
    />
  );
};
