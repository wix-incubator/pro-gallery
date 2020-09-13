const execSync = require('child_process').execSync;
const path = require('path');

const exec = cmd => execSync(cmd, { stdio: 'inherit' });

function deployReport() {
  // const { TRAVIS_BUILD_ID } = process.env;
  process.chdir(path.resolve(process.cwd(), 'packages/gallery/jest-stare'));
  exec(`npx surge --project ./ --domain pro-gallery-build-1234.surge.sh/`)
  process.chdir(path.resolve('../../..'));
}

deployReport()