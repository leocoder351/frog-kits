const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const util = require('util');
const semver = require('semver');
const exec = util.promisify(child_process.exec);
const semverInc = semver.inc;
const pkg = require('../package.json');

const currentVersion = pkg.version;

const run = async command => {
  console.log(chalk.green(command));
  await exec(command);
};

const logTime = (logInfo, type) => {
  const info = `=> ${type}：${logInfo}`;
  console.log((chalk.blue(`[${new Date().toLocaleString()}] ${info}`)));
};

const getNextVersions = () => ({
  major: semverInc(currentVersion, 'major'),
  minor: semverInc(currentVersion, 'minor'),
  patch: semverInc(currentVersion, 'patch'),
  premajor: semverInc(currentVersion, 'premajor'),
  preminor: semverInc(currentVersion, 'preminor'),
  prepatch: semverInc(currentVersion, 'prepatch'),
  prerelease: semverInc(currentVersion, 'prerelease'),
});

const promptNextVersion = async () => {
  const nextVersions = getNextVersions();
  const { nextVersion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'nextVersion',
      message: `Please select the next version (current version is ${currentVersion})`,
      choices: Object.keys(nextVersions).map(name => ({
        name: `${name} => ${nextVersions[name]}`,
        value: nextVersions[name]
      }))
    }
  ]);
  return nextVersion;
};

const updatePkgVersion = async nextVersion => {
  pkg.version = nextVersion;
  logTime('Update package.json version', 'start');
  await fs.writeFileSync(path.resolve(__dirname, '../package.json'), JSON.stringify(pkg));
  await run('npx prettier package.json --write');
  logTime('Update package.json version', 'end');
};

const test = async () => {
  logTime('Test', 'start');
  await run(`yarn test:coverage`);
  logTime('Test', 'end');
};

const genChangelog = async () => {
  logTime('Generate CHANGELOG.md', 'start');
  await run(' npx conventional-changelog -p angular -i CHANGELOG.md -s -r 0');
  logTime('Generate CHANGELOG.md', 'end');
};

const push = async nextVersion => {
  logTime('Push Git', 'start');
  await run('git add .');
  await run(`git commit -m "publish frog-ui@${nextVersion}" -n`);
  await run('git push');
  logTime('Push Git', 'end');
};

const tag = async nextVersion => {
  logTime('Push Git', 'start');
  await run(`git tag v${nextVersion}`);
  await run(`git push origin tag frog-ui@${nextVersion}`);
  logTime('Push Git Tag', 'end');
};

const build = async () => {
  logTime('Components Build', 'start');
  await run(`yarn build`);
  logTime('Components Build', 'end');
};

const publish = async () => {
  logTime('Publish Npm', 'start');
  await run('npm publish');
  logTime('Publish Npm', 'end');
};

const main = async () => {
  try {
    const nextVersion = await promptNextVersion();
    const startTime = Date.now();

    await test();
    await updatePkgVersion(nextVersion);
    await genChangelog();
    await push(nextVersion);
    await build();
    await publish();
    await tag(nextVersion);

    console.log(chalk.green(`Publish Success, Cost ${((Date.now() - startTime) / 1000).toFixed(3)}s`));
  } catch (err) {
    console.log(chalk.red(`Publish Fail: ${err}`));
  }
}

main();
