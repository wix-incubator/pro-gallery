const execSync = require('child_process').execSync;
const path = require('path');
const jestStareProcessor = require('jest-stare');

const exec = (cmd) => execSync(cmd, { stdio: 'inherit' });
const formatSubDomain = (branch) => {
  return branch.replace(/[.]|_|[:]/g, '-').toLowerCase();
};

class DiffsReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }
  onRunComplete(contexts, results) {
    //          feature-name     82b582fb    ci:test-e2e-layouts
    const { CI, GITHUB_HEAD_REF, GITHUB_SHA, TEST_NAME } = process.env;
    const branchName = GITHUB_HEAD_REF || 'master';
    const uniqueJobId = [branchName, TEST_NAME, GITHUB_SHA]
      .join('-')
      .substring(0, 100); // max domain length is 255. chopping string from the SHA so the doamin will look like this:  http://create-blueprints-package-test-e2e-layout-4acf916a430baadc.pro-gallery-report.surge.sh/

    // This ensures that I will not overwrite any diff written by parallel tasks. If a new commit is added a new SHA is generated makes it easier to compare between the same commits in each PR.
    const domain = `${formatSubDomain(
      uniqueJobId
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
        console.log('report published successfully');
      } catch (error) {
        console.log('Error publishing reporter: ', error);
        process.exit(1);
      }
    }
  }
}
module.exports = DiffsReporter;
