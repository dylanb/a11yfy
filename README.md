# a11yfy

Accessibilyfy Library Functions - Make your jQuery site accessible

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

1. Fork
2. Clone
3. Install Node.js and npm
4. npm install testem -g
5. Change directory into the cloned repository's directory and install the dependencies
6. npm install
7. grunt all



