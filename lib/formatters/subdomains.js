const fmt = require('../formatter');
const _ = require('lodash');

module.exports = data => {
  if (_.isEmpty(data)) {
    fmt.printSectionWarning('Subdomains', 'No subdomains found.');
    return;
  }

  // Print section title
  fmt.printSectionTitle('Subdomains');

  // Print each subdomain address
  data.forEach((r, i) => {
    const addr = (r.address.length > 2 ? r.address.slice(0, 2) : r.address).join(', ');

    fmt.printSuccessLine(1, fmt.pad('HOSTNAME:', 12), r.hostname);
    fmt.printSuccessLine(1, fmt.pad('IP ADDR:', 12), addr);

    if (r.nameserver) {
      const nameserver = (r.nameserver.length > 2
        ? r.nameserver.slice(0, 2)
        : r.nameserver
      ).join(', ');
      fmt.printSuccessLine(1, fmt.pad('NAMESERVER:', 12), nameserver);
    }

    // Print divider
    if (i !== data.length - 1) fmt.printSuccessLine(1);
  });
};
