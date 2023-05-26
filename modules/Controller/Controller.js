
export default class Controller {
  #model;
  constructor(model) {
    this.#model = model;
  }

  onTypeChanged(newValue) {
    this.#model.type = newValue;
  }

  onStrokeColorChanged(newValue) {
    this.#model.strokeColor = newValue;
  }

  onBackgroundChanged(newValue) {
    this.#model.background = newValue;
  }

  onBackgroundImageChanged(newValue) {
    this.#model.backgroundImage = newValue;
  }

  onMarkAdded(x1, y1, x2, y2) {
    this.#model.addMark(x1, y1, x2, y2);
  }

  onStrokeDone(x1, y1, x2, y2) {
    this.onMarkAdded(x1, y1, x2, y2);
    this.#model.finishStroke();
  }

  onClear() {
    this.#model.clear();
  }

  onUndo() {
    this.#model.undo();
  }
}
