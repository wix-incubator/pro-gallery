const execSync = require('child_process').execSync;
const path = require('path');
const jestStareProcessor = require('jest-stare');

const exec = (cmd) => execSync(cmd, { stdio: 'inherit' });
const formatBranchName = (branch) => {
  return branch.replace(/[.]|_/g, '-').toLowerCase();
};

class DiffsReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }
  onRunComplete(contexts, results) {
    const { CI, GITHUB_HEAD_REF, GITHUB_SHA } = process.env;
    const branchName = GITHUB_HEAD_REF || 'master';
    const branchTriggertingCommit = `${branchName}-${GITHUB_SHA}`.substring(0, 100) // chopping string from the SHA and not the branch name.
    const domain = `${formatBranchName(
      branchTriggertingCommit
    )}.pro-gallery-report.surge.sh/`;
    console.log(`Will publish test report on failues to:${domain}`);
    if (!CI) {
      console.log('Not in CI, skipping generating and publishing test report');
      return;
    }
    if (results.numFailedTests && results.snapshot.unmatched) {
      try {
        jestStareProcessor(results, {
          reportTitle: branchName,
          reportHeadline: '',
          hidePassing: true,
        });
        const reportPath = path.resolve(process.cwd(), 'jest-stare');
        exec(`npx surge --project ${reportPath} --domain ${domain}`);
        console.log('report published successfully')
      } catch (error) {
        console.log('Error publishing reporter: ', error);
      }
    }
  }
}
module.exports = DiffsReporter;
