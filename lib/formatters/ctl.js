const fmt = require('../formatter');
const _ = require('lodash');

const printObject = data => {
  const addr = (data.address.length > 2 ? data.address.slice(0, 2) : data.address).join(
    ', '
  );

  fmt.printSuccessLine(1, fmt.pad('HOSTNAME:', 12), data.hostname);
  fmt.printSuccessLine(1, fmt.pad('IP ADDR:', 12), addr);

  if (data.nameserver) {
    const nameserver = (data.nameserver.length > 2
      ? data.nameserver.slice(0, 2)
      : data.nameserver
    ).join(', ');
    fmt.printSuccessLine(1, fmt.pad('NAMESERVER:', 12), nameserver);
  }
};

module.exports = data => {
  if (_.isEmpty(data)) {
    fmt.printSectionWarning('Certificate Transparency', 'No subdomains found.');
    return;
  }

  // Print section title
  fmt.printSectionTitle('Certificate Transparency');

  // Print each subdomain address
  data.forEach((r, i) => {
    if (typeof r === 'string') {
      fmt.printSuccessLine(1, fmt.pad('HOSTNAME:', 12), r);
    } else {
      printObject(r);
    }

    // Print divider
    if (i !== data.length - 1) fmt.printSuccessLine(1);
  });
};
