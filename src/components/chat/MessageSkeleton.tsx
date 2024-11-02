import { type Component, For } from "solid-js";

interface MessageSkeletonProps {
  count?: number;
  align?: "left" | "right" | "alternate";
}

export const MessageSkeleton: Component<MessageSkeletonProps> = (props) => {
  const { count = 1, align = "alternate" } = props;

  return (
    <div class="animate-pulse space-y-4">
      <For each={Array.from({ length: count })}>
        {(_, i) => (
          <div
            class={`h-10 bg-slate-700 rounded-md ${
              align === "alternate"
                ? i() % 2 === 0
                  ? "w-2/3"
                  : "w-1/2 ml-auto"
                : align === "right"
                  ? "w-1/2 ml-auto"
                  : "w-2/3"
            }`}
          />
        )}
      </For>
    </div>
  );
};
