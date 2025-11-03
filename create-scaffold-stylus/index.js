#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');

const runCommand = (command) => {
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (e) {
        console.error(`Failed to execute ${command}`, e);
        return false;
    }
    return true;
};

const repoName = process.argv[2] || 'scaffold-stylus-app';
const gitCheckoutCommand = `git clone --depth 1 https://github.com/MihRazvan/Scaffold-Stylus ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;

console.log(chalk.blue(`Creating a new Scaffold-Stylus app in ${repoName}...`));

const checkedOut = runCommand(gitCheckoutCommand);
if (!checkedOut) process.exit(-1);

console.log(chalk.green("Installing dependencies..."));
const installedDeps = runCommand(installDepsCommand);
if (!installedDeps) process.exit(-1);

console.log(chalk.green("\nDone! 🎉 Your Scaffold-Stylus app is ready."));
console.log("\nTo get started:");
console.log(chalk.cyan(`\n  cd ${repoName}`));
console.log(chalk.cyan("  npm run dev"));