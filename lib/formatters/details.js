const util = require('util');
const fmt = require('../formatter');
const _ = require('lodash');
const log = console.log;

const formatLocation = ({ zip, city, country }) => {
  return util.format('%i, %s - %s', zip, city, country);
};

const formatGeo = ([lat, lng]) => {
  return util.format('[%f, %f]', lat, lng);
};

// Print section specific error
const printError = (title, err) => {
  fmt.printErrorMessage(title);
  fmt.printErrorLine(1);
  fmt.printErrorLine(1, fmt.pad('ERROR:', 12), err.code);
  fmt.printErrorLine(1, fmt.pad('SYSCALL:', 12), err.syscall);
  log('\n');
};

// Build the google map link from coordinates array
const getMapLink = coords => {
  return `https://www.google.com/maps/dir//${coords[0]},${coords[1]}`;
};

// Print the lookup section
const printLookup = data => {
  fmt.printSectionTitle('Lookup Data');
  fmt.printSuccessLine(1, fmt.pad('IP ADDR:', 12), data.address, data.family);
  fmt.printSuccessLine(1, fmt.pad('CITY:', 12), data.geo.city);
  fmt.printSuccessLine(1, fmt.pad('COUNTRY:', 12), data.geo.country);
  fmt.printSuccessLine(1, fmt.pad('ZIPCODE:', 12), data.geo.zip);
  fmt.printSuccessLine(1, fmt.pad('GEO:', 12), formatGeo(data.geo.ll));
  fmt.printSuccessLine(1, fmt.pad('MAP:', 12), getMapLink(data.geo.ll));
};

// Print the name servers section
const printNSRecords = data => {
  fmt.printSectionTitle('NS Records');

  // Print each ns hostname and data
  data.forEach((r, i) => {
    fmt.printSuccessBullet(1, '[+]', fmt.pad('HOSTNAME:', 10), r.hostname);

    // Print each possible address
    r.geo.forEach(h => {
      fmt.printSuccessLine(2, fmt.pad('IP ADDR:', 10), h.address);
      fmt.printSuccessLine(2, fmt.pad('GEO:', 10), formatGeo(h.geo.ll));
      fmt.printSuccessLine(
        2,
        fmt.pad('LOCATION:', 10),
        formatLocation({
          zip: h.geo.zip,
          city: h.geo.city,
          country: h.geo.country
        })
      );
      fmt.printSuccessLine(2, fmt.pad('MAP:', 10), getMapLink(h.geo.ll));
    });

    // Print spacer
    if (i !== data.length) {
      fmt.printSuccessLine();
    }
  });
};

const printSOARecords = data => {
  fmt.printSectionTitle('SOA Records');
  fmt.printSuccessLine(1, fmt.pad('NS NAME:', 12), data.nsname);
  fmt.printSuccessLine(1, fmt.pad('HOSTMASTER:', 12), data.hostmaster);
  fmt.printSuccessLine(1, fmt.pad('REFRESH:', 12), data.refresh);
  fmt.printSuccessLine(1, fmt.pad('EXPIRE:', 12), data.expire);
};

const printCNAMERecords = data => {
  fmt.printSectionTitle('CNAME Records');
  fmt.printSuccessLine(1, fmt.pad('VALUE:', 12), data.join(', '));
};

const printPTRRecords = data => {
  fmt.printSectionTitle('PTR Records');
  fmt.printSuccessLine(1, fmt.pad('VALUE:', 12), data.join(', '));
};

const printMXRecords = data => {
  fmt.printSectionTitle('MX Records');

  // Print each mail server exchange
  data.forEach((mx, i) => {
    // Print exchange name
    fmt.printSuccessBullet(1, `[${++i}]`, 'EXCHANGE:', mx.exchange);
    fmt.printSuccessLine(2, 'PRIORITY', mx.priority);
    fmt.printSuccessLine(2);

    // Print each possible address
    mx.geo.forEach((h, j) => {
      fmt.printSuccessBullet(2, `[${++j}]`, fmt.pad('IP ADDR:', 12), h.address);
      fmt.printSuccessLine(3, fmt.pad('GEO:', 12), formatGeo(h.geo.ll));
      fmt.printSuccessLine(
        3,
        fmt.pad('LOCATION:', 12),
        formatLocation({
          zip: h.geo.zip,
          city: h.geo.city,
          country: h.geo.country
        })
      );

      // Print spacer
      if (j !== mx.geo.length) {
        fmt.printSuccessLine(2);
      }
    });

    // Print spacer
    if (i !== data.length) {
      fmt.printSuccessLine(1);
    }
  });
};

module.exports = data => {
  _.forEach(data, (propValue, property) => {
    let hasError = propValue.error;
    let value = hasError ? propValue.error : propValue.value;

    // Handle different properties output
    switch (property) {
      // Print the hostname lookup records
      case 'lookup':
        if (hasError) {
          printError('Lookup Data', value);
          return;
        }
        printLookup(value);
        break;

      // Print name server records
      case 'nsRecords':
        if (hasError) {
          printError('NS Records', value);
          return;
        }
        printNSRecords(value);
        break;

      // Print state of authority records
      case 'soaRecords':
        if (hasError) {
          printError('SOA Records', value);
          return;
        }
        printSOARecords(value);
        break;

      // Print the common name records
      case 'cNameRecords':
        if (hasError) {
          printError('CNAME Records', value);
          return;
        }
        printCNAMERecords(value);
        break;

      // Print the pointer records
      case 'ptrRecords':
        if (hasError) {
          printError('PTR Records', value);
          return;
        }
        printPTRRecords(value);
        break;

      // Print email exchange records
      case 'mxRecords':
        if (hasError) {
          printError('MX Records', value);
          return;
        }
        printMXRecords(value);
        break;

      default:
    }

    // Print divider between each section
    log('\n');
  });
};
