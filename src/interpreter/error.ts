class SyntaxError {
    msg: string;
    line: number;
    start_column: number;
    end_column: number;

    constructor(msg: string, line: number, start_column: number, end_column: number) {
        this.msg = msg;
        this.line = line;
        this.start_column = start_column;
        this.end_column = end_column;
    }

    toString(): string {
        if (this.line != null && this.start_column != null) {
            return '\x1b[31;1mSyntaxError: \x1B[0m' + this.msg + ' at line ' + this.line.toString() + ':' + this.start_column.toString();
        }
        return this.msg;
    }
}

class RuntimeError {
    msg: string;

    constructor(msg: string) {
        this.msg = msg;
    }

    toString(): string {
        return '\x1b[31;1mRuntimeError: \x1B[0m' + this.msg;
    }
}

export {
    SyntaxError,
    RuntimeError
}
