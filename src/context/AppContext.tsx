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
}

const AppContext = createContext<AppContextValue>();

export const AppProvider: ParentComponent = (props) => {
  const services = Services.getInstance();

  const imageStore = createImageStore(services.getImageService());

  const stores = {
    services,
    chatStore: createChatStore(
      services.getChatService(),
      services.getImageService(),
      imageStore,
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
