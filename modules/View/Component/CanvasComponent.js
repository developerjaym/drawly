import Changes from "../../Event/Changes.js";
import Mode from "../../Model/Mode.js";
import subscribeToResize from "../Resize/ResizeListener.js";


class Pen {
  #observers;
  constructor(...observers) {
    this.#observers = observers;
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;
  }
  subscribe(observer) {
    this.#observers.push(observer);
  }
  onStarted({ offsetX, offsetY }) {
    this.x = offsetX;
    this.y = offsetY;
    this.isDrawing = true;
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
      this.#notifyAll(offsetX, offsetY, true);

      this.x = 0;
      this.y = 0;
      this.isDrawing = false;
    }
  }
  #notifyAll(offsetX, offsetY, isDone = false) {
    this.#observers.forEach((observer) =>
      observer(this.x, this.y, offsetX, offsetY, isDone)
    );
  }
}

const touchEventConverter = (touch, target) => {
  return {
    offsetX: Math.floor(touch.clientX) - target.offsetLeft,
    offsetY: Math.floor(touch.clientY) - target.offsetTop,
  };
};

class CanvasResizeListener {
  #previousHeight = 1080;
  #previousWidth = 1920;
  static #tolerance = 0;
  #container;
  constructor(container, listener) {
    this.#container = container;
    
    window.addEventListener('resize', (event) => {
      // do stuff here
      const {clientHeight, clientWidth} = this.#container;
      if(Math.abs(clientHeight - this.#previousHeight) > CanvasResizeListener.#tolerance || Math.abs(clientWidth - this.#previousWidth) > CanvasResizeListener.#tolerance) {
        console.log("changes", clientHeight, clientWidth)
        this.#previousHeight = clientHeight;
        this.#previousWidth = clientWidth;
        listener(clientWidth, clientHeight)
      }
    });
  }
}

export default class CanvasView {
  #element;
  #context;
  #pen;
  #lastState;
  constructor(element, controller) {
    this.#element = element;
    subscribeToResize(() => {
      const {clientHeight, clientWidth} = this.#element.parentElement;
      this.#element.height = clientHeight;
      this.#element.width = clientWidth;
      this.onChange(Changes.BACKGROUND, this.#lastState);
    })
    this.#context = this.#element.getContext("2d", { alpha: false });
    this.#pen = new Pen((x, y, offsetX, offsetY, isDone) =>
      isDone
        ? controller.onStrokeDone(x, y, offsetX, offsetY)
        : controller.onMarkAdded(x, y, offsetX, offsetY)
    );

    this.#element.addEventListener("mousedown", (e) => this.#pen.onStarted(e));
    this.#element.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.#pen.onStarted(touchEventConverter(e.touches[0], e.target));
    });
    this.#element.addEventListener("mousemove", (e) => this.#pen.onMoving(e));
    this.#element.addEventListener("touchmove", (e) => {
      e.preventDefault();
      this.#pen.onMoving(touchEventConverter(e.touches[0], e.target));
    });
    this.#element.addEventListener("mouseup", (e) => this.#pen.onDone(e));
    this.#element.addEventListener("touchend", (e) => {
      e.preventDefault();
      this.#pen.onDone(touchEventConverter(e.changedTouches[0], e.target));
    });
    this.#element.addEventListener("mouseleave", (e) => this.#pen.onDone(e));
    this.#element.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      this.#pen.onDone(touchEventConverter(e.changedTouches[0], e.target));
    });
  }
  onChange(change, state) {
    this.#lastState = state; // caching
    const { background, marks, mode } = state;

    switch (change) {
      case Changes.MODE:
        this.#setMode(mode);
        break;
      case Changes.START:
        this.#setMode(mode);
      case Changes.UNDO:
      case Changes.BACKGROUND:
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
        this.#drawLine(marks[marks.length - 1]);
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
    
    this.#context.lineWidth = type.width;
    this.#context.strokeStyle = "transparent";
    // fill a circle
    this.#context.beginPath();
    this.#context.ellipse(
      x2,
      y2,
      type.width / 2,
      type.width / 2,
      Math.PI,
      0,
      2 * Math.PI
    );
    this.#context.fill();
    this.#context.stroke();

    // draw a line
    this.#context.strokeStyle = color;
    this.#context.beginPath();
    this.#context.moveTo(x1, y1);
    this.#context.lineTo(x2, y2);
    this.#context.stroke();
    this.#context.closePath();
  }
  #setMode(mode) {
    if (mode === Mode.DRAW) {
      this.#element.classList.add("canvas--draw");
      this.#element.classList.remove("canvas--erase");
    } else {
      this.#element.classList.add("canvas--erase");
      this.#element.classList.remove("canvas--draw");
    }
  }
}
