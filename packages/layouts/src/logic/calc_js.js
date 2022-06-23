/* eslint-disable no-unused-vars */
import { BigNumber } from 'bignumber.js';
import * as pz from 'parzec';

const lexer = new pz.Lexer(
  [/\{\d\}/, undefined],
  [/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/, undefined],
  [/\(/, undefined],
  [/\)/, undefined],
  [/\+/, undefined],
  [/-/, undefined],
  [/\*/, undefined],
  [/\//, undefined],
  [/[\t\n\r ]+/, undefined]
);

const optws = pz.terminal(undefined, '<whitespace>').optionalRef();
let inputFromArg;
const input = pz
  .terminal('<input>')
  .map((t) => inputFromArg(t.text))
  .followedBy(optws);
const number = pz
  .terminal('<number>')
  .map((token) => new BigNumber(token.text))
  .followedBy(optws);
const openParen = pz.terminal(undefined, '(').followedBy(optws);
const closeParen = pz.terminal(undefined, ')').followedBy(optws);
const plus = pz.terminal(undefined, '+').followedBy(optws);
const minus = pz.terminal(undefined, '-').followedBy(optws);
const multiply = pz.terminal(undefined, '*').followedBy(optws);
const divide = pz.terminal(undefined, '/').followedBy(optws);
const eof = pz.terminal(undefined, '<end of input>');

const addop = pz.operators(
  [plus, (a, b) => a.plus(b)],
  [minus, (a, b) => a.minus(b)]
);

const mulop = pz.operators(
  [multiply, (a, b) => a.times(b)],
  [divide, (a, b) => a.div(b)]
);

const term = new pz.Ref();
const expr = pz.forwardRef(term).chainOneOrMore(addop);
const factor = expr.bracketedBy(openParen, closeParen).or(number).or(input);
term.target = factor.chainOneOrMore(mulop);

const rootExpr = optws.seq(expr).followedBy(eof);

const numberFromArg = (arg) => parseInt(arg.substring(1, arg.length - 1)); //{123} -> 123

function combineElements(strings, ...elements) {
  let combined = [];

  for (let i = 0; i < strings.length; ++i) {
    combined.push(strings[i]);
    if (i < elements.length) {
      combined.push(elements[i]);
    }
  }

  return combined;
}

function evaluate(expression, inputs) {
  inputFromArg = (arg) => new BigNumber(inputs[numberFromArg(arg)]);

  return pz.parse(
    rootExpr,
    pz.lexerInput(expression, lexer, new pz.Token(undefined, '<end of input>'))
  );
}

export const dec = (strings, ...args) => {
  let argIndices = args.map((_, idx) => `{${idx}}`);
  let elements = combineElements(strings, ...argIndices);
  let result = evaluate(elements.join(''), args);
  return parseFloat(result.toString());
};

export default dec;
