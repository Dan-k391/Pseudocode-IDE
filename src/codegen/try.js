import { WabtModule } from "../libwabt.js";

function foo() {
    WabtModule().then(wabt => {
        const wasmModule = wabt.parseWat("test.wat", `(module
            (func (result i32)
                (i32.const 42)
            )
            (export "helloWorld" (func 0))
        )`);
        const { buffer } = wasmModule.toBinary({});
        console.log(buffer);
    })
}

export {
    foo
}
