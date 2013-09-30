# a11yfy

Accessibilyfy Library Functions - Make your jQuery site accessible

## core

The core of the a11yfy library provides some utility functions for use a11y as well as for sharing common functionality across a11yfy utilities themselves.

This extension adds the following things to the jQuery namespace:

    jQuery().tables - turn an element or elements into an accessible table
    jQuery.fn.a11yfy - utility accessibility functions that do not operate on specific DOM nodes
    jQuery().a11yfy - execute accessibility functions on (a) DOM node(s)

## List of functions

* [jQuery(selector).a11yfy("focus")](a11yfy.md#focus)
* [jQuery(selector).a11yfy("showAndFocus", selector)](a11yfy.md#showandfocus)
* [jQuery(selector).a11yfy("menu")](a11yfy.md#menu)
* [jQuery.fn.a11yfy.getI18nString(key, [values], stringBundle)](i18n.md)
* [jQuery.fn.a11yfy.politeAnnounce(msg)](announce.md#jqueryfna11yfypoliteannounce)
* [jQuery.fn.a11yfy.assertiveAnnounce(msg)](announce.md#jqueryfna11yfyassertiveannounce)
* [jQuery(selector).tables(options)](tables.md)

