import { Scanner } from "./lex/scanner";


class Interpreter {
    input: string;

    constructor(input: string) {
        this.input = input;
    }

    interpret(): void {
        const scanner = new Scanner(this.input);
        const tokens = scanner.scan();
        console.log(tokens);
    }

}

export {
    Interpreter
}
