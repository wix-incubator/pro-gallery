import fs from 'fs';
import path from 'path';

import { expect } from 'chai';

import { blueprints } from '../src/index';

const opts = { encoding: 'utf-8' };
function readJsonFromDir(name) {
  const text = fs.readFileSync(path.join(__dirname, name), opts);
  const args = JSON.parse(text.trim());
  return args;
}

const threshholdForBlueprintInMs = 65;
it(`should run in less than ${threshholdForBlueprintInMs}ms`, () => {
  const args = readJsonFromDir('slowArgs.json');
  const hrstart = process.hrtime();
  blueprints.createBlueprint(args);
  const hrend = process.hrtime(hrstart);
  const msMultiplier = 1000000;
  expect(hrend[1] / msMultiplier).to.be.lessThan(threshholdForBlueprintInMs);
});
