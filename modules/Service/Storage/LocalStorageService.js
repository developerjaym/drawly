export default class LocalStorageService {
    static #KEY = "drawly"
    onChange(change, state) {
        this.#save(state);
    }
    async load() {
        const savedData = localStorage.getItem(LocalStorageService.#KEY);
        if (savedData) {
            return JSON.parse(savedData)
        }
    }
    async #save(state) {
        localStorage.setItem(LocalStorageService.#KEY, JSON.stringify(state, null, 2));
    }
}
