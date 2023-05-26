export default class Types {

    static get THICK() {
        return { name: "THICK", width: 10 };
    }

    static get MEDIUM() {
        return { name: "MEDIUM", width: 5 };
    }

    static get THIN() {
        return { name: "THIN", width: 2 };
    }

    static get ERASER() {
        return {name: "ERASER", width: 10 };
    }

    static get ALL() {
        return [Types.THIN, Types.MEDIUM, Types.THICK, Types.ERASER]
    }
}