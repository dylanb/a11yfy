# a11yfy

Accessibilyfy Library Functions - Make your jQuery site accessible

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
