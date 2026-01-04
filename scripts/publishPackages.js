/* eslint-disable no-console */
const execSync = require('child_process').execSync;
const semver = require('semver');
const fs = require('fs');
const path = require('path');
const { get, memoize, colors } = require('./utils');

function lernaPackages() {
  const packagesDir = path.join(__dirname, '../packages');

  return fs.readdirSync(packagesDir)
    .filter(dir => fs.statSync(path.join(packagesDir, dir)).isDirectory())
    .map(dir => {
      const pkgPath = path.join(packagesDir, dir, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        return {
          name: pkg.name,
          version: pkg.version,
          private: pkg.private,
          path: path.join(packagesDir, dir),
          registry: (pkg.publishConfig && pkg.publishConfig.registry) || 'https://registry.npmjs.org/'
        };
      }
      return null;
    })
    .filter(Boolean);
}

const LATEST_TAG = 'latest';
const NEXT_TAG = 'next';
const OLD_TAG = 'old';

const publishedPackages = [];

const getPackageDetails = memoize(pkg => {
  try {
    const npmShowCommand = `npm show ${pkg.name} --registry=${pkg.registry} --json`;
    return JSON.parse(execSync(npmShowCommand, { stdio: ['pipe', 'pipe', 'ignore'] }));
  } catch (error) {
    if (!error.stdout.toString().includes('E404')) {
      console.error(colors.red(`\nError: ${error}`));
    }
  }
});

function getPublishedVersions(pkg) {
  return get(getPackageDetails(pkg), 'versions', []);
}

function getLatestVersion(pkg) {
  return get(getPackageDetails(pkg), 'dist-tags.latest');
}

function shouldPublishPackage(pkg) {
  const remoteVersionsList = getPublishedVersions(pkg);

  return !remoteVersionsList.includes(pkg.version);
}

function getTag(pkg) {
  const latestVersion = getLatestVersion(pkg);

  const isLessThanLatest = () => latestVersion && semver.lt(pkg.version, latestVersion);

  const isPreRelease = () => semver.prerelease(pkg.version) !== null;

  if (isLessThanLatest()) {
    return OLD_TAG;
  }

  if (isPreRelease()) {
    return NEXT_TAG;
  }

  return LATEST_TAG;
}

function publish(pkg) {
  const publishCommand = `npm publish ${pkg.path} --tag=${getTag(pkg)} --registry=${pkg.registry}`;
  console.log(colors.magenta(`Running: "${publishCommand}" for ${pkg.name}@${pkg.version}`));
  execSync(publishCommand, { stdio: 'inherit' });
  publishedPackages.push(pkg);
  return true;
}

function release(pkg) {
  console.log(`\nStarting the release process for ${colors.bold(pkg.name)}`);

  if (!shouldPublishPackage(pkg)) {
    console.log(
      colors.blue(`${pkg.name}@${pkg.version} already exists on registry ${pkg.registry}`)
    );
    console.log('No publish performed');
    return;
  }

  const published = publish(pkg);
  if (published) {
    console.log(
      colors.green(`Published "${pkg.name}@${pkg.version}" succesfully to ${pkg.registry}`)
    );
  } else {
    console.log('No publish performed');
  }
}

function createNpmRc() {
  execSync(`rm -f **/package-lock.json`);
  const { NPM_EMAIL, NPM_TOKEN } = process.env;
  const EOL = require('os').EOL;
  const content = `email=${NPM_EMAIL}${EOL}//registry.npmjs.org/:_authToken=${NPM_TOKEN}${EOL}`;
  const fs = require('fs');
  fs.writeFileSync(`.npmrc`, content);
}

function publishPackages() {
  lernaPackages()
    .filter(p => !p.private)
    .forEach(p => release(p));
}

function run() {
  let skip;
  const { FORCE_PUBLISH, TRAVIS_BRANCH, TRAVIS_TAG, CI } = process.env;
  if (TRAVIS_TAG !== TRAVIS_BRANCH && !FORCE_PUBLISH) {
    skip = `Not publishing on an untagged branch (${TRAVIS_BRANCH})`;
  } else if (!CI) {
    skip = 'Not in CI';
  }
  if (skip) {
    console.log(colors.yellow(`${skip} - skipping publish`));
    return false;
  }

  createNpmRc();
  publishPackages();
}

run();
