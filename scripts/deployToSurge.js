/* eslint-disable no-console, fp/no-loops */

const path = require('path');
const chalk = require('chalk');
const execSync = require('child_process').execSync;

const ARTIFACTS_TO_DEPLOY = [
  {
    name: 'pro-gallery',
    path: 'packages/playground',
  },
];

const exec = cmd => execSync(cmd, { stdio: 'inherit' });

const toSurgeUrl = subdomain => `${subdomain}.surge.sh/`;

const generateSubdomains = subdomain => {
  const { version } = require('../lerna.json');
  const { TRAVIS_BRANCH, TRAVIS_PULL_REQUEST } = process.env;
  const isPullRequest = (TRAVIS_PULL_REQUEST && TRAVIS_PULL_REQUEST !== 'false');
  const isVersionSpecific = shouldPublishVersionSpecific();

  let subdomains = [];
  
  if (isPullRequest) {
    //push with -PR suffix
    subdomains.push(subdomain + `-pr-${TRAVIS_PULL_REQUEST}`);
  } else  if (TRAVIS_BRANCH === 'master') {
    if (isVersionSpecific) {
      //push with -v suffix
      subdomains.push(subdomain);
      subdomains.push(subdomain + `-${version.replace(/\./g, '-')}`);
    }
    //push with -master suffix
    subdomains.push(subdomain + `-master`);
  }

  return subdomains;
};

function build() {
  const buildCommand = 'npm run build';
  console.log(chalk.magenta(`Running: "${buildCommand}"`));
  exec(buildCommand);
}

function getLatestCommit() {
    const gitCommand = `git log --pretty=format:%B HEAD~1..HEAD`;
    return execSync(gitCommand, {
        stdio: 'pipe'
    });
}

function shouldPublishVersionSpecific() {
    const commit = getLatestCommit();
    const regex = /^v\d.\d{1,2}.\d{1,3}$/gm;
    return !!(regex.exec(commit)) 
}

function deploy(name) {
  console.log(chalk.cyan(`Deploying ${name} to surge...`));
  const subdomains = generateSubdomains(name);
  let deployCommand = subdomains.map(subdomain => `npx surge build ${toSurgeUrl(subdomain)}`).join(' && ');
  try {
    console.log(chalk.magenta(`Running "${deployCommand}`));
    exec(deployCommand);
  } catch (e) {
    console.error(chalk.bold.red(e));
  }
}

function run() {
  let skip;
  const { SURGE_LOGIN, TRAVIS_BRANCH, TRAVIS_PULL_REQUEST, CI } = process.env;
  if (!CI) {
    skip = 'Not in CI';
  } else if (!SURGE_LOGIN) {
    skip = 'PR from fork';
  }
  if (skip) {
    console.log(chalk.yellow(`${skip} - skipping deploy to surge`));
    return false;
  }

  for (const artifact of ARTIFACTS_TO_DEPLOY) {
    process.chdir(path.resolve(process.cwd(), artifact.path));

    console.log(chalk.blue(`\nDeploying ${artifact.name} artifact...`));
    //build();
    deploy(artifact.name);

    process.chdir(path.resolve('../..'));
  }
}

run();