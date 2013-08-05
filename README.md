# a11yfy

Accessible Library Functions

## tables

Add accessible column sorting and filtering to data tables. Columns are identified by th elements.

    jQuery(selector).tables(options);

where options is

    {
        sortFilter: "both" | "none" | "sort" | "filter"
    }

When sortFilter is "both" or "filter", filtering capability will be applied only to columns that have the attribute data-filter="true".

If sortFilter is "both" or "sort", sorting will be applied to every column that does not have the data-filter="true" attribute.

### Limitations
1. If you have multiple th elements in a column, tables will faithfully attempt to apply filters and sorting to these th elements but will only treat the first row as the header row. The results of this might be interesting, but are not predictable.
2. You cannot currently sort or filter columns, only rows
