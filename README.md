# a11yfy

A11yfy Library Functions - Make your jQuery code accessible

[![Build Status](https://travis-ci.org/dylanb/a11yfy.svg?branch=master)](https://travis-ci.org/dylanb/a11yfy)
## core

The core of the a11yfy library provides some utility functions for use a11y as well as for sharing common functionality across a11yfy utilities themselves.

This extension adds the following things to the jQuery namespace:

    jQuery().tables - turn an element or elements into an accessible table
    jQuery.a11yfy - utility accessibility functions that do not operate on specific DOM nodes
    jQuery().a11yfy - execute accessibility functions on (a) DOM node(s)

## List of functions

* [jQuery(selector).a11yfy("focus")](a11yfy.md#focus)
* [jQuery(selector).a11yfy("showAndFocus", selector)](a11yfy.md#showandfocus)
* [jQuery(selector).a11yfy("menu")](a11yfy.md#menu)
* [jQuery(selector).a11yfy("validate")](validate.md)
* [jQuery.a11yfy.getI18nString(key, [values], stringBundle)](i18n.md)
* [jQuery.a11yfy.politeAnnounce(msg)](announce.md#jquerya11yfypoliteannounce)
* [jQuery.a11yfy.assertiveAnnounce(msg)](announce.md#jquerya11yfyassertiveannounce)
* [jQuery(selector).tables(options)](tables.md)

## Contributing

Fork the repository and submit any changes via a pull request. The changes must have

1. Full unit tests with at least 90% coverage and Testem support
2. Integraion into the build, lint, test grunt script
3. Must adhere to the jQuery UI coding standards and be 100% lint free
4. All dependencies must be managed by npm install (use bower for non Node.js dependencies)
5. All code must be MIT licensed code and must contain the full licensing information with Copyright attribution

I reserve the right at my own discretion to change any submitted changes in any way as well as to reject any submitted changes for any or no reason.

### Getting started

This assumes that you have git installed with the command line tools for git enabled

1. Fork
2. Clone
3. Install Node.js and npm
4. npm install testem -g
5. npm install grunt -g
6. npm install grunt-cli -g
7. Change directory into the cloned repository's directory and install the dependencies
8. npm install
9. grunt all

#### Running testem

Testem can be used to run unit tests automatically in multiple browsers while you are developing. To run it for a particular test page, use the following command:

		testem --test_page {unit-test-html-page}

Example:

		testem --test_page tests/unit/a11yfy/a11yfy.html

Note: The path to the test page must be in "UNIX format" because the web browser expects forward slashes in the URL

To run it from multiple machines simultaneously (e.g. Windows and Mac OS X), connect to the testem port from your remote machine's browser

e.g. http://your.ip.address.here:7357/
