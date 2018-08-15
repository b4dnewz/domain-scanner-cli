#!/usr/bin/env node

'use strict';

const pkg = require('../package.json');
const { name, description } = require('domain-scanner/package.json');
const banner = require('./banner');
const commander = require('commander');

// Print program banner
console.log(banner);

// Setup program informations
commander
  .version(pkg.version)
  .name(name)
  .description(description);

// Scan action
commander.command('scan <domain>', 'Perform a scan for the given domain name.');

// List tasks action
commander.command('list-tasks [pattern]', 'List all the domain-scanner available task.');

// Print a custom help section for usage examples
commander.on('--help', function() {
  console.log(`
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
