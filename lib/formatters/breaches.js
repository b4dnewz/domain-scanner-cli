const fmt = require('../formatter');
const chalk = require('chalk');
const _ = require('lodash');

module.exports = data => {
  if (_.isEmpty(data)) {
    fmt.printSectionWarning('Breaches', 'No breaches found for this domain.');
    return;
  }

  // Print section title
  fmt.printSectionTitle('Breaches');
  fmt.printSuccessLine(1, 'Found', chalk.greenBright(data.length), 'breaches:');

  // Print each breach informations
  data.forEach(breach => {
    fmt.printSuccessLine();
    fmt.printSuccessLine(1, 'TITLE:', breach.Title);
    fmt.printSuccessLine(1, 'DATE:', breach.BreachDate);
    fmt.printSuccessLine(1, 'COUNT:', breach.PwnCount);
    fmt.printSuccessLine(1, 'DATA CLASS:', breach.DataClasses.join(', '));
    fmt.printSuccessLine(1, 'SENSITIVE:', breach.IsSensitive);
  });
};
