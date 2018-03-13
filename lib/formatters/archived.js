'use strict';

const _ = require('lodash');
const fmt = require('../formatter');

// The format of the timestamp is 1-14 digit string (e.g. 20060101) of the format (YYYYMMDDhhmmss)
const parseTimestamp = value => {
  value = value.toString();
  const year = value.slice(0, 4);
  const month = value.slice(4, 6);
  const day = value.slice(6, 8);
  const hour = value.slice(8, 10);
  const minute = value.slice(10, 12);
  return `${year}-${month}-${day} ${hour}:${minute}`;
};

module.exports = data => {
  if (_.isEmpty(data)) {
    fmt.printSectionWarning('Wayback Archive', 'No results found.');
    return;
  }

  // Print section title
  fmt.printSectionTitle('Wayback Archive');
  fmt.printSuccessBullet(1, '[+]', fmt.pad('ADDRESS:'), data.closest.url);
  fmt.printSuccessLine(2, fmt.pad('AVAILABLE:'), data.closest.available);
  fmt.printSuccessLine(2, fmt.pad('STATUS:'), data.closest.status);
  fmt.printSuccessLine(2, fmt.pad('TIMESTAMP:'), parseTimestamp(data.closest.timestamp));
};
