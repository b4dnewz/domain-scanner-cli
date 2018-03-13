#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const domainScanner = require('domain-scanner');
const commander = require('commander');
const chalk = require('chalk');
const _ = require('lodash');
const ora = require('ora');
const log = console.log;
const fmt = require('./formatter');

// Create the output path based on user options and scan target
const resolveOutputPath = (output, target) => {
  const filename = `${target}_${Date.now()}.json`;
  if (_.isUndefined(output) || _.isEmpty(output)) {
    return filename;
  }
  return _.endsWith(output, '.json') ? output : path.join(output, filename);
};

// Get output formatters
const formattersPath = path.join(__dirname, 'formatters');
const formatters = fs.readdirSync(formattersPath).reduce((obj, f) => {
  obj[path.basename(f, '.js')] = require(`${formattersPath}/${f}`);
  return obj;
}, {});

commander.name('scan');

// Parse process arguments
commander
  .option('-o, --output [path]', 'Where to save the output files')
  .option('-d, --deep', 'Perform additional tasks on results')
  .option(
    '-t, --timeout [milliseconds]',
    'Milliseconds to wait before stopping scans',
    v => parseInt(v, 10),
    null
  )
  .option(
    '-e, --exclude [list]',
    'Comma separated list of tasks to exclude from the scan.',
    v => v.split(','),
    []
  )
  .option(
    '-s, --sections [list]',
    'Comma separated list of tasks to run during the scan.',
    v => v.split(','),
    []
  )
  .parse(process.argv);

// Get the input domain name
const domain = commander.args.pop();
if (!domain || domain === '') {
  throw new Error('The domain argument is required!');
}

// Some logging to be verbose
fmt.printInfoMessage(`Starting scan for domain: ${chalk.cyan(domain)}`);
fmt.printInfoMessage('This operation may take a long time, so relax..\n');

// Init the spinner that will be shown during tasks execution
const spinner = ora({
  text: 'Started the scan..',
  hideCursor: true
}).start();

// Build scanner options from command options
const options = {
  exclude: commander.exclude,
  sections: commander.sections,
  timeout: commander.timeout,
  deep: commander.deep,
  output: commander.output,
  keys: {
    hunterio: process.env.HUNTERIO_KEY,
    google: process.env.GOOGLE_KEY,
    virustotal: process.env.VIRUSTOTAL_KEY
  }
};

// Run the scanner
const execution = domainScanner(domain, options, (err, response) => {
  if (err) {
    spinner.fail('The scan has ended with error');
    fmt.printErrorMessage(err);
    return;
  }

  spinner.succeed('The scan has ended successfully.');

  // Optionally save the scan output to file in JSON format
  // if the operation fails show the error to the user
  if (commander.output) {
    spinner.start('Saving output to file..');

    // Build the output path
    const output = resolveOutputPath(commander.output, domain);

    try {
      fs.writeFileSync(output, JSON.stringify(response, null, 2));
      spinner.succeed(`Result output saved to: ${chalk.inverse(output)}.\n`);
    } catch (e) {
      spinner.fail('An error occurred while trying to save output.');
      fmt.printErrorMessage(e, '\n');
    }
  }

  // Print formatted output using available section formatters
  _.forEach(response.data, (sectionData, sectionName) => {
    if (!Object.prototype.hasOwnProperty.call(formatters, sectionName)) {
      fmt.printSectionWarning(
        `WARNING: ${sectionName}`,
        'The formatter for this section does not exist yet.',
        'If you want to contribute and creating it, open a PR.'
      );
      log('\n');
      return;
    }

    // Get the section formatter and run it
    formatters[sectionName](sectionData);
    log('\n');
  });
});

execution.on('section-start', data => {
  spinner.text = `[${data.current}/${data.total}] Running task ${data.name}..\n`;
});

execution.on('section-end', data => {
  spinner.text = `Ended task ${data.name}`;
});
