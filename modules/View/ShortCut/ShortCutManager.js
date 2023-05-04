import MacShortCutInterpreter from "./MacShortCutInterpreter.js"; 
import WindowShortCutInterpreter from "./WindowsShortCutInterpreter.js";
import ShortCuts from "./ShortCuts.js";
export default class ShortCutManager {

    constructor(controller) {
        const interpreter = navigator.userAgentData.platform.includes("mac") ? new MacShortCutInterpreter() : new WindowShortCutInterpreter();
        const commands = {
            [ShortCuts.UNDO]: () => controller.onUndo(),
            [ShortCuts.NONE]: () => console.log("Not a shortcut")
        }
        document.addEventListener("keyup", (e) => {
            // TODO find a better design pattern
            commands[interpreter.interpret(e)]();
        })
    }
}