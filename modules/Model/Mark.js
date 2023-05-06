export default class Mark {
    constructor(x1, y1, x2, y2, strokeGroupId, type, color) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.strokeGroupId = strokeGroupId;
        this.type = type;
        this.color = color;
    }
    /**
     * 
     * @param {Mark} other 
     * @param {Number} x1 
     * @param {Number} y1 
     * @param {Number} x2 
     * @param {Number} y2 
     * @returns {Boolean}
     */
    static intersects(other, x1, y1, x2, y2) {
        const x1Diff = Math.abs(x1 - other.x1);
        const x2Diff = Math.abs(x2 - other.x2);
        const y1Diff = Math.abs(y1 - other.y1);
        const y2Diff = Math.abs(y2 - other.y2);
        const xGood = x1Diff < 10 || x2Diff < 10;
        const yGood = y1Diff < 10 || y2Diff < 10;
        return xGood && yGood;
    }
}