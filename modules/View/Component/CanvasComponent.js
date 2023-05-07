import Changes from "../../Event/Changes.js";
import Mode from "../../Model/Mode.js";
import IDGenerator from "../../Service/Id/IdGenerator.js";

class Pen {
  #observers;
  constructor(...observers) {
    this.#observers = observers;
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;
    this.strokeGroupId = null;
  }
  subscribe(observer) {
    this.#observers.push(observer);
  }
  onStarted({ offsetX, offsetY }) {
    this.x = offsetX;
    this.y = offsetY;
    this.isDrawing = true;
    this.strokeGroupId = IDGenerator();
  }
  onMoving({ offsetX, offsetY }) {
    if (this.isDrawing) {
      this.#notifyAll(offsetX, offsetY);
      this.x = offsetX;
      this.y = offsetY;
    }
  }
  onDone({ offsetX, offsetY }) {
    if (this.isDrawing) {
      this.#notifyAll(offsetX, offsetY);

      this.x = 0;
      this.y = 0;
      this.isDrawing = false;
      this.strokeGroupId = null;
    }
  }
  #notifyAll(offsetX, offsetY) {
    this.#observers.forEach((observer) =>
      observer(this.x, this.y, offsetX, offsetY, this.strokeGroupId)
    );
  }
}

export default class CanvasView {
  #element;
  #context;
  #pen;
  constructor(element, controller) {
    this.#element = element;
    this.#context = this.#element.getContext("2d", { alpha: false });
    this.#pen = new Pen((x, y, offsetX, offsetY, strokeGroupId) =>
      controller.onMarkAdded(x, y, offsetX, offsetY, strokeGroupId)
    );

    this.#element.addEventListener("mousedown", (e) => this.#pen.onStarted(e));
    // this.#element.addEventListener("touchstart", (e) => this.#pen.onStarted(e));
    this.#element.addEventListener("mousemove", (e) => this.#pen.onMoving(e));
    // this.#element.addEventListener("touchmove", (e) => this.#pen.onMoving(e));
    this.#element.addEventListener("mouseup", (e) => this.#pen.onDone(e));
    // this.#element.addEventListener("touchend", (e) => this.#pen.onDone(e));
    this.#element.addEventListener("mouseleave", (e) => this.#pen.onDone(e));
    // this.#element.addEventListener("touchcancel", (e) => this.#pen.onDone(e));
  }
  onChange(change, state) {
    const { background, marks, mode } = state;

    switch (change) {
      case Changes.START:
      case Changes.MODE:
        if (mode === Mode.DRAW) {
          this.#element.classList.add("canvas--draw");
          this.#element.classList.remove("canvas--erase");
        } else {
          this.#element.classList.add("canvas--erase");
          this.#element.classList.remove("canvas--draw");
        }
      case Changes.UNDO:
      case Changes.BACKGROUND:
      case Changes.START:
      case Changes.ERASE_MARK:
        this.#context.clearRect(
          0,
          0,
          this.#element.width,
          this.#element.height
        );
        this.#drawBackground(background);
        marks.forEach((mark) => this.#drawLine(mark));
        break;
      case Changes.NEW_MARK:
        this.#drawLine(marks.pop());
        break;
      case Changes.CLEAR_MARKS:
        this.#context.clearRect(
          0,
          0,
          this.#element.width,
          this.#element.height
        );
        this.#drawBackground(background);
        break;
    }
  }

  #drawBackground(color) {
    this.#context.fillStyle = color;
    this.#context.fillRect(0, 0, this.#element.width, this.#element.height);
  }

  #drawLine({ x1, y1, x2, y2, type, color }) {
    this.#context.fillStyle = color;
    this.#context.strokeStyle = color;
    this.#context.lineWidth = type.width;
    // fill a circle
    this.#context.beginPath();
    this.#context.ellipse(
      x1,
      y1,
      type.width / 12,
      type.width / 12,
      Math.PI,
      0,
      2 * Math.PI
    );
    this.#context.fill();
    this.#context.stroke();

    // draw a line

    this.#context.beginPath();
    this.#context.moveTo(x1, y1);
    this.#context.lineTo(x2, y2);
    this.#context.stroke();
    this.#context.closePath();
  }
}
