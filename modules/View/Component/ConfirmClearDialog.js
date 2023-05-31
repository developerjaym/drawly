import { animateIn, animateOut } from "../Animation/InAndOut.js";

export default class ConfirmClearDialog {
  #element;
  constructor(onConfirm, onCancel = () => {}) {
    this.#element = document.getElementById("confirmClearDialog");
    this.#element
      .querySelector("#confirmClearButton")
      .addEventListener("click", () => this.#handle(onConfirm));
    this.#element
      .querySelector("#cancelClearButton")
      .addEventListener("click", () => this.#handle(onCancel));
  }
  show() {
    animateIn(this.#element, () => this.#element.showModal());
  }
  #handle(callback) {
    animateOut(this.#element, () => {
      callback();
      this.#element.close();
    });
  }
}
