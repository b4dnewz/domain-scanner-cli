const fmt = require('../formatter');
const _ = require('lodash');

module.exports = data => {
  if (_.isEmpty(data)) {
    fmt.printSectionWarning('Robots.txt', 'No robots.txt file was found.');
    return;
  }

  // Print section title
  fmt.printSectionTitle('Robots.txt');

  // Print all properties
  let objectKeys = Object.keys(data);
  _.forEach(objectKeys, (property, index) => {
    let value = data[property];
    let count = value.length || Object.keys(value).length;

    // Print property name
    fmt.printSuccessBullet(1, '[+]', property.toUpperCase());
    fmt.printSuccessLine(2);

    // Print a message to inform for empty section
    if (_.isEmpty(value)) {
      fmt.printSuccessLine(2, 'Nothing found.');

      // Print section divider
      if (index !== objectKeys.length - 1) {
        fmt.printSuccessLine(1);
      }
      return;
    }

    // Print property values count
    fmt.printSuccessLine(2, 'Found', count, property, 'rules');
    fmt.printSuccessLine(2);

    // Switch property outputs
    switch (property) {
      case 'agents':
        _.forEach(value, (value, agent) => {
          fmt.printSuccessLine(2, fmt.pad('AGENT:', 10), agent);
          _.forEach(value, (data, rule) => {
            fmt.printSuccessLine(2, fmt.pad(rule.toUpperCase() + ':', 10), data.length);
          });
          fmt.printSuccessLine(2);
        });
        break;
      case 'sitemaps':
        _.forEach(value, value => {
          fmt.printSuccessLine(2, value);
        });
        break;
      default:
        _.forEach(value, value => {
          fmt.printSuccessLine(2, value);
        });
        break;
    }

    // Print section divider
    if (index !== objectKeys.length - 1) {
      fmt.printSuccessLine(1);
    }
  });
};
