import Changes from "../../Event/Changes.js";

export default class JsonServerStorageService {
  static #API = "http://localhost:3000/drawings/1";
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
    const response = await fetch(JsonServerStorageService.#API);
    const savedData = await response.json();
    return savedData;
  }
  #save(state) {
    fetch(JsonServerStorageService.#API, {
      method: "PUT",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    });
  }
}
