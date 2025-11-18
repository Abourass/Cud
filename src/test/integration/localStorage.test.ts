import { describe, it, expect, beforeEach } from "vitest";
import { StorageManager } from "~/utils/storageManager";
import type { Message, ChatMessage } from "~/types";

describe("localStorage Integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should persist and restore a complete chat session", () => {
    // Simulate a chat session
    const messages: Message[] = [
      { role: "USER", content: "Hello", type: "text" },
      { role: "ASSISTANT", content: "Hi! How can I help?", type: "text" },
      { role: "USER", content: "Generate an image of a cat", type: "text" },
      {
        role: "ASSISTANT",
        content: "Creating your image...",
        type: "text",
        isGenerating: true,
      },
    ];

    const history: ChatMessage[] = [
      { role: "USER", content: "Hello" },
      { role: "ASSISTANT", content: "Hi! How can I help?" },
      { role: "USER", content: "Generate an image of a cat" },
    ];

    // Save state
    StorageManager.saveState({
      messages,
      history,
      currentModel: "Elora",
    });

    // Simulate page reload by loading state
    const restoredState = StorageManager.loadState();

    expect(restoredState.messages).toHaveLength(4);
    expect(restoredState.history).toHaveLength(3);
    expect(restoredState.currentModel).toBe("Elora");

    // Verify message content
    expect(restoredState.messages?.[0].content).toBe("Hello");
    expect(restoredState.messages?.[3].isGenerating).toBe(true);
  });

  it("should handle image messages correctly after reload", () => {
    const messages: Message[] = [
      {
        role: "ASSISTANT",
        content: "",
        type: "image",
        url: "blob:http://localhost:3000/image-123",
      },
    ];

    StorageManager.saveMessages(messages);
    const loaded = StorageManager.loadMessages();

    // Blob URLs should not be persisted
    expect(loaded[0].type).toBe("image");
    expect(loaded[0].url).toBeUndefined();
  });

  it("should maintain message order after save/load cycle", () => {
    const messages: Message[] = [
      { role: "USER", content: "First", type: "text" },
      { role: "ASSISTANT", content: "Second", type: "text" },
      { role: "USER", content: "Third", type: "text" },
      { role: "ASSISTANT", content: "Fourth", type: "text" },
    ];

    StorageManager.saveMessages(messages);
    const loaded = StorageManager.loadMessages();

    expect(loaded.map((m) => m.content)).toEqual([
      "First",
      "Second",
      "Third",
      "Fourth",
    ]);
  });

  it("should handle rapid state updates", () => {
    // Simulate rapid typing/updates
    for (let i = 0; i < 10; i++) {
      const messages: Message[] = Array.from({ length: i + 1 }, (_, j) => ({
        role: j % 2 === 0 ? ("USER" as const) : ("ASSISTANT" as const),
        content: `Message ${j}`,
        type: "text" as const,
      }));

      StorageManager.saveMessages(messages);
    }

    const loaded = StorageManager.loadMessages();
    expect(loaded).toHaveLength(10);
    expect(loaded[9].content).toBe("Message 9");
  });
});
