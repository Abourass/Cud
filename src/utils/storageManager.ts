import type { Message, ChatMessage, ChatModels } from "~/types";
import consola from "consola";

const STORAGE_KEYS = {
  MESSAGES: "cud_messages",
  HISTORY: "cud_history",
  CURRENT_MODEL: "cud_current_model",
} as const;

const MAX_STORAGE_ITEMS = 100; // Limit storage to prevent quota issues

export interface StoredChatState {
  messages: Message[];
  history: ChatMessage[];
  currentModel: ChatModels;
  timestamp: number;
}

/**
 * Storage manager for persisting chat state to localStorage
 */
export class StorageManager {
  private static isAvailable(): boolean {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      consola.warn("localStorage is not available");
      return false;
    }
  }

  /**
   * Save chat messages to localStorage
   */
  static saveMessages(messages: Message[]): void {
    if (!this.isAvailable()) return;

    try {
      // Limit the number of messages to prevent quota issues
      const limitedMessages = messages.slice(-MAX_STORAGE_ITEMS);

      // Convert Blob URLs to a serializable format (just mark as image)
      const serializableMessages = limitedMessages.map((msg) => ({
        ...msg,
        // Don't save Blob URLs as they're invalid after page reload
        url: msg.type === "image" ? undefined : msg.url,
      }));

      localStorage.setItem(
        STORAGE_KEYS.MESSAGES,
        JSON.stringify(serializableMessages),
      );
    } catch (error) {
      consola.error("Failed to save messages to localStorage:", error);
    }
  }

  /**
   * Load chat messages from localStorage
   */
  static loadMessages(): Message[] {
    if (!this.isAvailable()) return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (!stored) return [];

      const messages = JSON.parse(stored) as Message[];
      return messages;
    } catch (error) {
      consola.error("Failed to load messages from localStorage:", error);
      return [];
    }
  }

  /**
   * Save chat history to localStorage
   */
  static saveHistory(history: ChatMessage[]): void {
    if (!this.isAvailable()) return;

    try {
      // Limit the number of history items
      const limitedHistory = history.slice(-MAX_STORAGE_ITEMS);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(limitedHistory));
    } catch (error) {
      consola.error("Failed to save history to localStorage:", error);
    }
  }

  /**
   * Load chat history from localStorage
   */
  static loadHistory(): ChatMessage[] {
    if (!this.isAvailable()) return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (!stored) return [];

      return JSON.parse(stored) as ChatMessage[];
    } catch (error) {
      consola.error("Failed to load history from localStorage:", error);
      return [];
    }
  }

  /**
   * Save current model to localStorage
   */
  static saveCurrentModel(model: ChatModels): void {
    if (!this.isAvailable()) return;

    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_MODEL, model);
    } catch (error) {
      consola.error("Failed to save current model to localStorage:", error);
    }
  }

  /**
   * Load current model from localStorage
   */
  static loadCurrentModel(): ChatModels | null {
    if (!this.isAvailable()) return null;

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_MODEL);
      return stored as ChatModels | null;
    } catch (error) {
      consola.error("Failed to load current model from localStorage:", error);
      return null;
    }
  }

  /**
   * Load complete chat state from localStorage
   */
  static loadState(): Partial<StoredChatState> {
    return {
      messages: this.loadMessages(),
      history: this.loadHistory(),
      currentModel: this.loadCurrentModel() || undefined,
    };
  }

  /**
   * Save complete chat state to localStorage
   */
  static saveState(state: Partial<StoredChatState>): void {
    if (state.messages) this.saveMessages(state.messages);
    if (state.history) this.saveHistory(state.history);
    if (state.currentModel) this.saveCurrentModel(state.currentModel);
  }

  /**
   * Clear all stored chat data
   */
  static clear(): void {
    if (!this.isAvailable()) return;

    try {
      localStorage.removeItem(STORAGE_KEYS.MESSAGES);
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_MODEL);
    } catch (error) {
      consola.error("Failed to clear localStorage:", error);
    }
  }
}
