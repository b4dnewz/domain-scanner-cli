/* eslint-disable */
'use strict';

const { version: cli, author } = require('../package.json');
const { version: core } = require('domain-scanner/package.json');
const chalk = require('chalk');

const coreVers = chalk.yellowBright(`v${core}`);
const cliVers = chalk.yellow(`v${cli}`);

module.exports = chalk.bold.white(`
  8888b.   dP"Yb  8b    d8    db    88 88b 88     .dP"Y8  dP""b8    db    88b 88 88b 88 888888 88""Yb
   8I  Yb dP   Yb 88b  d88   dPYb   88 88Yb88      Ybo." dP    "   dPYb   88Yb88 88Yb88 88__   88__dP
   8I  dY Yb   dP 88YbdP88  dP__Yb  88 88 Y88     o. Y8b Yb       dP__Yb  88 Y88 88 Y88 88""   88"Yb
  8888Y"   YbodP  88 YY 88 dP""""Yb 88 88  Y8     8bodP'  YboodP dP""""Yb 88  Y8 88  Y8 888888 88  Yb

  A comprehensive tool for collecting information regarding organizations and web servers

  Module ${coreVers}  Cli ${cliVers}  by ${chalk.red(author.name)} <${author.email}>
`);
