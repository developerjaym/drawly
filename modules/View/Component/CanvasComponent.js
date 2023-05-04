import Changes from "../../Event/Changes.js"

export default class CanvasView {
    #element;
    #context;
    constructor(element, controller) {
        this.#element = element;
        this.isDrawing = false;
        this.strokeGroupId = null;
        let x = 0;
        let y = 0;
        this.#context = this.#element.getContext("2d");

        this.#element.addEventListener("mousedown", (e) => {
            x = e.offsetX;
            y = e.offsetY;
            this.isDrawing = true;
            this.strokeGroupId = crypto.randomUUID();
        });

        this.#element.addEventListener("mousemove", (e) => {
            if (this.isDrawing) {
                controller.onMarkAdded(x, y, e.offsetX, e.offsetY, this.strokeGroupId)
                x = e.offsetX;
                y = e.offsetY;
            }
        });

        this.#element.addEventListener("mouseup", (e) => {
            if (this.isDrawing) {
                controller.onMarkAdded(x, y, e.offsetX, e.offsetY, this.strokeGroupId)

                x = 0;
                y = 0;
                this.isDrawing = false;
                this.strokeGroupId = null;
            }
        });
    }
    onChange(change, state) {
        switch (change) {
            case Changes.BACKGROUND:
                this.#context.clearRect(0, 0, this.#element.width, this.#element.height);
                this.#drawBackground(state.background);
                state.marks.forEach(mark => this.#drawLine(mark.x1, mark.y1, mark.x2, mark.y2, mark.type.width, mark.color))
                break;
            case Changes.START:
                this.#context.clearRect(0, 0, this.#element.width, this.#element.height);
                this.#drawBackground(state.background);
                state.marks.forEach(mark => this.#drawLine(mark.x1, mark.y1, mark.x2, mark.y2, mark.type.width, mark.color))
                break;
            case Changes.NEW_MARK:
                const { x1, y1, x2, y2, type, color } = state.marks.pop();
                this.#drawLine(x1, y1, x2, y2, type.width, color)
                break;
            case Changes.CLEAR_MARKS:
                this.#context.clearRect(0, 0, this.#element.width, this.#element.height);
                this.#drawBackground(state.background);
                break;
            case Changes.UNDO:
                // clear canvas
                this.#context.clearRect(0, 0, this.#element.width, this.#element.height);
                this.#drawBackground(state.background);
                // redraw marks TODO find more efficient means
                state.marks.forEach(mark => this.#drawLine(mark.x1, mark.y1, mark.x2, mark.y2, mark.type.width, mark.color))
                break;
        }
    }

    #drawBackground(color) {
        this.#context.fillStyle = color;
        this.#context.fillRect(0, 0, this.#element.width, this.#element.height)
    }

    #drawLine(x1, y1, x2, y2, width, color) {
        this.#context.fillStyle = color;
        this.#context.strokeStyle = color;
        this.#context.lineWidth = width;
        // fill a circle
        this.#context.beginPath();
        this.#context.ellipse(x1, y1, width / 12, width / 12, Math.PI, 0, 2 * Math.PI);
        this.#context.fill()
        this.#context.stroke();

        // draw a line

        this.#context.beginPath();
        this.#context.moveTo(x1, y1);
        this.#context.lineTo(x2, y2);
        this.#context.stroke();
        this.#context.closePath();
    }
}

