import Types from "./Types.js";
import Changes from "../Event/Changes.js";
import Mark from "./Mark.js";

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
      currentId: 0,
    }
  ) {
    this.#observers = [];
    this.#state = state;
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

  set backgroundImage(newImage) {
    this.#state.backgroundImage = newImage;
    this.#notifyAll(Changes.BACKGROUND_IMAGE);
  }

  addMark(x1, y1, x2, y2) {
    switch (this.#state.type.name) {
      case Types.ERASER.name:
        this.#eraseMark(x1, y1, x2, y2);
        break;
      default:
        this.#drawMark(x1, y1, x2, y2);
        break;
    }
  }

  finishStroke() {
    this.#state.currentId++;
    this.#notifyAll(Changes.STROKE_DONE);
  }

  clear() {
    this.#state.marks = []
    this.#notifyAll(Changes.CLEAR_MARKS);
  }

  undo() {
    // find strokeGroupId of last mark (ignore undo commands if nothing to undo)
    const lastStrokeGroupId =
      this.#state.marks.map(mark => mark.strokeGroupId).reduce((pre, cur) => cur > pre ? cur : pre, -1);
    const undoErasure = this.#state.marks.some(
      (mark) => mark.strokeGroupId === lastStrokeGroupId && mark.erased
    );
    if (undoErasure) {
      this.#state.marks
        .filter((mark) => mark.strokeGroupId === lastStrokeGroupId)
        .forEach((mark) => {
          mark.erased = false;
          mark.strokeGroupId = mark.previousStrokeGroupId;
          delete mark.previousStrokeGroupId;
        });
    } else {
      // filter out all marks with that same strokeGroupId
      this.#state.marks = this.#state.marks.filter(
        (mark) => mark.strokeGroupId !== lastStrokeGroupId
      );
    }

    this.#notifyAll(Changes.UNDO);
  }

  subscribe(observer) {
    this.#observers.push(observer);
    observer.onChange(Changes.START, this.#state);
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
    this.#state.marks
      .filter((mark) => Mark.intersects(mark, x1, y1, x2, y2) && !mark.erased)
      .forEach((mark) => {
        this.#setErasedPropertiesOnMark(mark)
      });
    this.#notifyAll(Changes.ERASE_MARK);
  }

  #setErasedPropertiesOnMark(mark) {
    mark.erased = true;
    mark.previousStrokeGroupId = mark.strokeGroupId;
    mark.strokeGroupId = this.#state.currentId;
  }

  #notifyAll(change) {
    this.#observers.forEach((observer) =>
      observer.onChange(change, this.#state)
    );
  }
}
