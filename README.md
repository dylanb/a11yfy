# a11yfy

Accessibilyfy Library Functions - Make your jQuery site accessible

## core

The core of the a11yfy library provides some utility functions for use a11y as well as for sharing common functionality across a11yfy utilities themselves.

This extension adds the following things to the jQuery namespace:

    jQuery().tables - turn an element or elements into an accessible table
    jQuery.fn.a11yfy - utility accessibility functions that do not operate on specific DOM nodes
    jQuery().a11yfy - execute accessibility functions on (a) DOM node(s)

## List of functions

    jQuery(selector).a11yfy("focus")
    jQuery(selector).a11yfy("showAndFocus", selector)
    jQuery(selector).a11yfy("menu")
    jQuery.fn.a11yfy.getI18nString(key, [values], stringBundle)
    jQuery.fn.a11yfy.politeAnnounce(msg)
    jQuery.fn.a11yfy.assertiveAnnounce(msg)
    jQuery(selector).tables(options)


### jQuery(selector).a11yfy()

Execute an accessibility core function on the element(s) targeted by the jQuery selector

#### Synopsis

    jQuery(selector).a11yfy(method, arguments)

#### Parameters

1. method - a String specifying which method to execute on the element(s). The valid methods are: `menu`, `focus` and `showAndFocus`
2. arguments - optional set of arguments to be passed to the method

#### Methods

##### focus

focus the selected element(s) in a way that will work on all platforms

##### Synopsis

    jQuery(selector).a11yfy("focus");

##### Example

    jQuery("#confirm_button_1").a11yfy("focus");

##### showAndFocus

Show the targeted element and then set focus to the element (normally within it, but this is not enforced) identified by the first argument

##### Synopsis

    jQuery(selector).a11yfy("showAndFocus", selector);

##### Parameters

1. selector - String | Element | jQuery object - the element to focus after the content is shown in a way that will work across platforms

##### Example

    jQuery("#confirm_dialog_1").a11yfy("showAndFocus", "#confirm_button_1");

##### menu

Turn a hierarchy of unordered lists into an aria menu. The target must be a ul element and any leaf nodes must contain anchor tags that respond to a click in when the menu item is selected. The menu implementation uses the jquery.a11yfy.core.css CSS styling by default and can of course be restyled to match the look and feel of any web site or application.

The aria menu implements the DHTML style guid keyboard navigation

In the top level menu:

1. LEFT and RIGHT : move between the menu items and cycle at the ends
2. DOWN : open a sub-menu

In the sub-menus

1. UP and DOWN : mive between the menu items and cycle at the ends
2. ESC and LEFT: close the menu
3. RIGHT : open the sub menu

To turn the menu into a mega-menu, simply apply class="a11yfy-mega" to the top-level <ul> element, add the class
a11yfy-col to each of the second level <li> elements and apply either a11yfy-two_col, a11yfy-three_col or a11yfy-four_col to the second level <ul> elements (depending on whether it has 2, 3 or 4 sub-sub-menus) and the menu will function as a mega menu.

##### Synopsis

    jQuery(selector).a11yfy("menu");

##### Examples

Given the following HTML code

    <ul id="mymenu">
        <li>One
            <ul>
                <li><a href="oneone">One One</a></li>
                <li><a href="onetwo">One Two</a></li>
                <li><a href="onethree">One Three</a></li>
                <li><a href="onefour">One Four</a></li>
            </ul>
        </li>
        <li>Two
            <ul>
                <li>Two One
                    <ul>
                        <li><a href="twooneone">Two One One</a></li>
                        <li><a href="twoonetwo">Two One Two</a></li>
                        <li><a href="twoonethree">Two One Three</a></li>
                        <li><a href="twoonefour">Two One Four</a></li>
                    </ul>
                </li>
                <li><a href="onetwo">Two Two</a></li>
                <li><a href="onethree">Two Three</a></li>
                <li><a href="onefour">Two Four</a></li>
            </ul>
        </li>
        <li><a href="three">Three</a></li>
        <li><a href="four">Four</a></li>
    </ul>

The following call will turn the above HTML into a simple menu that can be used with a keyboard, a mouse and a screen reader.

    jQuery("#mymenu").a11yfy("menu");

Given the following HTML code

    <ul id="mymegamenu" class="a11yfy-mega">
        <li>One
            <ul>
                <li><a href="oneone">One One</a></li>
                <li><a href="onetwo">One Two</a></li>
                <li><a href="onethree">One Three</a></li>
                <li><a href="onefour">One Four</a></li>
            </ul>
        </li>
        <li>Two
            <ul class="a11yfy-two_col">
                <li class="a11yfy-col">Two One
                    <ul>
                        <li><a href="twooneone">Two One One</a></li>
                        <li><a href="twoonetwo">Two One Two</a></li>
                        <li><a href="twoonethree">Two One Three</a></li>
                        <li><a href="twoonefour">Two One Four</a></li>
                    </ul>
                </li>
                <li class="a11yfy-col">Two Two
                    <ul>
                        <li><a href="twooneone">Two Two One</a></li>
                        <li><a href="twoonetwo">Two Two Two</a></li>
                        <li><a href="twoonethree">Two Two Three</a></li>
                        <li><a href="twoonefour">Two Two Four</a></li>
                    </ul>
                </li>
            </ul>
        </li>
        <li><a href="three">Three</a></li>
        <li><a href="four">Four</a></li>
    </ul>

