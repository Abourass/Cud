import { describe, it, expect, beforeEach } from "vitest";
import { StorageManager } from "../storageManager";
import type { Message, ChatMessage, ChatModels } from "~/types";

describe("StorageManager", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("saveMessages and loadMessages", () => {
    it("should save and load messages correctly", () => {
      const messages: Message[] = [
        { role: "USER", content: "Hello", type: "text" },
        { role: "ASSISTANT", content: "Hi there!", type: "text" },
      ];

      StorageManager.saveMessages(messages);
      const loaded = StorageManager.loadMessages();

      expect(loaded).toEqual(messages);
    });

    it("should handle empty messages array", () => {
      StorageManager.saveMessages([]);
      const loaded = StorageManager.loadMessages();

      expect(loaded).toEqual([]);
    });

    it("should not save image URLs (Blob URLs)", () => {
      const messages: Message[] = [
        {
          role: "ASSISTANT",
          content: "",
          type: "image",
          url: "blob:http://localhost/123",
        },
      ];

      StorageManager.saveMessages(messages);
      const loaded = StorageManager.loadMessages();

      expect(loaded[0].url).toBeUndefined();
    });

    it("should limit stored messages to MAX_STORAGE_ITEMS", () => {
      const manyMessages: Message[] = Array.from({ length: 150 }, (_, i) => ({
        role: "USER" as const,
        content: `Message ${i}`,
        type: "text" as const,
      }));

      StorageManager.saveMessages(manyMessages);
      const loaded = StorageManager.loadMessages();

      expect(loaded.length).toBeLessThanOrEqual(100);
      expect(loaded[0].content).toBe("Message 50"); // Should keep last 100
    });
  });

  describe("saveHistory and loadHistory", () => {
    it("should save and load chat history correctly", () => {
      const history: ChatMessage[] = [
        { role: "USER", content: "What is AI?" },
        { role: "ASSISTANT", content: "AI stands for..." },
      ];

      StorageManager.saveHistory(history);
      const loaded = StorageManager.loadHistory();

      expect(loaded).toEqual(history);
    });

    it("should return empty array when no history exists", () => {
      const loaded = StorageManager.loadHistory();
      expect(loaded).toEqual([]);
    });

    it("should limit stored history to MAX_STORAGE_ITEMS", () => {
      const manyHistory: ChatMessage[] = Array.from({ length: 150 }, (_, i) => ({
        role: "USER" as const,
        content: `History ${i}`,
      }));

      StorageManager.saveHistory(manyHistory);
      const loaded = StorageManager.loadHistory();

      expect(loaded.length).toBeLessThanOrEqual(100);
    });
  });

  describe("saveCurrentModel and loadCurrentModel", () => {
    it("should save and load current model correctly", () => {
      const model: ChatModels = "Elora";

      StorageManager.saveCurrentModel(model);
      const loaded = StorageManager.loadCurrentModel();

      expect(loaded).toBe(model);
    });

    it("should return null when no model is saved", () => {
      const loaded = StorageManager.loadCurrentModel();
      expect(loaded).toBeNull();
    });
  });

  describe("loadState", () => {
    it("should load complete state", () => {
      const messages: Message[] = [
        { role: "USER", content: "Test", type: "text" },
      ];
      const history: ChatMessage[] = [{ role: "USER", content: "Test" }];
      const model: ChatModels = "Socrates";

      StorageManager.saveMessages(messages);
      StorageManager.saveHistory(history);
      StorageManager.saveCurrentModel(model);

      const state = StorageManager.loadState();

      expect(state.messages).toEqual(messages);
      expect(state.history).toEqual(history);
      expect(state.currentModel).toBe(model);
    });

    it("should return empty arrays when nothing is saved", () => {
      const state = StorageManager.loadState();

      expect(state.messages).toEqual([]);
      expect(state.history).toEqual([]);
      expect(state.currentModel).toBeUndefined();
    });
  });

  describe("saveState", () => {
    it("should save complete state", () => {
      const state = {
        messages: [{ role: "USER" as const, content: "Test", type: "text" as const }],
        history: [{ role: "USER" as const, content: "Test" }],
        currentModel: "wizzy" as ChatModels,
      };

      StorageManager.saveState(state);

      const messages = StorageManager.loadMessages();
      const history = StorageManager.loadHistory();
      const model = StorageManager.loadCurrentModel();

      expect(messages).toEqual(state.messages);
      expect(history).toEqual(state.history);
      expect(model).toBe(state.currentModel);
    });
  });

  describe("clear", () => {
    it("should clear all stored data", () => {
      StorageManager.saveMessages([
        { role: "USER", content: "Test", type: "text" },
      ]);
      StorageManager.saveHistory([{ role: "USER", content: "Test" }]);
      StorageManager.saveCurrentModel("Crysta");

      StorageManager.clear();

      expect(StorageManager.loadMessages()).toEqual([]);
      expect(StorageManager.loadHistory()).toEqual([]);
      expect(StorageManager.loadCurrentModel()).toBeNull();
    });
  });
});
