import { Scanner } from "./scanner";
import { Token } from "./token";


class Interpreter {
    input: string;
    
    tokens: Array<Token>;
    scanner: Scanner;

    constructor(input: string) {
        this.input = input;
        this.tokens = [];
        this.scanner = new Scanner(this.input);
    }

    interpret(): void {
        this.tokens = this.scanner.scan();
        console.log(this.tokens);
    }

}

export {
    Interpreter
}
