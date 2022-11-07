class ASTNode {
}

class Expression extends ASTNode {
}

class Statement extends ASTNode {
}

interface Param extends ASTNode {
    ident: string;
    type: string;
}

interface Arg extends ASTNode {
    ident: string;
    type: string;
}

class ProgramNode extends ASTNode {
    body: Array<Statement>;

    constructor(body: Array<Statement>) {
        super();
        this.body = body;
    }

}

class FuncDefNode extends ASTNode {
    ident: string;
    params: Array<Param>;
    // change type
    type: string;
    body: Array<Statement>;

    constructor(ident: string, params: Array<Param>, type: string, body: Array<ASTNode>) {
        super();
        this.ident = ident;
        this.params = params;
        this.type = type;
        this.body = body;
    }
}

class ProcDefNode extends ASTNode {
    ident: string;
    params: Array<Param>;
    body: Array<Statement>;

    constructor(ident: string, params: Array<Param>, body: Array<Statement>) {
        super();
        this.ident = ident;
        this.params = params;
        this.body = body;
    }
}

class ReturnNode extends Statement {
    expression: Expression;

    constructor(expression: Expression) {
        super();
        this.expression = expression;
    }
}

class VarDeclNode extends Statement {
    ident: string;
    type: string;

    constructor(ident: string, type: string) {
        super();
        this.ident = ident;
        this.type = type;
    }
}

class ArrDeclNode extends Statement {
    ident: string;
    type: string;
    lower: number;
    upper: number;

    constructor(ident: string, type: string, lower: number, upper: number) {
        super();
        this.ident = ident;
        this.type = type;
        this.lower = lower;
        this.upper = upper;
    }
}

class TypeDefNode extends Statement {
    ident: string;
    body: VarDeclNode;

    constructor(ident: string, body: VarDeclNode) {
        super();
        this.ident = ident;
        this.body = body;
    }
}

class VarAssignNode extends Statement {
    ident: string;
    expression: Expression;

    constructor(ident: string, expression: Expression) {
        super();
        this.ident = ident;
        this.expression = expression;
    }
}

class ArrAssignNode extends Statement {
    ident: string;
    index: number;
    expression: Expression;

    constructor(ident: string, index: number, expression: Expression) {
        super();
        this.ident = ident;
        this.index = index;
        this.expression = expression;
    }
}

class IfNode extends Statement {
    condition: Expression;
    body: Array<Statement>;
    else_body?: Array<Statement>;

    constructor(condition: Expression, body: Array<Statement>, else_body?: Array<Statement>) {
        super();
        this.condition = condition;
        this.body = body;
        if (else_body) {
            this.else_body = else_body;
        }
    }
}

class WhileNode extends Statement {
    condition: Expression;
    body: Array<Statement>;

    constructor(condition: Expression, body: Array<Statement>) {
        super();
        this.condition = condition;
        this.body = body;
    }
}

class ForNode extends Statement {
    // the identifier of the variable
    ident: string;
    start: number;
    end: number;
    body: Array<Statement>;
    step: number;

    constructor(ident: string, start: number, end: number, body: Array<Statement>, step: number) {
        super();
        this.ident = ident;
        this.start = start;
        this.end = end;
        this.body = body;
        this.step = step;
    }
}

class VarExprNode extends Expression {
    ident: string;

    constructor(ident: string) {
        super();
        this.ident = ident;
    }
}

class ArrExprNode extends Expression {
    ident: string;
    index: number;

    constructor(ident: string, index: number) {
        super();
        this.ident = ident;
        this.index = index;
    }
}

class CallExprNode extends Expression {
    ident: string;
    args: Array<Arg>;

    constructor(ident: string, args: Array<Arg>) {
        super();
        this.ident = ident;
        this.args = args;
    }
}

class UnaryExprNode extends Expression {
    operator: string;
    operand: Expression;

    constructor(operator: string, operand: Expression) {
        super();
        this.operator = operator;
        this.operand = operand;
    }
}

class BinaryExprNode extends Expression {
    operator: string;
    left: Expression;
    right: Expression;

    constructor(operator: string, left: Expression, right: Expression) {
        super();
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
}

class NumberExprNode extends Expression {
    value: number;

    constructor(value: number) {
        super();
        this.value = value;
    }
}

class StringExprNode extends Expression {
    value: string;

    constructor(value: string) {
        super();
        this.value = value;
    }
}

class BoolExprNode extends Expression {
    value: boolean;

    constructor(value: boolean) {
        super();
        this.value = value;
    }
}

class OutputNode extends Statement {
    expression: Expression;

    constructor(expression: Expression) {
        super();
        this.expression = expression;
    }
}

class InputNode extends Statement {
    ident: string;

    constructor(ident: string) {
        super();
        this.ident = ident;
    }
}

export {
    ASTNode,
    Expression,
    Statement,
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
    VarExprNode,
    ArrExprNode,
    CallExprNode,
    UnaryExprNode,
    BinaryExprNode,
    NumberExprNode,
    StringExprNode,
    BoolExprNode,
    OutputNode,
    InputNode
};
