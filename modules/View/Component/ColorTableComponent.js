import Changes from "../../Event/Changes.js";

export default class ColorTableComponent {
  #element;
  #controller;
  constructor(element, controller) {
    this.#element = element;
    this.#controller = controller;
  }
  onChange(change, state) {
    switch (change) {
      case Changes.NEW_MARK:
      case Changes.ERASE_MARK:
        return;
      default:
        setTimeout(() => this.#processChange(state), 0);
    }
  }
  #processChange(state) {
    // Good chance to use the dataset stuff
    // If I have a cell with an existing color, don't delete it
    // If I don't have a cell with an existing color, append it
    const relevantChildren = Array.from(
      this.#element.querySelectorAll(".color-cell")
    );
    const uniqueColors = this.#findColors(state.marks);
    const existingColors = relevantChildren.map((child) => child.dataset.color);

    const existsButShouldnt = existingColors.filter(
      (existingColor) => !uniqueColors.includes(existingColor)
    );
    const doesntYetExist = uniqueColors.filter(
      (uniqueColor) => !existingColors.includes(uniqueColor)
    );
    // remove existsButShouldnt
    relevantChildren
      .filter((child) => existsButShouldnt.includes(child.dataset.color))
      .forEach((child) => child.remove());
    // add doesntYetExist
    doesntYetExist.forEach((color) => {
      const cell = this.#buildColorCell(color);
      this.#element.append(cell);
    });
  }
  #findColors(marks) {
    return [...new Set(marks.filter(mark => !mark.erased).map((mark) => mark.color))];
  }
  #buildColorCell(color) {
    const cell = document.createElement("button");
    cell.classList.add("color-cell");
    cell.title = color;
    cell.style.backgroundColor = color;
    cell.dataset.color = color;
    cell.addEventListener("click", () =>
      this.#controller.onStrokeColorChanged(color)
    );
    return cell;
  }
}
