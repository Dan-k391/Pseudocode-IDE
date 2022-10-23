import { SyntaxError } from "./error";
import { Token } from "./token";


const WHITESPACE = /\s/;
const NUMBERS = /[0-9]/;
const SINGLEOPERATORS = /[+\-*/()[\]=<>:,&.]/;
const DOUBLEOPERATORS = ['<-', '<=', '>=', '<>'];
const LETTERS = /[a-z]/i;
const BOOLEANS = ['TRUE', 'FALSE'];
// built-in functions are also combined in KEYWORDS
const KEYWORDS = ['FUNCTION', 'ENDFUNCTION', 'PROCEDURE', 'ENDPROCEDURE', 'RETURNS', 'RETURN', 'CALL',
                  'DECLARE', 'ARRAY', 'OF', 'TYPE', 'ENDTYPE',
                  'IF', 'THEN', 'ELSE', 'ENDIF', 'WHILE', 'ENDWHILE', 'FOR', 'TO', 'STEP', 'NEXT', 'MOD', 'AND', 'OR', 'NOT',
                  'OUTPUT', 'INPUT', 'RND', 'TIME'];
const TYPES = ['INTEGER', 'REAL', 'CHAR', 'STRING', 'BOOLEAN'];


class Scanner {
    input: string;
    current_line = 1;

    constructor(input: string) {
        this.input = input;
    }

    scan(): Array<Token> {
        const all_tokens: Array<Token> = [];
        const lines: Array<string> = this.input.split('\n');

        for (const line of lines) {
            const tokens = this.tokenize_line(line);
            all_tokens.push(...tokens);
            this.current_line++;
        }
        return all_tokens;
    }

    tokenize_line(line: string): Array<Token> {
        let current = 0;
        const tokens: Array<Token> = [];

        while (current < line.length) {
            let char = line[current];
            let token: Token;

            if (char == '/' && line[current + 1] == '/') {
                return tokens;
            }
            else if (WHITESPACE.test(char)) {
                current++;
                continue;
            }
            else if (SINGLEOPERATORS.test(char)) {
                if (DOUBLEOPERATORS.includes(char + line[current + 1])) {
                    current += 2;
                    // line[current - 1] because current has already been incremented
                    token = new Token('operator', char + line[current - 1], this.current_line, current - 2, current);
                    tokens.push(token);
                    continue;
                }

                current++;
                token = new Token('operator', char, this.current_line, current - 1, current);
                tokens.push(token);
                continue;
            }
            else if (LETTERS.test(char) || char == '_') {
                let value = '';

                while ((LETTERS.test(char) || NUMBERS.test(char) || char == '_') && current < line.length) {
                    value += char;
                    char = line[++current];
                }

                if (TYPES.includes(value)) {
                    token = new Token('type', value, this.current_line, current - value.length, current);
                }
                else if (BOOLEANS.includes(value)) {
                    token = new Token('boolean', value, this.current_line, current - value.length, current);
                }
                else if (KEYWORDS.includes(value)) {
                    token = new Token('keyword', value, this.current_line, current - value.length, current);
                }
                else {
                    token = new Token('identifier', value, this.current_line, current - value.length, current);
                }
                tokens.push(token);
                continue;
            }
            else if (NUMBERS.test(char)) {
                let value = '';
                let dot = false;

                while (current < line.length) {
                    if (char == '.') {
                        if (dot) {
                            throw new SyntaxError('Invalid number', this.current_line, current - value.length, current);
                        }
                        dot = true;
                    }
                    else if (!NUMBERS.test(char)) {
                        break;
                    }
                    value += char;
                    char = line[++current];
                }
                token = new Token('number', value, this.current_line, current - value.length, current);
                tokens.push(token);
                continue;
            }
            else if (char == '"') {
                let value = '';
                char = line[++current];

                while (char != '"' && current < line.length) {
                    value += char;
                    char = line[++current];
                }
                if (current == line.length) {
                    throw new SyntaxError('Unterminated string', this.current_line, current - value.length - 1, current);
                }
                else {
                    current++;
                    token = new Token('string', value, this.current_line, current - value.length - 2, current);
                    tokens.push(token);
                }
            }
            else if (char == "'") {
                let value = '';
                char = line[++current];

                while (char != "'" && current < line.length) {
                    value += char;
                    char = line[++current];
                }
                if (current == line.length) {
                    throw new SyntaxError('Unterminated char', this.current_line, current - value.length - 1, current);
                }
                else if (value.length > 1) {
                    throw new SyntaxError('Char must be a single character', this.current_line, current - value.length - 1, current);
                }
                else {
                    current++;
                    token = new Token('char', value, this.current_line, current - value.length - 2, current);
                    tokens.push(token);
                }
            }
            else {
                throw new SyntaxError('Unexpected character', this.current_line, current, current + 1);
            }
        }
        return tokens;
    }
}

export {
    Scanner
};
