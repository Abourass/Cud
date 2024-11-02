import { Services } from "~/services/Services";
import { createChatStore } from "./chatStore";
import { createImageStore } from "./imageStore";

class Stores {
  private static instance: Stores;
  public readonly chatStore;
  public readonly imageStore;

  private constructor() {
    const services = Services.getInstance();
    this.imageStore = createImageStore(services.getImageService());
    this.chatStore = createChatStore(
      services.getChatService(),
      services.getImageService(),
    );
  }

  static getInstance() {
    if (!Stores.instance) {
      Stores.instance = new Stores();
    }
    return Stores.instance;
  }
}

export const useStore = () => Stores.getInstance();
