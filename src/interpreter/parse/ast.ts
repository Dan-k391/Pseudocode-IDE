import { Token, tokenType } from "../lex/token";


abstract class ASTNode {
    public abstract toString(): string;
}

class Expr extends ASTNode {
    toString(): string {
        return "Expr";
    }
}

class Stmt extends ASTNode {
    toString(): string {
        return "Stmt";
    }
}

interface Param {
    ident: string;
    type: string;
}

interface Arg {
    ident: string;
    type: string;
}

class ProgramNode extends ASTNode {
    public body: Array<Stmt>;

    constructor(body: Array<Stmt>) {
        super();
        this.body = body;
    }

    toString(): string {
        return "ProgramNode";
    }
}

class FuncDefNode extends Stmt {
    public ident: string;
    public params: Array<Param>;
    // change type
    public type: string;
    public body: Array<Stmt>;

    constructor(ident: string, params: Array<Param>, type: string, body: Array<ASTNode>) {
        super();
        this.ident = ident;
        this.params = params;
        this.type = type;
        this.body = body;
    }

    toString(): string {
        return "FuncDefNode";
    }
}

class ProcDefNode extends Stmt {
    public ident: string;
    public params: Array<Param>;
    public body: Array<Stmt>;

    constructor(ident: string, params: Array<Param>, body: Array<Stmt>) {
        super();
        this.ident = ident;
        this.params = params;
        this.body = body;
    }

    toString(): string {
        return "ProcDefNode";
    }
}

class ReturnNode extends Stmt {
    public expr: Expr;

    constructor(expr: Expr) {
        super();
        this.expr = expr;
    }

    toString(): string {
        return "ReturnNode";
    }
}

class VarDeclNode extends Stmt {
    public ident: Token;
    public type: Token;

    constructor(ident: Token, type: Token) {
        super();
        this.ident = ident;
        this.type = type;
    }

    toString(): string {
        return "VarDeclNode";
    }
}

class ArrDeclNode extends Stmt {
    public ident: string;
    public type: string;
    public lower: number;
    public upper: number;

    constructor(ident: string, type: string, lower: number, upper: number) {
        super();
        this.ident = ident;
        this.type = type;
        this.lower = lower;
        this.upper = upper;
    }

    toString(): string {
        return "ArrDeclNode";
    }
}

class TypeDefNode extends Stmt {
    public ident: string;
    public body: VarDeclNode;

    constructor(ident: string, body: VarDeclNode) {
        super();
        this.ident = ident;
        this.body = body;
    }

    toString(): string {
        return "TypeDefNode";
    }
}

class VarAssignNode extends Stmt {
    public ident: Token;
    public expr: Expr;

    constructor(ident: Token, expr: Expr) {
        super();
        this.ident = ident;
        this.expr = expr;
    }

    toString(): string {
        return "VarAssignNode";
    }
}

class ArrAssignNode extends Stmt {
    public ident: string;
    public index: number;
    public expr: Expr;

    constructor(ident: string, index: number, expr: Expr) {
        super();
        this.ident = ident;
        this.index = index;
        this.expr = expr;
    }

    toString(): string {
        return "ArrAssignNode";
    }
}

class IfNode extends Stmt {
    public condition: Expr;
    public body: Array<Stmt>;
    public else_body?: Array<Stmt>;

    constructor(condition: Expr, body: Array<Stmt>, else_body?: Array<Stmt>) {
        super();
        this.condition = condition;
        this.body = body;
        if (else_body) {
            this.else_body = else_body;
        }
    }

    toString(): string {
        return "IfNode";
    }
}

class WhileNode extends Stmt {
    public condition: Expr;
    public body: Array<Stmt>;

    constructor(condition: Expr, body: Array<Stmt>) {
        super();
        this.condition = condition;
        this.body = body;
    }

    toString(): string {
        return "WhileNode";
    }
}

class ForNode extends Stmt {
    // the identifier of the variable
    public ident: string;
    public start: number;
    public end: number;
    public body: Array<Stmt>;
    public step: number;

    constructor(ident: string, start: number, end: number, body: Array<Stmt>, step: number) {
        super();
        this.ident = ident;
        this.start = start;
        this.end = end;
        this.body = body;
        this.step = step;
    }

    toString(): string {
        return "ForNode";
    }
}

class ExprStmtNode extends Stmt {
    public expr: Expr;

    constructor(expr: Expr) {
        super();
        this.expr = expr;
    }

    toString(): string {
        return "ExprStmtNode";
    }
}

class VarExprNode extends Expr {
    public ident: Token;

    constructor(ident: Token) {
        super();
        this.ident = ident;
    }

    toString(): string {
        return "VarExprNode";
    }
}

class ArrExprNode extends Expr {
    public ident: string;
    public index: number;

    constructor(ident: string, index: number) {
        super();
        this.ident = ident;
        this.index = index;
    }

    toString(): string {
        return "ArrExprNode";
    }
}

class CallExprNode extends Expr {
    public ident: string;
    public args: Array<Arg>;

    constructor(ident: string, args: Array<Arg>) {
        super();
        this.ident = ident;
        this.args = args;
    }

    toString(): string {
        return "CallExprNode";
    }
}

class UnaryExprNode extends Expr {
    public operator: Token;
    public operand: Expr;

    constructor(operator: Token, operand: Expr) {
        super();
        this.operator = operator;
        this.operand = operand;
    }

    toString(): string {
        return "UnaryExprNode";
    }
}

class BinaryExprNode extends Expr {
    public left: Expr;
    public operator: Token;
    public right: Expr;

    constructor(left: Expr, operator: Token, right: Expr) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    toString(): string {
        return "BinaryExprNode";
    }
}

class IntExprNode extends Expr {
    public value: number;

    constructor(value: number) {
        super();
        this.value = value;
    }

    toString(): string {
        return "IntExprNode";
    }
}

class RealExprNode extends Expr {
    public value: number;

    constructor(value: number) {
        super();
        this.value = value;
    }

    toString(): string {
        return "RealExprNode";
    }
}

class StringExprNode extends Expr {
    public value: string;

    constructor(value: string) {
        super();
        this.value = value;
    }

    toString(): string {
        return "StringExprNode";
    }
}

class BoolExprNode extends Expr {
    public value: boolean;

    constructor(value: boolean) {
        super();
        this.value = value;
    }

    toString(): string {
        return "BoolExprNode";
    }
}

class OutputNode extends Stmt {
    public expr: Expr;

    constructor(expr: Expr) {
        super();
        this.expr = expr;
    }

    toString(): string {
        return "OutputNode";
    }
}

class InputNode extends Stmt {
    public ident: string;

    constructor(ident: string) {
        super();
        this.ident = ident;
    }

    toString(): string {
        return "InputNode";
    }
}

export {
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
};
