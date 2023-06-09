import Changes from "../../Event/Changes.js";
import Types from "../../Model/Types.js";
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

export default class CanvasView {
  #element;
  #context;
  #pen;
  #lastState;
  constructor(element, controller) {
    this.#element = element;
    subscribeToResize(() => {
      const { clientHeight, clientWidth } = this.#element.parentElement;
      this.#element.height = clientHeight;
      this.#element.width = clientWidth;
      this.onChange(Changes.BACKGROUND, this.#lastState);
    });
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
    const { background, marks, backgroundImage, type } = state;

    switch (change) {
      case Changes.START:
        this.#setType(type);
      case Changes.BACKGROUND_IMAGE:
      case Changes.BACKGROUND:
      case Changes.UNDO:
      case Changes.ERASE_MARK:
      case Changes.CLEAR_MARKS:
        this.#clearCanvas();
        //background image is asychronous, sadly (the image needs to load...)
        this.#drawBackground(background, backgroundImage, () =>
          marks.forEach((mark) => this.#drawLine(mark))
        );
        break;
      case Changes.TYPE:  
        this.#setType(type);
        break;
      case Changes.NEW_MARK:
        this.#drawLine(marks[marks.length - 1]);
        break;
    }
  }

  #clearCanvas() {
    this.#context.clearRect(0, 0, this.#element.width, this.#element.height);
  }

  #drawBackground(color, image, whenDone) {
    this.#context.fillStyle = color;
    this.#context.fillRect(0, 0, this.#element.width, this.#element.height);
    if (image && false/*TODO turn background images on later */) {
      const imageElement = document.createElement("img");
      imageElement.src = image;
      imageElement.addEventListener('load', () => {
        this.#context.drawImage(imageElement, 0, 0);
        whenDone();
      });
    } else {
      whenDone();
    }
  }

  #drawLine({ x1, y1, x2, y2, type, color, erased = false }) {
    if(erased) {
      return;
    }
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
  #setType(type) {
    Types.ALL.forEach(type => this.#element.classList.remove(`canvas--${type.name}`))
    if (type.name === Types.ERASER.name) {
      this.#element.classList.add("canvas--erase");
    } else {
      this.#element.classList.remove("canvas--erase");
      this.#element.classList.add(`canvas--${type.name}`);
    }
  }
}
