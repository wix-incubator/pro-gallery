/* eslint-disable no-console */
const {spawn, execSync} = require('child_process');
const chalk = require('chalk');
const prompt = require('prompt');
const {
    get,
    memoize
} = require('lodash');

const PACKAGE = 'pro-gallery';
const BUMP_TYPES = {
    PATCH: 'patch',
    MINOR: 'minor',
    MAJOR: 'major',
};
const CHANGELOG = 'changelog.md';

const getPackageDetails = memoize(() => {
    try {
        const npmShowCommand = `npm show ${PACKAGE} --json`;
        return JSON.parse(execSync(npmShowCommand, {
            stdio: ['pipe', 'pipe', 'ignore']
        }));
    } catch (error) {
        if (!error.stdout.toString().includes('E404')) {
            console.error(chalk.red(`\nError: ${error}`));
        }
    }
});

function getLatestVersion() {
    return get(getPackageDetails(), 'dist-tags.latest');
}

function getCommitsUntilVersion(version) {
    const gitCommand = `git log --pretty=format:%B v${version}..HEAD`;
    return execSync(gitCommand, {
        stdio: 'pipe'
    });
}

function getLatestCommit() {
    const gitCommand = `git log --pretty=format:%B HEAD~1..HEAD`;
    return execSync(gitCommand, {
        stdio: 'pipe'
    });
}

function editChangelogAndUpdateVersion(bump) {
    var editor = process.env.EDITOR || 'code';
    var child = spawn(editor, [CHANGELOG], {
        stdio: 'inherit'
    });
    
    prompt.start();
    var property = {
        name: 'yesno',
        message: 'Do you want to release a new version? (y/n)',
        validator: /y[es]*|n[o]?/,
        warning: 'Must respond yes or no',
        default: 'no'
    };
    prompt.get(property, function(err, result) {                
        if(result === 'no'){
            process.exit(0);
        } else {
            // child.on('exit', function (e, code) {
            execSync(`git commit -am "[main] update ${CHANGELOG}"`, {
                stdio: 'pipe'
            });
            log(`Saved ${CHANGELOG}, releasing new version`);
            const bumpCommand = `lerna version ${bump} --yes --no-push`;
            execSync(`${bumpCommand}`, {
                stdio: 'pipe'
            });
            // });
        }
    });

}

function getBumpedVersion(version, bump) {
    const versionArr = String(version).replace('v', '').split('.');
    switch (bump) {
        case BUMP_TYPES.PATCH:
            versionArr[2]++;
            break;
        case BUMP_TYPES.MINOR:
            versionArr[1]++;
            break;
        case BUMP_TYPES.MAJOR:
            versionArr[0]++;
            break;
    }
    return versionArr.join('.');
}

function writeToChangelog(str) {
    const writeCommand = `echo "${str}" >> ${CHANGELOG}`;
    execSync(writeCommand);
}

function formatForChangelog(version, commits) {
    const versionStr = `##${version}`;
    const commitsStr = String(commits).split(`\n`).filter(msg => msg.trim().length > 0).map(msg => ' - ' + msg).join(`\n`);
    return `${versionStr}\n ${commitsStr}`;
}

function getFlags() {
    return process.argv.filter(arg => arg.substr(0, 2) === '--').map(arg => arg.substr(2));
}

function getVersionBump() {
    const flags = getFlags();
    flags.filter(flag => (!!BUMP_TYPES[flag.toUpperCase()]));
    return flags[0] || BUMP_TYPES.PATCH;
}

function fail(message) {
    console.log(chalk.red('Cannot publish new version, ' + message));
}

function log(message) {
    console.log(chalk.green(message));
}

function run() {
    const currentVersion = getLatestVersion();
    log('Current version is: ' + currentVersion);
    const latestCommits = getCommitsUntilVersion(currentVersion);
    if (!latestCommits) {
        fail('no new commits');
        return;
    } else {
        log('Got latest commits from Git');
    }
    const bump = getVersionBump();
    if (!bump) {
        fail('illeagal bump argument specified');
        return;
    } else {
        log(`Bumping a ${bump} version`);
    }
    const newVersion = getBumpedVersion(currentVersion, bump);
    if (!newVersion) {
        fail('lerna version failed');
        return;
    } else {
        log(`New version is ${newVersion}`);
    }
    writeToChangelog(formatForChangelog(newVersion, latestCommits));
    log(`Wrote changes to ${CHANGELOG}`);

    editChangelogAndUpdateVersion(bump);

}

run();

