import { BigNumber } from 'bignumber.js';
import * as pz from 'parzec';

enum ExprToken {
  Input,
  Number,
  OpenParen,
  CloseParen,
  Plus,
  Minus,
  Multiply,
  Divide,
  Whitespace,
  EOF,
}

const lexer = new pz.Lexer(
  [/\{\d\}/, ExprToken.Input],
  [/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/, ExprToken.Number],
  [/\(/, ExprToken.OpenParen],
  [/\)/, ExprToken.CloseParen],
  [/\+/, ExprToken.Plus],
  [/-/, ExprToken.Minus],
  [/\*/, ExprToken.Multiply],
  [/\//, ExprToken.Divide],
  [/[\t\n\r ]+/, ExprToken.Whitespace]
);

const optws = pz.terminal(ExprToken.Whitespace, '<whitespace>').optionalRef();
let inputFromArg: (inputIndex: string) => BigNumber;
const input = pz
  .terminal(ExprToken.Input, '<input>')
  .map((t) => inputFromArg(t.text))
  .followedBy(optws);
const number = pz
  .terminal(ExprToken.Number, '<number>')
  .map((token) => new BigNumber(token.text))
  .followedBy(optws);
const openParen = pz.terminal(ExprToken.OpenParen, '(').followedBy(optws);
const closeParen = pz.terminal(ExprToken.CloseParen, ')').followedBy(optws);
const plus = pz.terminal(ExprToken.Plus, '+').followedBy(optws);
const minus = pz.terminal(ExprToken.Minus, '-').followedBy(optws);
const multiply = pz.terminal(ExprToken.Multiply, '*').followedBy(optws);
const divide = pz.terminal(ExprToken.Divide, '/').followedBy(optws);
const eof = pz.terminal(ExprToken.EOF, '<end of input>');

const addop = pz.operators(
  [plus, (a: BigNumber, b: BigNumber) => a.plus(b)],
  [minus, (a: BigNumber, b: BigNumber) => a.minus(b)]
);

const mulop = pz.operators(
  [multiply, (a: BigNumber, b: BigNumber) => a.times(b)],
  [divide, (a: BigNumber, b: BigNumber) => a.div(b)]
);

const term = new pz.Ref<pz.Parser<BigNumber, pz.Token<ExprToken>>>();
const expr = pz.forwardRef(term).chainOneOrMore(addop);
const factor = expr.bracketedBy(openParen, closeParen).or(number).or(input);
term.target = factor.chainOneOrMore(mulop);

const rootExpr = optws.seq(expr).followedBy(eof);

const numberFromArg = (arg: string) =>
  parseInt(arg.substring(1, arg.length - 1)); //{123} -> 123

type ExpressionElement = number | BigNumber | string | bigint;

module Decimalize {
  export function combineElements(
    strings: TemplateStringsArray | string[],
    ...elements: string[]
  ) {
    let combined = [] as string[];

    for (let i = 0; i < strings.length; ++i) {
      combined.push(strings[i]);
      if (i < elements.length) {
        combined.push(elements[i]);
      }
    }

    return combined;
  }

  export function evaluate(expression: string, inputs: ExpressionElement[]) {
    inputFromArg = (arg) =>
      new BigNumber(inputs[numberFromArg(arg)] as number | BigNumber | string);

    return pz.parse(
      rootExpr,
      pz.lexerInput<ExprToken>(
        expression,
        lexer,
        new pz.Token(ExprToken.EOF, '<end of input>')
      )
    );
  }
}

export const dec = (
  strings: TemplateStringsArray,
  ...args: ExpressionElement[]
) => {
  let argIndices = args.map((_, idx) => `{${idx}}`);
  let elements = Decimalize.combineElements(strings, ...argIndices);
  let result = Decimalize.evaluate(elements.join(''), args);
  return parseFloat(result.toString());
};

export default dec;
