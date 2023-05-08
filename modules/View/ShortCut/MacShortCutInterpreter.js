import ShortCuts from "./ShortCuts.js";
export default class MacShortCutInterpreter {
    interpret(e) {
        if (e.ctrlKey && e.key === "z") {
            return ShortCuts.UNDO;
        }
        else if (e.ctrlKey && e.key === "d") {
            return ShortCuts.CLEAR_ALL_STROKES;
        }

        return ShortCuts.NONE;
    }
}
