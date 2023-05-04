import ShortCuts from "./ShortCuts.js";
export default class WindowShortCutInterpreter {
    interpret(e) {
        if (e.key === "Meta" && e.keyCode === 91) {
            return ShortCuts.UNDO;
        }
        return ShortCuts.NONE;
    }
}