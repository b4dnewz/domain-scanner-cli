const fmt = require('../formatter');
const _ = require('lodash');

module.exports = data => {
  if (_.isEmpty(data)) {
    fmt.printSectionWarning('Tags', 'No tags were discovered.');
    return;
  }

  // Print section title
  fmt.printSectionTitle('Tags');

  // Print all properties
  let objectKeys = Object.keys(data);
  _.forEach(objectKeys, (property, index) => {
    let value = data[property];
    let count = value.length || Object.keys(value).length;

    // Print property name
    fmt.printSuccessBullet(1, '[+]', property.toUpperCase());
    fmt.printSuccessLine(2);

/*

_.forEach(results.direct, (codes, type) => {
	if (!_.isEmpty(codes)) {
		console.log(type);
      _.forEach(codes, code => {
        console.log(code);
      });
    }
});

*/

    // Switch property outputs
    switch (property) {
      case 'direct':
        _.forEach(value, (codes, type) => {
          if (!_.isEmpty(codes)) {
            fmt.printSuccessLine(2, `${type.toUpperCase()}:`);
            _.forEach(codes, code => {
              fmt.printSuccessLine(3, code);
            });
            fmt.printSuccessLine(2);
          }
        });
        break;
      case 'builtwith':
        _.forEach(value, (value, tag) => {
          fmt.printSuccessLine(2, fmt.pad('TAG:', 1), tag);
          _.forEach(value, domain => {
            fmt.printSuccessLine(3, domain);
          });
          fmt.printSuccessLine(2);
        });
        break;
      case 'builtwithExpanded':
        _.forEach(value, (value, domain) => {
          fmt.printSuccessLine(2, fmt.pad('DOMAIN:', 1), domain);
          _.forEach(value, (value, tag) => {
            fmt.printSuccessLine(3, fmt.pad('TAG:', 1), tag);
            _.forEach(value, connection => {
              fmt.printSuccessLine(4, connection);
            });
          });
          fmt.printSuccessLine(2);
        });
        break;
      case 'spyonweb':
        _.forEach(value, (value, tag) => {
          fmt.printSuccessLine(2, fmt.pad('TAG:', 1), tag);
          _.forEach(value, (date, domain) => {
            fmt.printSuccessLine(3, domain);
          });
          fmt.printSuccessLine(2);
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
