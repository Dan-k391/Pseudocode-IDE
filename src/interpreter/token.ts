class Token {
    type: string;
    value: string;
    line: number;
    start_column: number;
    end_column: number;

    constructor(type: string, value: string, line: number, start_column: number, end_column: number) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.start_column = start_column;
        this.end_column = end_column;
    }
}

export {
    Token
}
