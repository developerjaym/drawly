class ResizeModel {
  #observers;
  constructor() {
    this.#observers = [];
  }
  subscribe(observer) {
    this.#observers.push(observer);
  }
  onChange() {
    this.#notifyAll();
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
  onChange() {
    this.#model.onChange();
  }
}

const resizeModel = new ResizeModel();
const resizeController = new ResizeController(resizeModel);
window.addEventListener("resize", (event) => resizeController.onChange());

export default function subscribe(newObserver) {
  resizeModel.subscribe(newObserver);
}
