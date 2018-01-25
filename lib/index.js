#!/usr/bin/env node

'use strict';

const pkg = require('../package.json');
const fmt = require('./formatter');
const domainScanner = require('domain-scanner');

// Core modules
const fs = require('fs');
const path = require('path');
const commander = require('commander');
const chalk = require('chalk');
const _ = require('lodash');
const log = console.log;

// Get output formatters
const formattersPath = path.join(__dirname, 'formatters');
const formatters = fs.readdirSync(formattersPath).reduce((obj, f) => {
  obj[path.basename(f, '.js')] = require(`${formattersPath}/${f}`);
  return obj;
}, {});

// Print program banner
log(`
     ##                       ##
     ##
   ####  ###  # ## ##   ###   ## # ##     ###   ###  ###   # ##  # ##   ###  # ##
  ## ## ## ## ## ## ## #  ##  ## ## ##   ## ## ## # #  ##  ## ## ## ## ## ## ###
  #  ## ## ## ## ## ##  ####  ## ## ##    ###  ##    ####  ## ## ## ## ##### ##
  #  ## ## ## ## ## ## ## ##  ## ## ##      ## ##   ## ##  ## ## ## ## ##    ##
  ## ## ## ## ## ## ## ## ##  ## ## ##   ## ## ## # ## ##  ## ## ## ## ## ## ##
   ####  ###  ## ## ##  ## ## ## ## ##    ###   ###  ## ## ## ## ## ##  ###  ##

     v${pkg.version} by ${chalk.red(pkg.author.name)} <${pkg.author.email}>
`);

// Setup program informations
commander
  .version(pkg.version)
  .name('domain-scanner')
  .description('A node utility to scan a domain with various techniques.');

// Scan action
commander
  .command('scan <domain>')
  .description('Perform a scan for the given domain name.')
  .option('-o, --output [path]', 'Where to save the output files')
  .option('-d, --deep', 'Perform additional tasks on results')
  .option(
    '-t, --timeout [milliseconds]',
    'Milliseconds to wait before stopping scans',
    v => parseInt(v, 10), // Parse input as decimal number
    null // Default is null so it will use internal default value
  )
  .option(
    '-s, --sections [list]',
    'Comma separated list of tasks to run during the scan.',
    v => v.split(',').map(v => v.trim()), // Split the comma separated list
    [] // Empty array as default since it will use all the available tasks
  )
  .action((domain, options) => {
    console.log('Started scan for domain:', domain);
    console.time('Execution time:');

    // Run the domain scanner
    domainScanner(
      domain,
      {
        sections: options.sections,
        timeout: options.timeout,
        deep: options.deep,
        output: options.output,
        keys: {
          hunterio: process.env.HUNTERIO_KEY,
          google: process.env.GOOGLE_KEY,
          virustotal: process.env.VIRUSTOTAL_KEY
        }
      },
      (err, response) => {
        if (err) {
          log(err);
          return;
        }

        // If output option is a string or true
        if (options.output) {
          fmt.printInfoMessage('Saving output to file..');

          options.output =
            typeof options.output === 'string'
              ? options.output
              : `./${domain}_${Date.now()}.json`;

          try {
            fs.writeFileSync(options.output, JSON.stringify(response, null, 2));
            fmt.printInfoMessage(
              `Successfully saved to: ${chalk.inverse(options.output)}`
            );
          } catch (e) {
            fmt.printErrorMessage('An error occurred while trying to save output.');
          }
        }

        // Print formatted response
        fmt.printInfoMessage('The scanner ended with successfull response.\n');
        _.forEach(response.data, (sectionData, sectionName) => {
          if (!Object.prototype.hasOwnProperty.call(formatters, sectionName)) {
            fmt.printWarningMessage(
              `The formatter for ${sectionName} does not exist yet.\n`
            );
            return;
          }

          // Get the section formatter and run it
          formatters[sectionName](sectionData);
          log('\n');
        });

        console.timeEnd('Script execution time');
      }
    );
  });

// List tasks action
commander
  .command('list-tasks')
  .description('List all the domain-scanner available task.')
  .action(() => {
    let tasks = domainScanner.getTasks();
    fmt.printInfoMessage(`There are ${tasks.length} tasks available:`);
    fmt.printInfoLine(1);

    // Print each task
    tasks.forEach(t => {
      fmt.printInfoLine(1, t);
    });
    log('\n');

    fmt.printInfoMessage('You can select which task to run with the -s option.');
    fmt.printInfoLine(
      1,
      'Example:',
      chalk.inverse('domain-scanner -s details example.com')
    );
    log('\n');
  });

// Print a custom help section for usage examples
commander.on('--help', function() {
  log(`

  Examples:

    domain-scanner --help                         Print this usage informations
    domain-scanner scan --help                    Print the action specific informations

    domain-scanner list-tasks                     List all the available tasks/sections

    domain-scanner scan example.com               Scan a domain with all tasks
    domain-scanner scan -s emails example.com     Scan a domain for emails task only

  `);
});

// Parse process arguments
commander.parse(process.argv);
