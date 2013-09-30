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