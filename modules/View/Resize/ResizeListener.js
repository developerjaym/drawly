class ResizeModel {
  #observers;
  #innerWidth;
  #innerHeight;
  static #buffer = 0;
  constructor() {
    this.#innerWidth = 0;
    this.#innerHeight = 0;
    this.#observers = [];
  }
  subscribe(observer) {
    this.#observers.push(observer);
  }
  onChange(newInnerWidth, newInnerHeight) {
    if(this.#exceedsBuffer(newInnerWidth, this.#innerWidth) || this.#exceedsBuffer(newInnerHeight, this.#innerHeight)) {
      this.#innerHeight = newInnerHeight;
      this.#innerWidth = newInnerWidth;
      this.#notifyAll();
    }
  }
  #exceedsBuffer(newLength, oldLength) {
    return Math.abs(newLength - oldLength) >= ResizeModel.#buffer;
  }
  #notifyAll() {
    this.#observers.forEach((observer) => observer());
  }
}

class ResizeController {
  #model;
  constructor(model) {
    this.#model = model;
  }
  onChange({innerWidth, innerHeight}) {
    this.#model.onChange(innerWidth, innerHeight);
  }
}

const resizeModel = new ResizeModel();
const resizeController = new ResizeController(resizeModel);
window.addEventListener("resize", (event) => resizeController.onChange(event.currentTarget));

export default function subscribe(newObserver) {
  resizeModel.subscribe(newObserver);
  // kick it off in a second to get the right size
  setTimeout(()=>resizeController.onChange({innerWidth: window.innerWidth, innerHeight: window.innerHeight}),0);
}
