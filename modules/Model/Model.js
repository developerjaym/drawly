import Types from "./Types.js";
import Changes from "../Event/Changes.js";
import Mark from "./Mark.js";
import Mode from "./Mode.js";

export default class Model {
  #observers;
  #state;
  constructor(
    state = {
      type: Types.THICK,
      strokeColor: "#000000",
      marks: [],
      background: "#ffffff",
      backgroundImage: null,
      mode: Mode.DRAW,
      currentId: 0
    }
  ) {
    this.#observers = [];
    this.#state = state;
  }
  set strokeColor(newColor) {
    this.#state.strokeColor = newColor;
    this.#notifyAll(Changes.STROKE_COLOR);
    this.mode = Mode.DRAW;
  }

  set type(newType) {
    this.#state.type = newType;
    this.#notifyAll(Changes.TYPE);
    this.mode = Mode.DRAW;
  }

  set background(newColor) {
    this.#state.background = newColor;
    this.#notifyAll(Changes.BACKGROUND);
  }

  set backgroundImage(newImage) {
    this.#state.backgroundImage = newImage;
    this.#notifyAll(Changes.BACKGROUND_IMAGE);
  }

  set mode(newMode) {
    this.#state.mode = newMode;
    this.#notifyAll(Changes.MODE);
  }

  addMark(x1, y1, x2, y2) {
    switch (this.#state.mode) {
      case Mode.DRAW:
        this.#drawMark(x1, y1, x2, y2);
        break;
      case Mode.ERASER:
        this.#eraseMark(x1, y1, x2, y2);
        break;
    }
  }

  finishStroke() {
    this.#state.currentId++;
    this.#notifyAll(Changes.STROKE_DONE);
  }

  clear() {
    this.#state.marks = [];
    this.#notifyAll(Changes.CLEAR_MARKS);
  }

  undo() {
      // find strokeGroupId of last mark (ignore undo commands if nothing to undo)
      const lastStrokeGroupId =
        this.#state.marks[this.#state.marks.length - 1]?.strokeGroupId;
      // filter out all marks with that same strokeGroupId
      this.#state.marks = this.#state.marks.filter(
        (mark) => mark.strokeGroupId !== lastStrokeGroupId
      );
      this.#notifyAll(Changes.UNDO);
  }

  subscribe(observer) {
    this.#observers.push(observer);
    observer.onChange(Changes.START, structuredClone(this.#state));
  }

  #drawMark(x1, y1, x2, y2) {
    this.#state.marks.push({
      x1,
      y1,
      x2,
      y2,
      strokeGroupId: this.#state.currentId,
      type: this.#state.type,
      color: this.#state.strokeColor,
    });
    this.#notifyAll(Changes.NEW_MARK);
  }

  #eraseMark(x1, y1, x2, y2) {
    this.#state.marks = this.#state.marks.filter(
      (mark) => !Mark.intersects(mark, x1, y1, x2, y2)
    );
    this.#notifyAll(Changes.ERASE_MARK);
  }

  #notifyAll(change) {
    this.#observers.forEach((observer) =>
      observer.onChange(change, this.#state)
    );
  }
}
