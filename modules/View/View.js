import CanvasComponent from "./Component/CanvasComponent.js";
import MenuComponent from "./Component/MenuComponent.js";

export default class View {
  #controller;
  #canvas;
  #menu;
  constructor(controller) {
    this.#controller = controller;
    this.#canvas = new CanvasComponent(
      document.getElementById("canvas"),
      this.#controller
    );
    this.#menu = new MenuComponent(
      document.getElementById("menu"),
      this.#controller
    );
  }
  onChange(change, state) {
    this.#canvas.onChange(change, (state));
    this.#menu.onChange(change, (state));
  }
}
