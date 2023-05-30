import ColorTableComponent from "./ColorTableComponent.js";
import Types from "../../Model/Types.js";
import Changes from "../../Event/Changes.js";
import Save from "../../Service/Save/Save.js";
import subscribeToResize from "../Resize/ResizeListener.js";
import TypeTranslator from "../../Service/Translate/TypeTranslator.js";
import ConfirmClearDialog from "./ConfirmClearDialog.js";

function readImage(file, callback) {
  // Check if the file is an image.
  if (file.type && !file.type.startsWith("image/")) {
    console.error("File is not an image.", file.type, file);
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", (event) => {
    callback(event.target.result);
  });
  reader.readAsDataURL(file);
}

export default class MenuComponent {
  #element;
  #typeSelect;
  #strokeColorSelect;
  #backgroundColorSelect;
  #clearButton;
  #undoButton;
  #colorTable;
  #downloadButton;
  #backgroundImageSelect;
  #controller;
  // i need to create a save button;
  // i need to connect that up with the Save function;
  // i need to then do the download stuff;
  // (always make its href equal to the data from the canvas?)
  constructor(element, controller) {
    this.#element = element;
    this.#controller = controller;
    this.#typeSelect = this.#element.querySelector("#typeSelect");
    this.#strokeColorSelect = this.#element.querySelector("#strokeColorSelect");
    this.#strokeColorSelect.addEventListener("change", (e) =>
      this.#controller.onStrokeColorChanged(e.target.value)
    );
    this.#backgroundColorSelect = this.#element.querySelector(
      "#backgroundColorSelect"
    );
    this.#backgroundColorSelect.addEventListener("change", (e) =>
      this.#controller.onBackgroundChanged(e.target.value)
    );
    this.#backgroundImageSelect = this.#element.querySelector(
      "#backgroundImageSelect"
    );
    this.#backgroundImageSelect.addEventListener("change", (e) =>
      readImage(e.target.files[0], (imageData) =>
        this.#controller.onBackgroundImageChanged(imageData)
      )
    );
    this.#addOptions();
    this.#clearButton = this.#element.querySelector("#clearButton");
    this.#clearButton.addEventListener("click", () =>
      new ConfirmClearDialog(() => this.#controller.onClear()).show()
    );
    this.#undoButton = this.#element.querySelector("#undoButton");
    this.#undoButton.addEventListener("click", () => this.#controller.onUndo());
    this.#colorTable = new ColorTableComponent(
      this.#element.querySelector(".color-table"),
      this.#controller
    );
    this.#downloadButton = this.#element.querySelector("#downloadButton");
    this.#downloadButton.addEventListener("click", () => this.#prepDownload());
    subscribeToResize(() => this.#prepDownload());
  }
  onChange(change, state) {
    switch (change) {
      case Changes.TYPE:
        this.#toggleTypeButtons(state.type);
        break;
      case Changes.START:
        this.#strokeColorSelect.value = state.strokeColor;
        this.#backgroundColorSelect.value = state.background;
        this.#toggleTypeButtons(state.type);
      case Changes.STROKE_DONE:
      case Changes.CLEAR_MARKS:
      case Changes.UNDO:
      case Changes.BACKGROUND:
      case Changes.BACKGROUND_IMAGE:
        this.#colorTable.onChange(change, state);
        break;
      case Changes.STROKE_COLOR:
        this.#strokeColorSelect.value = state.strokeColor;
    }
  }
  #prepDownload() {
    this.#downloadButton.href = Save();
    this.#downloadButton.download = `drawly_${new Date().getTime()}.png`;
  }
  #addOptions() {
    this.#typeSelect.append(
      ...Types.ALL.map((item) => {
        return this.#buildTypeOption(item);
      })
    );
  }
  #buildTypeOption(item) {
    const friendlyName = TypeTranslator(item.name);
    const button = document.createElement("button");
    button.addEventListener("click", () =>
      this.#controller.onTypeChanged(item)
    );
    button.title = `${friendlyName}`;
    button.dataset.type = `${item.name}`;
    button.classList.add("menu__button");
    const img = document.createElement("img");
    img.src = `assets/${item.name}.svg`;
    img.height = 24;
    img.width = 24;
    img.alt = `${friendlyName}`;
    button.append(img);
    const textElement = document.createElement("span");
    textElement.textContent = `${friendlyName}`;
    button.append(textElement);
    return button;
  }

  #toggleTypeButtons(type) {
    Array.from(this.#typeSelect.children).forEach((button) =>
      button.dataset.type === type.name
        ? button.classList.add("button--active")
        : button.classList.remove("button--active")
    );
  }
}
