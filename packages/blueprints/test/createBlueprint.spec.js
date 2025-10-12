import fs from 'fs';
import path from 'path';

import { expect } from 'chai';

import { blueprints } from '../src/index';

// Preload NX binary to avoid cold start penalty (only on Linux)
let nxBinaryPromise = null;
if (process.platform === 'linux') {
  nxBinaryPromise = import('@nx/nx-linux-x64-gnu')
    .then(() => {
      console.log('NX binary preloaded');
      return true;
    })
    .catch((error) => {
      console.warn('Failed to preload NX binary:', error.message);
      return false;
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
  // Ensure NX binary is fully loaded before test (only on Linux)
  if (process.platform === 'linux' && nxBinaryPromise) {
    await nxBinaryPromise;
    // Additional warmup to ensure binary is fully initialized
    try {
      await import('@nx/nx-linux-x64-gnu');
      console.log('NX binary fully loaded for test');
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
