# a11yfy

Accessibilyfy Library Functions - Make your jQuery site accessible

## core

The core of the a11yfy library provides some utilitu functions for use a11y as well as for sharing common functionality across a11yfy utilities themselves

### jQuery(selector).a11yfy()

Execute an accessibility core function on the element(s) targeted by the jQuery selector

#### Synopsis

    jQuery(selector).a11yfy(method, arguments)

#### Parameters

1. method - a String specifying which method to execute on the element(s). The valid methods are:
1.1 "focus"
1.2 "showAndFocus"
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

    jQuery.fn.a11yfy.politeAnnounce("Your cost estmate has been recalculated");

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
        responsiveColumns: falsy | {
            breakPoint: 500,
            css: false
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

When sortFilter is "both" or "filter", filtering capability will be applied only to columns that have the attribute data-filter="true". SortFilter and responsiveColumns are mutually exclusive and when responsiveColumns is used, sortFilter must be set to "none". If sortFilter is "both" or "sort", sorting will be applied to every column that does not have the data-filter="true" attribute.

When responsiveColumns is not falsy, then it's value is the options structure that tables will use to convert a columnar table into a responsive columnar table. The options are:

1. breakPoint - Integer - the width in pixels below which the columnar data will be turned into row data so that the responsive CSS can layout the columns sequentially.
2. css - Boolean - if set to true, the tables function will generate css to allow the table to flow responsively when the breakpoint is traversed

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