import fs from 'fs';
import path from 'path';

import { expect } from 'chai';

import { blueprints } from '../src/index';

// Preload NX binary to avoid cold start penalty (only on Linux)
if (process.platform === 'linux') {
  import('@nx/nx-linux-x64-gnu').then(() => {
    console.log('NX binary preloaded');
  });
}

const opts = { encoding: 'utf-8' };
function readJsonFromDir(name) {
  const text = fs.readFileSync(path.join(__dirname, name), opts);
  const args = JSON.parse(text.trim());
  return args;
}

const threshholdForBlueprintInMs = 50;
it(`should run in less than ${threshholdForBlueprintInMs}ms`, async () => {
  // Ensure NX binary is loaded before test (only on Linux)
  if (process.platform === 'linux') {
    await import('@nx/nx-linux-x64-gnu');
  }

  const args = readJsonFromDir('slowArgs.json');
  const hrstart = process.hrtime();
  blueprints.createBlueprint(args);
  const hrend = process.hrtime(hrstart);
  const msMultiplier = 1000000;
  expect(hrend[1] / msMultiplier).to.be.lessThan(threshholdForBlueprintInMs);
});
