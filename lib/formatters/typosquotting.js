'use strict';

const _ = require('lodash');
const fmt = require('../formatter');

module.exports = data => {
  if (_.isEmpty(data)) {
    fmt.printSectionWarning('Typosquotting', 'No domains found.');
    return;
  }

  // Print section title
  fmt.printSectionTitle('Typosquotting');

  // Print each threat match
  const objectKeys = Object.keys(data);
  _.forEach(objectKeys, (technique, idx) => {
    let results = data[technique];

    // Output an empty results statement
    if (_.isEmpty(results)) {
      fmt.printSuccessBullet(1, '[-]', fmt.pad('TECHNIQUE:'), technique);
      fmt.printSuccessLine(2);
      fmt.printSuccessLine(2, 'No results found.');

      // Print sections divider
      if (idx !== objectKeys.length - 1) {
        fmt.printSuccessLine(1);
      }
      return;
    }

    // Print typosquotting technique name
    fmt.printSuccessBullet(1, '[+]', fmt.pad('TECHNIQUE:', 12), technique.toUpperCase());
    fmt.printSuccessLine(2);

    const originalLength = results.length;
    if (originalLength >= 15) {
      results = _.take(results, 14);
    }

    // Print technique results
    results.forEach((result, index) => {
      if (typeof result === 'string') {
        fmt.printSuccessLine(2, fmt.pad('HOSTNAME:', 12), result);
      } else {
        fmt.printSuccessLine(2, fmt.pad('HOSTNAME:', 12), result.hostname);

        // Optionally print the ip address
        if (result.address) {
          fmt.printSuccessLine(
            2,
            fmt.pad('IP ADDR:', 12),
            _.take(result.address, 2).join(', ')
          );
        }

        // Optionally print hostname nameservers
        if (result.nameserver) {
          fmt.printSuccessLine(
            2,
            fmt.pad('NAMESERVER:', 12),
            _.take(result.nameserver, 2).join(', ')
          );
        }
      }

      // Print line divider
      if (index !== results.length - 1) {
        fmt.printSuccessLine(2);
      } else if (results.length < originalLength) {
        fmt.printSuccessLine(2);
        fmt.printSuccessLine(2, `${originalLength - results.length} more results..`);
      }
    });

    // Print sections divider
    if (idx !== objectKeys.length - 1) {
      fmt.printSuccessLine(1);
    }
  });
};
