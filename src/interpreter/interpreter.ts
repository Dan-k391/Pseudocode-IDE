import { Scanner } from "./lex/scanner";
import { Parser } from "./parse/parser";
import { Emitter } from "../emitter/emitter";


class Interpreter {
    input: string;

    constructor(input: string) {
        this.input = input;
    }

    async interpret(): Promise<void> {
        const scanner = new Scanner(this.input);
        const tokens = scanner.scan();
        console.log(tokens);
        const parser = new Parser(tokens);
        const ast = parser.parse();
        console.log(ast);
        const emitter = new Emitter(ast);
        const wasm = emitter.emit();
        console.log(wasm);
        const { instance } = await WebAssembly.instantiate(wasm, {
            env: {
                output: console.log
            }
        });
        console.log(instance);
        const run = instance.exports.run as CallableFunction;
        run();
    }

}

export {
    Interpreter
}
