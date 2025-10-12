import fs from 'fs';
import path from 'path';

import { expect } from 'chai';

import { blueprints } from '../src/index';

// Preload NX binary to eliminate cold start penalty in CI
if (process.platform === 'linux') {
  try {
    require('@nx/nx-linux-x64-gnu');
    console.log('NX binary preloaded successfully');
  } catch (error) {
    console.warn('Failed to preload NX binary:', error.message);
  }
}

const opts = { encoding: 'utf-8' };
function readJsonFromDir(name) {
  const text = fs.readFileSync(path.join(__dirname, name), opts);
  const args = JSON.parse(text.trim());
  return args;
}

const threshholdForBlueprintInMs = 50;
it(`should run in less than ${threshholdForBlueprintInMs}ms`, () => {
  // Ensure NX binary is fully loaded before performance measurement
  if (process.platform === 'linux') {
    try {
      require('@nx/nx-linux-x64-gnu');
    } catch (error) {
      console.warn('Failed to load NX binary for test:', error.message);
    }
  }

  const args = readJsonFromDir('slowArgs.json');
  const hrstart = process.hrtime();
  blueprints.createBlueprint(args);
  const hrend = process.hrtime(hrstart);
  const msMultiplier = 1000000;
  const executionTime = hrend[1] / msMultiplier;
  console.log(`Blueprint creation took ${executionTime.toFixed(2)}ms`);
  expect(executionTime).to.be.lessThan(threshholdForBlueprintInMs);
});
