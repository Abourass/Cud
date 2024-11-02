import type { ChatStore, ImageStore } from "./index";
import type { Services } from "~/services/Services";

export interface AppContextValue {
  services: Services;
  chatStore: ChatStore;
  imageStore: ImageStore;
}
