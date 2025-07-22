const execSync = require('child_process').execSync;
const path = require('path');
const jestStareProcessor = require('jest-stare');

const exec = (cmd) => execSync(cmd, { stdio: 'inherit' });
const formatSubDomain = (branch) => {
  return branch.replace(/[.]|_|[:]/g, '-').toLowerCase();
};

function getDomain(branchName, testName, gitSha) {
  const uniqueJobId = [branchName, testName, gitSha].join('-').substring(0, 62); // max domain length is 255. chopping string from the SHA so the doamin will look like this:
  return `${formatSubDomain(uniqueJobId)}.pro-gallery-report.surge.sh/`;
}

class DiffsReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }
  onRunComplete(contexts, results) {
    //          feature-name     82b582fb    ci:test-e2e-layouts
    const { CI, GITHUB_HEAD_REF, TEST_NAME, GITHUB_SHA } = process.env;
    const branchName = GITHUB_HEAD_REF || 'master';
    const domain = getDomain(branchName, TEST_NAME, GITHUB_SHA); // http://create-blueprints-package-test-e2e-layout-4acf916a430baadc.pro-gallery-report.surge.sh/
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
        console.log(`Will publish test report on failues to:${domain}`);
        exec(`yarn dlx surge --project ${reportPath} --domain ${domain}`);
        console.log(`publish report successfully. Click here: ${domain}`);
      } catch (error) {
        console.error('Error publishing reporter: ', error);
        process.exit(1);
      }
    }
  }
}
module.exports = DiffsReporter;
