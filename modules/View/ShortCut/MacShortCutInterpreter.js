import ShortCuts from "./ShortCuts.js";
export default class MacShortCutInterpreter {
    interpret(e) {
        if (e.metaKey && e.key === "z") {
            e.preventDefault();
            return ShortCuts.UNDO;
        }
        else if (e.metaKey && e.key === "d") {
            e.preventDefault();
            return ShortCuts.CLEAR_ALL_STROKES;
        }

        return ShortCuts.NONE;
    }
}
