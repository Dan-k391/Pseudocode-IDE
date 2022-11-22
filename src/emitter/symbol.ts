import { valType } from "./valtype";

// to not overlap with the orgin ts Symbol
class _Symbol {
    public index: number;
    public type: valType;

    constructor(index: number, type: valType) {
        this.index = index;
        this.type = type;
    }
}

export {
    _Symbol
}
