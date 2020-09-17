const chalk = require('chalk');
const execSync = require('child_process').execSync;
const path = require('path');
const jestStareProcessor = require("jest-stare");

const exec = cmd => execSync(cmd, { stdio: 'inherit' });
const formatBranchName = branch => {
  return branch.replace(/[.]|_/g,'-').toLowerCase();
}

class DiffsReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }
  onRunComplete(contexts, results) {
    const { CI, TRAVIS_BRANCH, TRAVIS_COMMIT } = process.env;
    if (!CI) {
      console.log('Not in CI, skipping generating and publishing test report');
      return;
    }
    if (results.numFailedTests && results.snapshot.unmatched) {
      try {
        jestStareProcessor(results, {
          reportTitle: TRAVIS_BRANCH,
          reportHeadline: TRAVIS_COMMIT,
          hidePassing: true
        });
        const reportPath = path.resolve(process.cwd(), 'jest-stare');
        const domain = `${formatBranchName(TRAVIS_BRANCH)}.pro-gallery-report.surge.sh/`;
        console.log(`Publishing test report to ${domain}`);
        exec(`npx surge --project ${reportPath} --domain ${domain}`)
      } catch (error) {
        console.log('Error publishing reporter: ', error);
      }
    }
  }
}
module.exports = DiffsReporter;