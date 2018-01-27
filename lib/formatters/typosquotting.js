const fmt = require('../formatter');
const _ = require('lodash');

module.exports = data => {
  if (_.isEmpty(data)) {
    fmt.printSectionWarning('Typosquotting', 'No domains found.');
    return;
  }

  // Print section title
  fmt.printSectionTitle('Typosquotting');

  // Print each threat match
  let objectKeys = Object.keys(data);
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

    // Print technique results
    results.forEach((result, index) => {
      fmt.printSuccessLine(2, fmt.pad('HOSTNAME:', 12), result.hostname);
      fmt.printSuccessLine(2, fmt.pad('IP ADDR:', 12), result.ip.slice(0, 2).join(', '));

      // Optionally print hostname nameservers
      if (result.nameserver) {
        fmt.printSuccessLine(
          2,
          fmt.pad('NAMESERVER:', 12),
          result.nameserver.slice(0, 2).join(', ')
        );
      }

      // Print line divider
      if (index !== results.length - 1) {
        fmt.printSuccessLine(2);
      }
    });

    // Print sections divider
    if (idx !== objectKeys.length - 1) {
      fmt.printSuccessLine(1);
    }
  });
};
