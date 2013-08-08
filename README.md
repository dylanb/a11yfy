# a11yfy

Accessibilyfy Library Functions - Make your jQuery site accessible

## core

The core of the a11yfy library provides some utilitu functions for use a11y as well as for sharing common functionality across a11yfy utilities themselves

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

    jQuery(selector).tables(options);

where options is

    {
        sortFilter: "both" | "none" | "sort" | "filter",
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

When sortFilter is "both" or "filter", filtering capability will be applied only to columns that have the attribute data-filter="true".

If sortFilter is "both" or "sort", sorting will be applied to every column that does not have the data-filter="true" attribute.

Strings is the texts that are used for announcements and off-screen texts. These can be overridden to translate the plugin to other languages. See the i18n folder for examples of translated languages.

### Limitations
1. If you have multiple th elements in a column, tables will faithfully attempt to apply filters and sorting to these th elements but will only treat the first row as the header row. The results of this might be interesting, but are not predictable.
2. You cannot currently sort or filter columns, only rows
