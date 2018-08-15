const fmt = require('../formatter');
const _ = require('lodash');

module.exports = data => {
  if (_.isEmpty(data)) {
    fmt.printSectionWarning('Threats', 'No threats found.');
    return;
  }

  // Print section title
  fmt.printSectionTitle('Threats');

  // Print each threat match
  data.matches.forEach((match, i) => {
    fmt.printSuccessBullet(1, `[${++i}]`, fmt.pad('THREAT TYPE:', 18), match.threatType);
    fmt.printSuccessLine(2, fmt.pad('PLATFORM:', 18), match.platformType);
    fmt.printSuccessLine(2, fmt.pad('THREAT TYPE:', 18), match.threatEntryType);
    fmt.printSuccessLine(2, fmt.pad('CACHE DURATION:', 18), match.cacheDuration);
    if (i !== data.matches.length) {
      fmt.printSuccessLine();
    }
  });
};
