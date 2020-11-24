/* eslint-disable no-console */
const {
    spawn,
    execSync
} = require('child_process');
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
const PROJECTS = {
    MAIN: 'main',
    GALLERY: 'gallery',
    GALLERY_LIB: 'gallery-lib',
    LAYOUTS: 'layouts',
    FULLSCREEN: 'fullscreen',
    PLAYGROUND: 'playground',
};
const CHANGELOG = 'changelog.md';
const VERSION_LOGGER = 'packages/gallery/src/versionLogger.js';

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

function editChangelogAndUpdateVersion(bump) {
    var editor = 'code';
    try {
        var child = spawn(editor, [CHANGELOG], {
            stdio: 'inherit'
        });
    } catch (e) {
        console.error('Cannot open code editor with "code" command', e);
    }

    prompt.start();
    var property = {
        name: 'yesno',
        message: 'Do you want to release a new version? (yN)',
        validator: /y[es]*|n[o]?/,
        warning: 'Must respond yes or no',
        default: 'no'
    };
    prompt.get(property, function (err, result) {
        console.log(result);

        try {
            if (result.yesno === 'yes' || result.yesno === 'y') {
                // child.on('exit', function (e, code) {
                execSync(`rm **/package-lock.json || true`, { // do not fail if file does not exist
                    stdio: 'pipe'
                });
                execSync(`git commit -am "[main] update ${CHANGELOG}"`, {
                    stdio: 'pipe'
                });
                log(`Saved ${CHANGELOG}, releasing new version`);
                const bumpCommand = `lerna version ${bump} --exact --yes`;
                execSync(`${bumpCommand}`, {
                    stdio: 'pipe'
                });
                // });
            } else {
                fail('not releasing by user request');
                process.exit(0);
            }
        } catch (e) {
            console.error('Cannot release version', e);
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
            versionArr[2] = 0;
            break;
        case BUMP_TYPES.MAJOR:
            versionArr[0]++;
            versionArr[1] = 0;
            versionArr[2] = 0;
            break;
    }
    return versionArr.join('.');
}

function writeToChangelog(str) {
    const writeCommand = `echo "${str.replace(/\"/g, '')}" | cat - ${CHANGELOG} > temp && mv temp ${CHANGELOG}`
    execSync(writeCommand);
}

function writeVersion(version) {
    const writeCommand = `> ${VERSION_LOGGER} && echo "try {console.debug('Pro Gallery Version: ${version}');\\n// eslint-disable-next-line no-empty\\n} catch (e) {}" >> ${VERSION_LOGGER}`;
    execSync(writeCommand);
}

function getDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = dd + '/' + mm + '/' + yyyy;
    return today;
}

function formatForChangelog(version, commits) {

    const versionStr = `## [v${version}](https://pro-gallery-${version.replace(/\./g, '-')}.surge.sh) (${getDate()})`;
    commits = String(commits).split(`\n`).filter(msg => msg.trim().length > 0);
    const commitsByProject = commits.reduce((obj, commit) => {
        const matchedProject = (commit.match(/\[.*\]/) || [''])[0].toLowerCase().replace(']', '').replace('[', '');
        const project = PROJECTS[matchedProject.toUpperCase()] || 'other';
        if (!obj[project]) {
            obj[project] = '';
        }
        const textStartPos = commit.indexOf(']') + 1;
        obj[project] += ' - ' + commit.substr(textStartPos) + `\n`;
        return obj;
    }, {});
    let commitsStr = Object.entries(commitsByProject).map(([project, itsCommits]) => `\n#### ${project.toUpperCase()}\n${itsCommits}`).join(``);

    // let commitsStr = String(commits).split(`\n`).filter(msg => msg.trim().length > 0).map(msg => ' - ' + msg).join(`\n`);
    return `${versionStr}\n ${commitsStr}\n---`;
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
    console.log(chalk.red('Not publishing new version, ' + message));
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
    writeVersion(newVersion);

    log(`Wrote changes to ${CHANGELOG}`);

    editChangelogAndUpdateVersion(bump);

}

run();
