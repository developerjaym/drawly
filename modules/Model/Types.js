export default class Types {

    static get THICK() {
        return { name: "THICK", width: 10 };
    }

    static get THIN() {
        return { name: "THIN", width: 2 };
    }

    static get ALL() {
        return [Types.THICK, Types.THIN]
    }
}