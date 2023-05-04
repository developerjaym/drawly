export default class Controller {
    #model;
    constructor(model) {
        this.#model = model;
    }

    onTypeChanged(newValue) {
        this.#model.type = JSON.parse(newValue);
    }

    onStrokeColorChanged(newValue) {
        this.#model.strokeColor = newValue;
    }

    onBackgroundChanged(newValue) {
        this.#model.background = newValue;
    }

    onMarkAdded(x1, y1, x2, y2, strokeGroupId) {
        this.#model.addMark(x1, y1, x2, y2, strokeGroupId)
    }

    onClear() {
        this.#model.clear();
    }

    onUndo() {
        this.#model.undo();
    }


}
