'use strict';

const _ = require('lodash');
const chalk = require('chalk');
const fmt = require('../formatter');

module.exports = data => {
  if (_.isEmpty(data)) {
    fmt.printSectionWarning('TLD Root Domains', 'No top level domains found.');
    return;
  }

  // Print section title
  fmt.printSectionTitle('TLD Root Domains');
  fmt.printSuccessLine(1, 'Found', chalk.greenBright(data.length), 'domains.');
  fmt.printSuccessLine();

  // Optionally trim results to avoid extra long output
  const originalLength = data.length;
  if (originalLength >= 15) {
    data = _.take(data, 14);
  }

  // Print each hostname record
  data.forEach((r, i) => {
    fmt.printSuccessLine(1, fmt.pad('HOSTNAME:', 12), r.hostname);

    // Optionally print result ip address
    if (r.address) {
      fmt.printSuccessLine(1, fmt.pad('IP ADDR:', 12), _.take(r.address, 4).join(', '));
    }

    // Optionally print nameserver value
    if (r.nameserver) {
      fmt.printSuccessLine(
        1,
        fmt.pad('NAMESERVER:', 12),
        _.take(r.nameserver, 4).join(', ')
      );
    }

    // Print line divider
    if (i !== data.length - 1) {
      fmt.printSuccessLine(1);
    } else if (data.length < originalLength) {
      fmt.printSuccessLine(1);
      fmt.printSuccessLine(1, `${originalLength - data.length} more results..`);
    }
  });
};
