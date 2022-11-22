/**
 * This parser is also highly overlapping with "https://craftinginterpreters.com/parsing-expressions.html"
 * (perhaps I would change it in the future)
 * 
 * I personally do not like doing this his way of writing the parser. However, due to the fact that he has
 * published a book and I am just a high school student, I prefer to believe that his logic on the parser
 * is better than mine for others to understand.
 * 
 * Furthermore, I strongly recommend the book above (It really helped on my first hand-writen parser).
 * 
 */

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
} from "./ast";

import { SyntaxError } from "../error";
import { tokenType, Token } from "../lex/token";


class Parser {
    private tokens: Array<Token>;
    private current: number;
    
    constructor(tokens: Array<Token>) {
        this.tokens = tokens;
        this.current = 0;
    }

    public parse(): ProgramNode {
        const statements: Array<Stmt> = [];
        while (!this.isAtEnd()) {
            statements.push(this.statement());
        }
        return new ProgramNode(statements);
    }

    private expression(): Expr {
        return this.equality();
    }

    private equality(): Expr {
        let expr: Expr = this.comparison();
        while (this.match(tokenType.EQUAL, tokenType.LESS_GREATER, tokenType.OR)) {
            const operator: Token = this.previous();
            const right: Expr = this.comparison();
            expr = new BinaryExprNode(expr, operator, right);
        }
        return expr;
    }

    private comparison(): Expr {
        let expr: Expr = this.term();
        while (this.match(tokenType.GREATER, tokenType.GREATER_EQUAL, tokenType.LESS, tokenType.LESS_EQUAL, tokenType.AND)) {
            const operator: Token = this.previous();
            const right: Expr = this.term();
            expr = new BinaryExprNode(expr, operator, right);
        }
        return expr;
    }

    private term(): Expr {
        let expr: Expr = this.factor();
        while (this.match(tokenType.MINUS, tokenType.PLUS)) {
            const operator: Token = this.previous();
            const right: Expr = this.factor();
            expr = new BinaryExprNode(expr, operator, right);
        }
        return expr;
    }

    private factor(): Expr {
        let expr: Expr = this.unary();
        while (this.match(tokenType.SLASH, tokenType.STAR, tokenType.MOD)) {
            const operator: Token = this.previous();
            const right: Expr = this.unary();
            expr = new BinaryExprNode(expr, operator, right);
        }
        return expr;
    }

    private unary(): Expr {
        if (this.match(tokenType.PLUS, tokenType.MINUS, tokenType.NOT)) {
            const operator: Token = this.previous();
            const right: Expr = this.unary();
            return new UnaryExprNode(operator, right);
        }
        return this.primary();
    }

    private primary(): Expr {
        if (this.match(tokenType.FALSE)) return new BoolExprNode(false);
        if (this.match(tokenType.TRUE)) return new BoolExprNode(true);
        if (this.match(tokenType.INTEGER)) return new IntExprNode(this.previous().literal);
        if (this.match(tokenType.REAL)) return new RealExprNode(this.previous().literal);
        if (this.match(tokenType.IDENTIFIER)) {
            return new VarExprNode(this.previous());
        }
        if (this.match(tokenType.LEFT_PAREN)) {
            const expr: Expr = this.expression();
            this.consume("Expected ')' after expression.", tokenType.RIGHT_PAREN);
            return expr
        }

        throw this.error(this.peek(), "Expected expression.");
    }

    private statement(): Stmt {
        if (this.match(tokenType.OUTPUT)) return this.outputStatement();
        if (this.match(tokenType.DECLARE)) return this.varDeclaration();
        if (this.match(tokenType.IDENTIFIER)) return this.varAssignment();

        return this.expressionStatement();
    }

    private outputStatement(): Stmt {
        const expr = this.expression();
        return new OutputNode(expr);
    }

    private varDeclaration(): Stmt {
        const ident: Token = this.consume("Expect variable name", tokenType.IDENTIFIER);
        this.consume("Expected colon", tokenType.COLON);
        const type: Token = this.consume("Expected type", tokenType.INTEGER, tokenType.REAL, tokenType.CHAR, tokenType.STRING, tokenType.BOOLEAN);
        return new VarDeclNode(ident, type);
    }

    private varAssignment(): Stmt {
        const ident: Token = this.previous();
        this.consume("Expected assignment symbol", tokenType.LESS_MINUS);
        const expr: Expr = this.expression();
        return new VarAssignNode(ident, expr);
    }

    private expressionStatement(): Stmt {
        const expr: Expr = this.expression();
        return new ExprStmtNode(expr);
    }

    private match(...types: Array<tokenType>): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    private check(type: tokenType): boolean {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    private advance(): Token {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    private isAtEnd(): boolean {
        return this.peek().type === tokenType.EOF;
    }

    private peek(): Token {
        return this.tokens[this.current];
    }

    private previous(): Token {
        return this.tokens[this.current - 1];
    }

    private consume(message: string, ...types: Array<tokenType>): Token {
        for (const type of types) {
            if (this.check(type)) {
                return this.advance();
            }
        }
        throw this.error(this.peek(), message);
    }

    private error(token: Token, message: string): void {
        throw new SyntaxError(message, token.line, token.startColumn, token.endColumn);
    }
}

export { 
    Parser 
};
