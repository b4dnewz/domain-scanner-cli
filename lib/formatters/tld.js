const fmt = require('../formatter');
const _ = require('lodash');

module.exports = data => {
  if (_.isEmpty(data)) {
    fmt.printSectionWarning('TLD Root Domains', 'No top level domains found.');
    return;
  }

  // Filter only successfull records
  let foundRecords = data.filter(r => r.record);
  let maxHostnameLength = _.maxBy(foundRecords, o => o.tld.length).hostname.length;

  // Print section title
  fmt.printSectionTitle('TLD Root Domains');
  fmt.printSuccessLine(1, 'Found', foundRecords.length, 'domains:');
  fmt.printSuccessLine();

  // Print each hostname record
  foundRecords.forEach(r => {
    fmt.printSuccessLine(
      1,
      fmt.pad(r.hostname, maxHostnameLength + 1),
      r.record.join(' - ')
    );
  });
};
