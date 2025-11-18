import {
  type ParentComponent,
  createContext,
  useContext,
  onCleanup,
} from "solid-js";
import { Services } from "~/services/Services";
import type { ChatStore, ImageStore } from "~/types";
import { createChatStore } from "~/stores/chatStore";
import { createImageStore } from "~/stores/imageStore";

interface AppContextValue {
  services: Services;
  chatStore: ChatStore;
  imageStore: ImageStore;
  resourceManager: ReturnType<Services["getResourceManager"]>;
}

const AppContext = createContext<AppContextValue>();

export const AppProvider: ParentComponent = (props) => {
  const services = Services.getInstance();
  const resourceManager = services.getResourceManager();

  const imageStore = createImageStore(services.getImageService());

  const stores = {
    services,
    resourceManager,
    chatStore: createChatStore(
      services.getChatService(),
      services.getImageService(),
      imageStore,
      resourceManager,
    ),
    imageStore,
  };

  onCleanup(() => {
    services.cleanup();
  });

  return (
    <AppContext.Provider value={stores}>{props.children}</AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
