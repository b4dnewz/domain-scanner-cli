![banner](https://cdn.rawgit.com/b4dnewz/domain-scanner/182a366a/banner.jpg)

## Introduction
This is the __official cli-tool__ for [domain-scanner](https://github.com/b4dnewz/domain-scanner).
It can perform various type of analysis against a given hostname. For example it can enumerate subdomains, emails, breaches and many more, of a given domain.
For all the __issues__ regarding the scanner, ensure to open issues in [domain-scanner](https://github.com/b4dnewz/domain-scanner) repository.

## Installation
Install the module globally to access it from the command line:
```sh
$ npm install -g domain-scanner-cli
```

## Usage
You can get the informations and usage of the program by typing __--help__:
```
$ domain-scanner --help

  Options:

    -V, --version  output the version number
    -h, --help     output usage information


  Commands:

    scan [options] <domain>  Perform a scan for the given domain name.
    list-tasks               List all the domain-scanner available task.


  Examples:

    domain-scanner --help                         Print this usage informations
    domain-scanner scan --help                    Print the action specific informations

    domain-scanner list-tasks                     List all the available tasks/sections

    domain-scanner scan example.com               Perform the default scan (all sections)
    domain-scanner scan -s emails example.com     Perform the email section scan only
```

## License

MIT © [b4dnewz](https://b4dnewz.github.io/)
