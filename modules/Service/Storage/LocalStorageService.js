import Changes from "../../Event/Changes.js";

export default class LocalStorageService {
  static #KEY = "drawly";
  onChange(change, state) {
    switch (change) {
      case Changes.NEW_MARK:
      case Changes.START:
      case Changes.ERASE_MARK:
        return;
      default:
        this.#save(state);
    }
  }
  async load() {
    const savedData = localStorage.getItem(LocalStorageService.#KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
  }
  #save(state) {
    setTimeout(() =>
      localStorage.setItem(LocalStorageService.#KEY, JSON.stringify(state))
    , 0);
  }
}
