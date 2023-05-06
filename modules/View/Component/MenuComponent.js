import ColorTableComponent from "./ColorTableComponent.js";
import Types from "../../Model/Types.js"
import Changes from "../../Event/Changes.js"
import Mode from "../../Model/Mode.js";
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
    constructor(element, controller) {
        this.#element = element;
        this.#typeSelect = this.#element.querySelector("#typeSelect")
        this.#typeSelect.onchange = (e) => controller.onTypeChanged(e.target.value)
        this.#strokeColorSelect = this.#element.querySelector("#strokeColorSelect")
        this.#strokeColorSelect.onchange = (e) => controller.onStrokeColorChanged(e.target.value)
        this.#backgroundColorSelect = this.#element.querySelector("#backgroundColorSelect")
        this.#backgroundColorSelect.onchange = (e) => controller.onBackgroundChanged(e.target.value)
        this.#addOptions();
        this.#clearButton = this.#element.querySelector("#clearButton")
        this.#clearButton.onclick = () => controller.onClear();
        this.#eraserButton = this.#element.querySelector("#eraserButton")
        this.#eraserButton.onclick = () => controller.onErase();
        this.#drawButton = this.#element.querySelector("#drawButton")
        this.#drawButton.onclick = () => controller.onDraw();
        this.#undoButton = this.#element.querySelector("#undoButton")
        this.#undoButton.onclick = () => controller.onUndo();
        this.#colorTable = new ColorTableComponent(this.#element.querySelector(".color-table"), controller)
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
            case Changes.NEW_MARK:
            case Changes.CLEAR_MARKS:
            case Changes.UNDO:
            case Changes.BACKGROUND:  
            case Changes.ERASE_MARK:  
                this.#colorTable.onChange(change, state);
                break;
            case Changes.STROKE_COLOR: 
                this.#strokeColorSelect.value = state.strokeColor; 
        }
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

