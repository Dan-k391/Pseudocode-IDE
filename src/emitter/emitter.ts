// TODO: Improve the code

import {
    ASTNode,
    Expr,
    Stmt,
    Param,
    Arg,
    ProgramNode,
    FuncDefNode,
    ProcDefNode,
    ReturnNode,
    VarDeclNode,
    ArrDeclNode,
    TypeDefNode,
    VarAssignNode,
    ArrAssignNode,
    IfNode,
    WhileNode,
    ForNode,
    ExprStmtNode,
    VarExprNode,
    ArrExprNode,
    CallExprNode,
    UnaryExprNode,
    BinaryExprNode,
    IntExprNode,
    RealExprNode,
    StringExprNode,
    BoolExprNode,
    OutputNode,
    InputNode
} from "../interpreter/parse/ast";
import {
    unsignedLEB128,
    signedLEB128,
    encodeString,
    ieee754
} from "./encoding";
import { _Symbol } from "./symbol";
import { valType } from "./valtype";


const enum section {
    custom = 0,
    type = 1,
    import = 2,
    func = 3,
    table = 4,
    memory = 5,
    global = 6,
    export = 7,
    start = 8,
    element = 9,
    code = 10,
    data = 11
};

const enum opCode {
    block = 0x02,
    loop = 0x03,
    br = 0x0c,
    br_if = 0x0d,
    end = 0x0b,
    call = 0x10,
    get_local = 0x20,
    set_local = 0x21,
    i32_store_8 = 0x3a,
    i32_const = 0x41,
    f32_const = 0x43,
    i32_eqz = 0x45,
    i32_eq = 0x46,
    f32_eq = 0x5b,
    f32_lt = 0x5d,
    f32_gt = 0x5e,
    i32_and = 0x71,
    f32_add = 0x92,
    f32_sub = 0x93,
    f32_mul = 0x94,
    f32_div = 0x95,
    i32_trunc_f32_s = 0xa8
};

const enum exportType {
    func = 0x00,
    table = 0x01,
    mem = 0x02,
    global = 0x03
};

const funcType = 0x60;
const emptyArray = 0x00;

const magicModuleHeader = [0x00, 0x61, 0x73, 0x6d];
const moduleVersion = [0x01, 0x00, 0x00, 0x00];

function flatten(arr: Array<any>): Array<any> {
    return arr.reduce((acc, val) => acc.concat(val), []);
}

function encodeVector(data: Array<any>): Array<any> {
    return [
        ...unsignedLEB128(data.length),
        ...flatten(data)
    ];
}

function encodeLocal(count: number, type: valType): Array<number> {
    return [
        ...unsignedLEB128(count),
        type
    ];
}

function createSection(sectionType: section, sectionData: Array<any>): Array<any> {
    return [
        sectionType, 
        ...encodeVector(sectionData),
    ]
}

class Generator {
    private ast: ProgramNode;
    private code: Array<number>;
    private symbols: Map<string, _Symbol>;

    constructor(ast: ProgramNode) {
        this.ast = ast;
        this.code = new Array<number>();
        this.symbols = new Map<string, _Symbol>();
    }

    public generate(): Array<number> {
        for (const statement of this.ast.body) {
            this.emitStatement(statement);
        }

        // local declarations
        const localCount = this.symbols.size;
        const locals: Array<Array<number>> = [];
        for (const symbol of this.symbols.values()) {
            locals.push(encodeLocal(1, symbol.type));
        }
        console.log(this.code);

        return encodeVector([...encodeVector(locals), ...this.code, opCode.end]);
    }

    private setlocalIndexForSymbol(name: string, type: valType): number {
        if (!this.symbols.has(name)) {
            this.symbols.set(name, new _Symbol(this.symbols.size, type));
        }
        return this.getlocalIndexForSymbol(name);
    }

    private getlocalIndexForSymbol(name: string): number {
        return this.symbols.get(name)?.index as number;
    }

    private emitExpression(expression: Expr): void {
        switch (expression.toString()) {
            case "IntExprNode":
                this.intExpression(expression as IntExprNode);
                break;
            case "RealExprNode":
                this.realExpression(expression as RealExprNode);
                break;
            case "VarExprNode":
                this.varExpression(expression as VarExprNode);
                break;
            default:
                break;
        }
    }

    private intExpression(node: IntExprNode): void {
        this.code.push(opCode.i32_const);
        this.code.push(...unsignedLEB128(node.value));
    }
    
    private realExpression(node: RealExprNode): void {
        this.code.push(opCode.f32_const);
        this.code.push(...ieee754(node.value));
    }

    private varExpression(node: VarExprNode): void {
        this.code.push(opCode.get_local);
        this.code.push(...unsignedLEB128(this.getlocalIndexForSymbol(node.ident.lexeme)));
    }

    private emitStatement(statement: Stmt): void {
        switch (statement.toString()) {
            case "VarDeclNode":
                this.varDeclStatement(statement as VarDeclNode);
                break;
            case "VarAssignNode":
                this.varAssignStatement(statement as VarAssignNode);
                break;
            case "OutputNode":
                this.outputStatement(statement as OutputNode);
                break;
            default:
                break;
        }
    }

    private varDeclStatement(node: VarDeclNode): void {
        let type: valType = valType.i32;
        switch (node.type.lexeme) {
            case "INTEGER":
                type = valType.i32;
                this.emitExpression(new IntExprNode(0));
                break;
            case "REAL":
                type = valType.f32;
                this.emitExpression(new RealExprNode(0));
                break;
            default:
                break;
        }
        this.code.push(opCode.set_local);
        this.code.push(...unsignedLEB128(this.setlocalIndexForSymbol(node.ident.lexeme, type)));
    }

    private varAssignStatement(node: VarAssignNode): void {
        this.emitExpression(node.expr);
        this.code.push(opCode.set_local);
        this.code.push(...unsignedLEB128(this.getlocalIndexForSymbol(node.ident.lexeme)));
    }

    private outputStatement(node: OutputNode): void {
        this.emitExpression(node.expr);
        this.code.push(opCode.call);
        this.code.push(...unsignedLEB128(0));
    }
}

class Emitter {
    private ast: ProgramNode;

    constructor(ast: ProgramNode) {
        console.log(encodeLocal(2, valType.i32));
        this.ast = ast;
    }

    public emit(): Uint8Array {
        const generator = new Generator(this.ast);
        
        const voidVoidType = [funcType, emptyArray, emptyArray];
        const intVoidType = [
            funcType,
            // the function now can only output integers
            ...encodeVector([valType.i32]),
            emptyArray
        ];

        const typeSection = createSection(
            section.type,
            encodeVector([voidVoidType, intVoidType])
        );
        const funcSection = createSection(
            section.func,
            encodeVector([0x00])
        );
        const outputFunctionImport = [
            ...encodeString("env"),
            ...encodeString("output"),
            exportType.func,
            // type index
            0x01
        ];
        const importSection = createSection(
            section.import,
            encodeVector([outputFunctionImport])
        );
        const exportSection = createSection(
            section.export,
            encodeVector(
                // 0x01 is the index of the function, not type
                [[...encodeString("run"), exportType.func, 0x01]]
            )
        );
        const code = generator.generate();
        const codeSection = createSection(
            section.code,
            encodeVector([code])
        );

        return Uint8Array.from([
            ...magicModuleHeader,
            ...moduleVersion,
            ...typeSection,
            ...importSection,
            ...funcSection,
            ...exportSection,
            ...codeSection
        ]);
    }
}

export {
    Emitter
}
