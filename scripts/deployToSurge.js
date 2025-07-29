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

const formatBranchName = branch => {
  return branch.replace(/_/g, '-').toLowerCase();
}

const generateSubdomains = subdomain => {
  const { version } = require('../lerna.json');
  const { GITHUB_HEAD_REF, GITHUB_SHA } = process.env;
  const isVersionSpecific = shouldPublishVersionSpecific(GITHUB_HEAD_REF);

  console.log(chalk.magenta(`Generating Surge subdomains from branch: ${GITHUB_HEAD_REF}, version: ${version}, commit: ${GITHUB_SHA}`));

  let subdomains = [];
  if (isVersionSpecific) {
      //push with -v suffix
      subdomains.push(subdomain);
      console.log(chalk.magenta(`Add subdomain: ${subdomains[subdomains.length - 1]}`));
      subdomains.push(subdomain + `-${version.replace(/\./g, '-')}`);
      console.log(chalk.magenta(`Add subdomain: ${subdomains[subdomains.length - 1]}`));
      subdomains.push(subdomain + `-master`);
      console.log(chalk.magenta(`Add subdomain: ${subdomains[subdomains.length - 1]}`));
  } else {
    //push with branch suffix
    const branchName = formatBranchName(GITHUB_HEAD_REF);
    if (branchName) {
        subdomains.push(`${subdomain}-${branchName}`);
    } else {
        subdomains.push(subdomain);
    }
    console.log(chalk.magenta(`Add subdomain: ${subdomains[subdomains.length - 1]}`));
  }

  

  return subdomains;
};

function build() {
  const buildCommand = 'yarn build';
  console.log(chalk.magenta(`Running: "${buildCommand}"`));
  exec(buildCommand);
}

function getLatestCommit(commitSha) {
    const gitCommand = `git log --pretty=format${commitSha}`;
    return execSync(gitCommand, {
        stdio: 'pipe'
    });
}

function shouldPublishVersionSpecific(commit) {
    const regex = /^v\d.\d{1,2}.\d{1,3}$/gm;
    return !!(regex.exec(commit)) 
}

function deploy(name) {
  console.log(chalk.cyan(`Deploying ${name} to surge...`));
  const subdomains = generateSubdomains(name).map(subdomain => toSurgeUrl(subdomain));
  let deployCommand = subdomains.map(subdomain => `yarn dlx surge build ${subdomain}`).join(' && ');
  console.log(chalk.magenta(`Deployed URLs: \n${subdomains.map(sd => 'https://' + sd).join('\n')}`));

  try {
    console.log(chalk.magenta(`Running "${deployCommand}`));
    exec(deployCommand);
  } catch (e) {
    console.error(chalk.bold.red(e));
  }
}

function run() {
  let skip;
  const { SURGE_LOGIN, CI } = process.env;
  if (!CI) {
    skip = 'Not in CI';
  } else if (!SURGE_LOGIN) {
    skip = 'Invalid surge credentials';
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