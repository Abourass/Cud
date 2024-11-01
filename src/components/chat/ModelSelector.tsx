import type { Component } from "solid-js";
import type { ChatModels } from "~/types";

interface ModelSelectorProps {
  currentModel: ChatModels;
  onModelChange: (model: ChatModels) => void;
  isLoading: boolean;
}

export const ModelSelector: Component<ModelSelectorProps> = (props) => {
  return (
    <div class="flex flex-row m-2">
      <label for="model" class="text-white pr-2">
        Model:
      </label>
      <select
        name="model"
        id="model"
        class="bg-slate-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
        onChange={(e) =>
          props.onModelChange(e.currentTarget.value as ChatModels)
        }
        disabled={props.isLoading}
      >
        <option value="Elora" selected={props.currentModel === "Elora"}>
          Lore
        </option>
        <option
          value="agentGreen"
          selected={props.currentModel === "agentGreen"}
        >
          Agent Green
        </option>
        <option value="Aureial" selected={props.currentModel === "Aureial"}>
          Aureial
        </option>
        <option value="Socrates" selected={props.currentModel === "Socrates"}>
          Socrates
        </option>
        <option value="wizzy" selected={props.currentModel === "wizzy"}>
          Wizzy
        </option>
        <option value="Crysta" selected={props.currentModel === "Crysta"}>
          Aristotle
        </option>
      </select>
    </div>
  );
};
