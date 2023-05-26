import ShortCuts from "./ShortCuts.js";
export default class WindowShortCutInterpreter {
    interpret(e) {
        if (e.ctrlKey && e.key === "z") {
            e.preventDefault();
            return ShortCuts.UNDO;
        }
        else if (e.ctrlKey && e.key === "d") {
            e.preventDefault();
            return ShortCuts.CLEAR_ALL_STROKES;
        }
        return ShortCuts.NONE;
    }
}