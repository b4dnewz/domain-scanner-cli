const fmt = require('../formatter');
const _ = require('lodash');

module.exports = data => {
  if (_.isEmpty(data)) {
    fmt.printSectionWarning('Emails', 'No emails found.');
    return;
  }

  // Print section title
  fmt.printSectionTitle('Emails');
  fmt.printSuccessLine(1, fmt.pad('DOMAIN:', 16), data.domain);
  fmt.printSuccessLine(1, fmt.pad('ORGANIZATION:', 16), data.organization);
  fmt.printSuccessLine(1, fmt.pad('PATTERN:', 16), data.pattern);
  fmt.printSuccessLine(1);

  // Print emails count
  fmt.printSuccessBullet(1, `[${data.emails.length}]`, 'EMAILS FOUND:');
  fmt.printSuccessLine(2);

  // Print each found email
  data.emails.forEach((email, i) => {
    fmt.printSuccessBullet(2, `[${++i}]`, fmt.pad('ADDRESS:', 14), email.value);
    fmt.printSuccessLine(3, fmt.pad('TYPE:', 14), email.type);
    fmt.printSuccessLine(3, fmt.pad('CONFIDENCE:', 14), `${email.confidence}%`);
    fmt.printSuccessLine(3, fmt.pad('FULLNAME:', 14), email.first_name, email.last_name);
    fmt.printSuccessLine(3, fmt.pad('SOURCES:', 14), email.sources.length);
    fmt.printSuccessLine(3, fmt.pad('PHONE NUMBER:', 14), email.phone_number);

    // Print divider
    if (i !== data.length) {
      fmt.printSuccessLine(2);
    }
  });
};
