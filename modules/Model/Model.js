import Types from "./Types.js"
import Changes from "../Event/Changes.js";
import Mark from "./Mark.js";

export default   class Model {
    #observers;
    #state;
    constructor(state = {
        type: Types.THICK,
        strokeColor: "#ffffff",
        marks: [],
        background: "#000000"
    }) {
        this.#observers = []
        this.#state = { background: "#000000", ...state };
    }
    set strokeColor(newColor) {
        this.#state.strokeColor = newColor;
        this.#notifyAll(Changes.STROKE_COLOR);
    }

    set type(newType) {
        this.#state.type = newType;
        this.#notifyAll(Changes.TYPE);
    }

    set background(newColor) {
        this.#state.background = newColor;
        this.#notifyAll(Changes.BACKGROUND);
    }

    addMark(x1, y1, x2, y2, strokeGroupId) {
        this.#state.marks.push(new Mark(x1, y1, x2, y2, strokeGroupId, this.#state.type, this.#state.strokeColor));
        this.#notifyAll(Changes.NEW_MARK)
    }

    clear() {
        this.#state.marks = [];
        this.#notifyAll(Changes.CLEAR_MARKS);
    }

    undo() {
        if (this.#state.marks.length) { // ignore undo commands if nothing to undo
            // find strokeGroupId of last mark
            const lastStrokeGroupId = this.#state.marks[this.#state.marks.length - 1].strokeGroupId;
            // filter out all marks with that same strokeGroupId
            this.#state.marks = this.#state.marks.filter(mark => mark.strokeGroupId !== lastStrokeGroupId);
            this.#notifyAll(Changes.UNDO);
        }
    }

    subscribe(observer) {
        this.#observers.push(observer);
        observer.onChange(Changes.START, structuredClone(this.#state));
    }

    #notifyAll(change) {
        this.#observers.forEach(observer => observer.onChange(change, structuredClone(this.#state)))
    }
}