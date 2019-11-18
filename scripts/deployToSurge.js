/* eslint-disable no-console, fp/no-loops */

const path = require('path');
const chalk = require('chalk');
const execSync = require('child_process').execSync;

const EXAMPLES_TO_DEPLOY = [
  {
    name: 'pro-gallery',
    path: 'packages/playground',
  },
];

const exec = cmd => execSync(cmd, { stdio: 'inherit' });

const fqdn = subdomain => `${subdomain}.surge.sh/`;

const generateSubdomain = exampleName => {
  const { version } = require('../lerna.json');
  let subdomain = exampleName;
  const { TRAVIS_PULL_REQUEST } = process.env;
  if (TRAVIS_PULL_REQUEST && TRAVIS_PULL_REQUEST !== 'false') {
    subdomain += `-pr-${TRAVIS_PULL_REQUEST}`;
  } else {
    subdomain += `-${version.replace(/\./g, '-')}`;
  }
  return subdomain;
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
    console.log({commit});
    const regex = /^v\d.\d{1,2}.\d{1,3}$/gm;
    return !!(regex.exec(commit)) 
}

function deploy(name) {
  console.log(chalk.cyan(`Deploying ${name} example to surge...`));
  const subdomain = generateSubdomain(name);
  const domain = fqdn(subdomain);
  let deployCommand = `npx surge build ${fqdn(name)}`;
  console.log({deployCommand});
  if (shouldPublishVersionSpecific()) {
      deployCommand += `&& npx surge build ${domain}`;
  }
  console.log({deployCommand});
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
  if (TRAVIS_BRANCH !== 'master') {//} && TRAVIS_PULL_REQUEST === 'false') {
    skip = `Not deploying to surge on branch ${TRAVIS_BRANCH} or PR`;
  } else if (!CI) {
    skip = 'Not in CI';
  } else if (!SURGE_LOGIN) {
    skip = 'PR from fork';
  }
  if (skip) {
    console.log(chalk.yellow(`${skip} - skipping deploy to surge`));
    return false;
  }

  for (const example of EXAMPLES_TO_DEPLOY) {
    process.chdir(path.resolve(process.cwd(), example.path));

    console.log(chalk.blue(`\nDeploying ${example.name} example...`));
    //build();
    deploy(example.name);

    process.chdir(path.resolve('../..'));
  }
}

run();