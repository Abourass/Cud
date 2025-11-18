import { config } from "~/config/environment";
import { ChatService } from "./chatService";
import { ImageService } from "./imageService";
import { ResourceManager } from "./resourceManager";

export class Services {
  private static instance: Services;
  private imageService: ImageService;
  private chatService: ChatService;
  private resourceManager: ResourceManager;

  private constructor() {
    this.resourceManager = new ResourceManager();
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

  getResourceManager() {
    return this.resourceManager;
  }

  cleanup() {
    this.imageService.cleanup();
    this.resourceManager.cleanup();
  }
}