The following call will turn the above HTML into a mega menu that can be used with a keyboard, a mouse and a screen reader.

    jQuery("#mymegamenu").a11yfy("menu");


### jQuery.fn.a11yfy.getI18nString

Lookup a language string with value replacement from within a string bundle

#### Synopsis

    jQuery.fn.a11yfy.getI18nString(key, [values], stringBundle)

#### Parameters

1. key - a String that is the name of the language string
2. [values] - A dictionary of key value pairs that represent parameter values that must get replaced in the target languages string to produce the required UI output. This parameter is optional, if not provided, this parameter must be null or undefined.
3. stringBundle -  an dictionary of key value pairs representing the string bundle for the user's UI language. The strings can contain replacement placeholders of the form ${name}. These placeholders can then be replaced with data values when the string is fetched by passing in the appropriate dictionary items in the values dictionary.

#### Example

    jQuery.fn.a11yfy.getI18nString("hello", {name: "Unobfuscator"}, {hello: "Gruss Gott Herr ${name}"});

### jQuery.fn.a11yfy.politeAnnounce

Use aria-live to make a polite announcement. Polite announcements do not interrupt the announcements currently being made by the AT and are also not guaranteed to be made.

#### Synopsis

    jQuery.fn.a11yfy.politeAnnounce(msg)

#### Parameters

1. msg - a String with the information that should be announced to the AT user

#### Example

    jQuery.fn.a11yfy.politeAnnounce("Your cost estimate has been recalculated");

#### See also

    jQuery.fn.a11yfy.assertiveAnnounce

### jQuery.fn.a11yfy.assertiveAnnounce

Use aria-live to make an assertive announcement. Assertive announcements will not interrupt the announcements currently being made by the AT.

#### Synopsis

    jQuery.fn.a11yfy.assertiveAnnounce(msg)

#### Parameters

1. msg - a String with the information that should be announced to the AT user

#### Example

    jQuery.fn.a11yfy.assertiveAnnounce("Please correct the error in the date field before continuing!");

#### See also

    jQuery.fn.a11yfy.politeAnnounce

## tables

Add accessible column sorting and filtering to data tables. Columns are identified by th elements.

### Synopsis

    jQuery(selector).tables(options);

where options is

    {
        sortFilter: "both" | "none" | "sort" | "filter",
        responsive: falsy | {
            breakPoint: 500,
            css: false,
            rowBased: false
        },
        strings : {
            sortableSortedAscending: " Sortable, Sorted Ascending",
            sortableNotSorted: " Sortable, Not Sorted",
            sortableSortedDescending: " Sortable, Sorted Descending",
            filterable: ", Filterable",
            all: "All",
            tableSortedAscending: "Table sorted by ${column}, Ascending",
            tableSortedDescending: "Table sorted by ${column}, Descending",
            tableFilteredOnAndBy: "Table filtered on ${column}, by ${value}"
        }
    }

When sortFilter is "both" or "filter", filtering capability will be applied only to columns that have the attribute data-filter="true". SortFilter and responsive are mutually exclusive and when responsive is used, sortFilter must be set to "none". If sortFilter is "both" or "sort", sorting will be applied to every column that does not have the data-filter="true" attribute.

When responsive is not falsy, then it's value is the options structure that tables will use to convert a columnar table into a responsive columnar table. The options are:

1. breakPoint - Integer - the width in pixels below which the columnar data will be turned into row data so that the responsive CSS can layout the columns sequentially.
2. css - Boolean - if set to true, the tables function will generate css to allow the table to flow responsively when the breakpoint is traversed
3. rowBased - Boolean - if set to true (requires css to be set to true also), will allow a row-based data table to be made accessible.

Strings is the texts that are used for announcements and off-screen texts. These can be overridden to translate the plugin to other languages. See the i18n folder for examples of translated languages.

### Defaults
The jQuery.fn.tables.defaults structure contains the default options for the tables function. It contains the following attributes.

    sortFilter (String) - default value for this option
    strings (Object), - default strings object
    css (Object)
        cssString: (String) - default CSS template when css is set to true for responsive tables

### Limitations
1. If you have multiple th elements in a column, tables will faithfully attempt to apply filters and sorting to these th elements but will only treat the first row as the header row. The results of this might be interesting, but are not predictable.
2. You cannot currently sort or filter columns, only rows

### Examples

    jQuery('#mytable').tables();