// import {
//     ASTNode,
//     Expression,
//     Statement,
//     Param,
//     Arg,
//     ProgramNode,
//     FuncDefNode,
//     ProcDefNode,
//     ReturnNode,
//     VarDeclNode,
//     ArrDeclNode,
//     TypeDefNode,
//     VarAssignNode,
//     ArrAssignNode,
//     IfNode,
//     WhileNode,
//     ForNode,
//     VarExprNode,
//     ArrExprNode,
//     CallExprNode,
//     UnaryExprNode,
//     BinaryExprNode,
//     NumberExprNode,
//     StringExprNode,
//     BoolExprNode,
//     OutputNode,
//     InputNode
// } from "./ast";

// import { SyntaxError } from "../error";
// import { Token } from "../lex/token";


// class Parser {
//     tokens: Array<Token>;
//     current: number;
    
//     constructor(tokens: Array<Token>) {
//         this.tokens = tokens;
//         this.current = 0;
//     }

//     report_error(msg: string): void {
//         const type: string = this.tokens[this.current]['type'];
//         const value: string = this.tokens[this.current]['value'];
//         const line: number = this.tokens[this.current]['line'];
//         const start_column: number = this.tokens[this.current]['start_column'];
//         const end_column: number = this.tokens[this.current]['end_column'];
//         throw new SyntaxError(msg + " (type '" + type + "', value: '" + value + "')", line, start_column, end_column);
//     }



//     parse(): ProgramNode {
//         const statements: Array<Statement> = new Array<Statement>();
//         while (!this.isAtEnd()) {
//             statements.push(this.declaration());
//         }
//         return new ProgramNode(statements);
//     }


// }
