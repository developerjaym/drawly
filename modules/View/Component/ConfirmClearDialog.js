export default class ConfirmClearDialog {
    #element;
    constructor(onConfirm, onCancel = () => {}) {
       this.#element = document.getElementById("confirmClearDialog");
       this.#element.querySelector("#confirmClearButton").addEventListener("click", () => this.#handle(onConfirm));
       this.#element.querySelector("#cancelClearButton").addEventListener("click", () => this.#handle(onCancel));
    }
    show() {
        this.#element.showModal();
    }
    #handle(callback) {
        this.#element.close();
        callback();
    }
}