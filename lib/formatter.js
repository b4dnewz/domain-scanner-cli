const chalk = require('chalk');
const log = console.log;

// The section ident line
const line = ' | ';

module.exports = {
  pad: (s, width = 10) => {
    while (s.length < width) {
      s += ' ';
    }
    return s;
  },

  // Print a log message
  printMessage: (color = 'white', symbol = '[-]', ...text) => {
    log(chalk[color](symbol), text.join(' '));
  },
  printInfoMessage: (...text) => {
    module.exports.printMessage('cyanBright', '[i]', text);
  },
  printSuccessMessage: (...text) => {
    module.exports.printMessage('greenBright', '[s]', text);
  },
  printWarningMessage: (...text) => {
    module.exports.printMessage('yellowBright', '[w]', text);
  },
  printErrorMessage: (...text) => {
    module.exports.printMessage('redBright', '[e]', text);
  },

  // Print a log line of a section with ident ' | '
  printLine: (color = 'white', depth = 1, ...text) => {
    log(chalk[color](line.repeat(depth)), text.join(' '));
  },
  printInfoLine: (depth = 1, ...text) => {
    module.exports.printLine('cyanBright', depth, ...text);
  },
  printWarningLine: (depth = 1, ...text) => {
    module.exports.printLine('yellowBright', depth, ...text);
  },
  printSuccessLine: (depth = 1, ...text) => {
    module.exports.printLine('greenBright', depth, ...text);
  },
  printErrorLine: (depth = 1, ...text) => {
    module.exports.printLine('redBright', depth, ...text);
  },

  // Print section bullet
  printBullet: (color = 'white', depth = 1, symbol = '*', ...text) => {
    if (!depth || depth === 0) {
      log(chalk[color](symbol), text.join(' '));
      return;
    }
    log(chalk[color](line.repeat(depth).slice(0, -1), symbol), text.join(' '));
  },
  printSuccessBullet: (depth = 1, symbol = '*', ...text) => {
    module.exports.printBullet('greenBright', depth, symbol, ...text);
  },
  printInfoBullet: (depth = 1, symbol = '*', ...text) => {
    module.exports.printBullet('cyanBright', depth, symbol, ...text);
  },
  printWarningBullet: (depth = 1, symbol = '*', ...text) => {
    module.exports.printBullet('yellowBright', depth, symbol, ...text);
  },
  printErrorBullet: (depth = 1, symbol = '*', ...text) => {
    module.exports.printBullet('redBright', depth, symbol, ...text);
  },

  // Util methods
  printSectionTitle: s => {
    module.exports.printSuccessBullet(0, '[+]', `${s}:`);
    module.exports.printSuccessLine();
  },
  printSectionWarning: (s, ...msg) => {
    module.exports.printWarningMessage(s);
    module.exports.printWarningLine(1);
    msg.forEach(m => {
      module.exports.printWarningLine(1, m);
    });
  }
};
