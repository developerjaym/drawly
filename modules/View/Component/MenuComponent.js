import ColorTableComponent from "./ColorTableComponent.js";
import Types from "../../Model/Types.js"
import Changes from "../../Event/Changes.js"
import Mode from "../../Model/Mode.js";
import Save from "../../Service/Save/Save.js";
import subscribeToResize from "../Resize/ResizeListener.js";

function readImage(file, callback) {
    // Check if the file is an image.
    if (file.type && !file.type.startsWith('image/')) {
      console.error('File is not an image.', file.type, file);
      return;
    }
  
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      callback(event.target.result)
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
    #eraserButton;
    #drawButton;
    #downloadButton;
    #backgroundImageSelect;
    // i need to create a save button;
    // i need to connect that up with the Save function;
    // i need to then do the download stuff;
    // (always make its href equal to the data from the canvas?)
    constructor(element, controller) {
        this.#element = element;
        this.#typeSelect = this.#element.querySelector("#typeSelect")
        this.#typeSelect.addEventListener("change",  (e) => controller.onTypeChanged(e.target.value))
        this.#strokeColorSelect = this.#element.querySelector("#strokeColorSelect")
        this.#strokeColorSelect.addEventListener("change",  (e) => controller.onStrokeColorChanged(e.target.value))
        this.#backgroundColorSelect = this.#element.querySelector("#backgroundColorSelect")
        this.#backgroundColorSelect.addEventListener("change",  (e) => controller.onBackgroundChanged(e.target.value))
        this.#backgroundImageSelect = this.#element.querySelector("#backgroundImageSelect")
        this.#backgroundImageSelect.addEventListener("change",  (e) => readImage(e.target.files[0], (imageData) => controller.onBackgroundImageChanged(imageData)))
        this.#addOptions();
        this.#clearButton = this.#element.querySelector("#clearButton")
        this.#clearButton.addEventListener("click",  () => controller.onClear());
        this.#eraserButton = this.#element.querySelector("#eraserButton")
        this.#eraserButton.addEventListener("click",  () => controller.onErase());
        this.#drawButton = this.#element.querySelector("#drawButton")
        this.#drawButton.addEventListener("click",  () => controller.onDraw());
        this.#undoButton = this.#element.querySelector("#undoButton")
        this.#undoButton.addEventListener("click",  () => controller.onUndo());
        this.#colorTable = new ColorTableComponent(this.#element.querySelector(".color-table"), controller)
        this.#downloadButton = this.#element.querySelector("#downloadButton")
        this.#downloadButton.addEventListener('click', () => this.#prepDownload())
        subscribeToResize(() => this.#prepDownload())
    }
    onChange(change, state) {
        switch (change) {
            case Changes.MODE:
                this.#toggleModeButtons(state.mode);
                break;
            case Changes.START:
                this.#strokeColorSelect.value = state.strokeColor;
                this.#backgroundColorSelect.value = state.background;
                this.#typeSelect.value = JSON.stringify(state.type)
                this.#toggleModeButtons(state.mode)
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
        this.#downloadButton.href = Save()
    }
    #addOptions() {
        this.#typeSelect.append(...Types.ALL.map(item => {
            const element = document.createElement("option");
            element.value = JSON.stringify(item);
            element.textContent = item.name;
            return element;
        }));
    }
    #toggleModeButtons(mode) {
        if(mode === Mode.DRAW) {
            this.#drawButton.classList.add("button--active")
            this.#eraserButton.classList.remove("button--active");
        }
        else {
            this.#drawButton.classList.remove("button--active")
            this.#eraserButton.classList.add("button--active");
        }
    }
}

