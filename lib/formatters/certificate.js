const _ = require('lodash');
const fmt = require('../formatter');

// Print an array of names
const printNames = (section, data) => {
  fmt.printSuccessBullet(2, '[-]', fmt.pad(section, 18));
  fmt.printSuccessLine(3);
  data.forEach(name => {
    fmt.printSuccessLine(3, name);
  });
};

module.exports = data => {
  if (_.isEmpty(data)) {
    fmt.printSectionWarning('Certificate', 'No certificates found.');
    return;
  }

  // Print section title
  fmt.printSectionTitle('Certificate');
  fmt.printSuccessLine(1, fmt.pad('HOST:', 12), data.host);
  fmt.printSuccessLine(1, fmt.pad('STATUS:', 12), data.status);
  fmt.printSuccessLine(1);

  // Print each endpoint data
  data.endpoints.forEach((ep, i) => {
    fmt.printSuccessBullet(1, `[${++i}]`, fmt.pad('ENDPOINT:', 12), ep.serverName);
    fmt.printSuccessLine(2, fmt.pad('GRADE:', 12), ep.grade);
    fmt.printSuccessLine(2, fmt.pad('WARNINGS:', 12), ep.hasWarnings);
    fmt.printSuccessLine(2);

    // Print certificate issuer and details
    fmt.printSuccessBullet(
      2,
      '[-]',
      fmt.pad('ISSUER LABEL:', 18),
      ep.details.cert.issuerLabel
    );
    fmt.printSuccessLine(
      3,
      fmt.pad('ISSUER SUBJECT:', 18),
      ep.details.cert.issuerSubject
    );
    fmt.printSuccessLine(3);
    fmt.printSuccessLine(3, fmt.pad('ALGORITHM:', 18), ep.details.cert.sigAlg);
    fmt.printSuccessLine(
      3,
      fmt.pad('PROTOCOLS:', 18),
      ep.details.protocols.map(p => `${p.name}/${p.version}`).join(', ')
    );
    fmt.printSuccessLine(3);

    // Print certificate http details
    fmt.printSuccessLine(3, fmt.pad('HTTP STATUS:', 18), ep.details.httpStatusCode);
    fmt.printSuccessLine(3, fmt.pad('HTTP FORWARDING:', 18), ep.details.httpForwarding);
    fmt.printSuccessLine(3);

    // Print certificate policies details
    fmt.printSuccessLine(3, fmt.pad('HEARTBLEED:', 18), ep.details.heartbleed);
    fmt.printSuccessLine(3, fmt.pad('HEARTBEAT:', 18), ep.details.heartbeat);
    fmt.printSuccessLine(3, fmt.pad('HTSTS POLICY:', 18), ep.details.hstsPolicy.status);
    fmt.printSuccessLine(3, fmt.pad('HPKP POLICY:', 18), ep.details.hpkpPolicy.status);
    fmt.printSuccessLine(
      3,
      fmt.pad('HPKPRO POLICY:', 18),
      ep.details.hpkpRoPolicy.status
    );
    fmt.printSuccessLine(3);

    // Print HTSTS preload details
    fmt.printSuccessBullet(
      2,
      '[-]',
      fmt.pad('HTSTS PRELOADS:', 18),
      ep.details.cert.issuerLabel
    );
    fmt.printSuccessLine(3);
    ep.details.hstsPreloads.forEach(preload => {
      fmt.printSuccessLine(3, fmt.pad(preload.source, 18), preload.status);
    });
    fmt.printSuccessLine(3);

    // Print certificate common names
    printNames('COMMON NAMES:', ep.details.cert.commonNames);
    fmt.printSuccessLine(3);

    // Print certificate alternative names
    printNames('ALTERNATIVE NAMES:', ep.details.cert.altNames);

    // Print divider between endpoints
    fmt.printSuccessLine();
  });
};
