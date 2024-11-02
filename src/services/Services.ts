import { config } from "~/config/environment";
import { ChatService } from "./chatService";
import { ImageService } from "./imageService";

export class Services {
  private static instance: Services;
  private imageService: ImageService;
  private chatService: ChatService;

  private constructor() {
    this.imageService = new ImageService(config.imageApiUrl);
    this.chatService = new ChatService(config.apiUrl);
  }

  static getInstance() {
    if (!Services.instance) {
      Services.instance = new Services();
    }
    return Services.instance;
  }

  getImageService() {
    return this.imageService;
  }

  getChatService() {
    return this.chatService;
  }

  cleanup() {
    this.imageService.cleanup();
  }
}
