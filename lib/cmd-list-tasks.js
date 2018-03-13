#!/usr/bin/env node

'use strict';

const fmt = require('./formatter');
const domainScanner = require('domain-scanner');
const commander = require('commander');
const chalk = require('chalk');

// Parse command arguments
commander.name('list-tasks').parse(process.argv);

// List tasks action
const tasks = domainScanner.getTasks();
fmt.printInfoMessage(`There are ${chalk.cyanBright(tasks.length)} tasks available:`);
fmt.printInfoLine(1);

// Print each task
tasks.forEach((t, i) => {
  fmt.printInfoBullet(1, '[+]', chalk.cyan(t.title), chalk.white.bold(`(${t.name})`));
  fmt.printInfoLine(2, t.description);

  // Print divider
  if (i === tasks.length - 1) {
    console.log('');
  } else {
    fmt.printInfoLine(1);
  }
});

// Print command suggestion
fmt.printInfoMessage('You can select which task to run with the -s option.');
fmt.printInfoLine(1);
fmt.printInfoLine(
  1,
  'Example:',
  chalk.white.bold('domain-scanner scan -s details example.com')
);
fmt.printInfoLine(
  1,
  'Example:',
  chalk.white.bold('domain-scanner scan -s breaches,threats example.com'),
  '\n'
);
