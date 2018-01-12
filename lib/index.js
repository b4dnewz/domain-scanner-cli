#!/usr/bin/env node

'use strict';

const pkg = require('../package.json');
const fs = require('fs');
const domainScanner = require('domain-scanner');
const commander = require('commander');

console.log(`
     ##                       ##
     ##
   ####  ###  # ## ##   ###   ## # ##     ###   ###  ###   # ##  # ##   ###  # ##
  ## ## ## ## ## ## ## #  ##  ## ## ##   ## ## ## # #  ##  ## ## ## ## ## ## ###
  #  ## ## ## ## ## ##  ####  ## ## ##    ###  ##    ####  ## ## ## ## ##### ##
  #  ## ## ## ## ## ## ## ##  ## ## ##      ## ##   ## ##  ## ## ## ## ##    ##
  ## ## ## ## ## ## ## ## ##  ## ## ##   ## ## ## # ## ##  ## ## ## ## ## ## ##
   ####  ###  ## ## ##  ## ## ## ## ##    ###   ###  ## ## ## ## ## ##  ###  ##

    v${pkg.version} by ${pkg.author.name} <${pkg.author.email}>
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
    console.time('Domain scanner');
    // Run the domain scanner
    domainScanner(
      domain,
      {
        sections: options.sections,
        timeout: options.timeout,
        output: options.output
      },
      (err, response) => {
        if (err) {
          console.log(err);
          return;
        }

        // Output execution time
        console.timeEnd('Domain scanner');

        // If output option is a string or true
        if (options.output) {
          console.log('Saving output to file.');

          // Get the output file name
          options.output =
            typeof options.output === 'string' ? options.output : './output';

          try {
            fs.writeFileSync(options.output, JSON.stringify(response, null, 2));
            console.log('The results was successfully saved to:', options.output);
          } catch (e) {
            console.log(e);
          }
        }

        // Print response
        console.log('Response:', JSON.stringify(response, null, 2));
      }
    );
  });

// List tasks action
commander
  .command('list-tasks')
  .description('List all the domain-scanner available task.')
  .action(() => {
    let tasks = domainScanner.getTasks();
    console.log(`Right now there are ${tasks.length} tasks available: \n`);
    tasks.forEach(t => {
      console.log(`- ${t}`);
    });
    console.log('\nYou can select which task to run with the -s option.');
  });

// Print a custom help section for usage examples
commander.on('--help', function() {
  console.log(`

  Examples:

    domain-scanner --help                         Print this usage informations
    domain-scanner scan --help                    Print the action specific informations

    domain-scanner list-tasks                     List all the available tasks/sections

    domain-scanner scan example.com               Perform the default scan (all sections)
    domain-scanner scan -s emails example.com     Perform the email section scan only

  `);
});

// Parse process arguments
commander.parse(process.argv);
