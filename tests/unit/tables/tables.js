(function(jQuery) {
    module( "tables - jQuery a11yfy" );

    test( "Test addition of the polite announce div", function () {
        expect(1);
        equal(jQuery("#jquery-ui-politeannounce").length, 1);
    });

    test( "Test addition of the polite announce function", function () {
        expect(1);
        equal(typeof jQuery.fn.tables.politeAnnounce, "function");
    });

    test( "The insertion of a paragraph into the polite announce div when jQuery.fn.tables.politeAnnounce() called", function () {
        expect(2);
        equal(jQuery("#jquery-ui-politeannounce p").length, 0);
        jQuery.fn.tables.politeAnnounce("Message");
        equal(jQuery("#jquery-ui-politeannounce p").length, 1);
    });

    test( "The addition of the anchor tags around in the th cells", function () {
        var $table = jQuery("#test1");

        expect(2);
        equal($table.find("th a").length, 0);
        $table.tables();
        equal($table.find("th a").length, 4);
    });

    test( "The adding anchor tags when sortFilter is \"none\"", function () {
        var $table = jQuery("#test2");

        expect(2);
        equal($table.find("th a").length, 0);
        $table.tables({ sortFilter: "none"});
        equal($table.find("th a").length, 0);
    });

    test( "The adding anchor tags when sortFilter is \"sort\"", function () {
        var $table = jQuery("#test3");

        expect(2);
        equal($table.find("th a").length, 0);
        $table.tables({ sortFilter: "sort"});
        equal($table.find("th a").length, 3);
    });

    test( "The adding anchor tags when sortFilter is \"filter\"", function () {
        var $table = jQuery("#test4");

        expect(2);
        equal($table.find("th a").length, 0);
        $table.tables({ sortFilter: "filter"});
        equal($table.find("th a").length, 1);
    });

    test( "The adding anchor tags when sortFilter is \"both\"", function () {
        var $table = jQuery("#test5");

        expect(2);
        equal($table.find("th a").length, 0);
        $table.tables({ sortFilter: "both"});
        equal($table.find("th a").length, 4);
    });

    test( "Sorting by simulating clicks on the header anchors", function () {
        var $table = jQuery("#test6"), $anchors;

        jQuery("#jquery-ui-politeannounce").empty();
        expect(11);

        notEqual($table.find("tbody tr")[0].id, "test6row1");

        $table.tables(); // default will apply sorting to the table
        $anchors = $table.find("th a");

        // After the table is applied, the table should be sorted by the first column (Integer) in ascending order
        equal($table.find("tbody tr")[0].id, "test6row1");
        // Click the first anchor, this will toggle the sort to descending order
        $anchors.eq(0).simulate("click");
        equal($table.find("tbody tr")[0].id, "test6row5");
        // Click the first anchor, this will toggle the sort to ascending order
        $anchors.eq(0).simulate("click");
        equal($table.find("tbody tr")[0].id, "test6row1");

        // Click the second anchor, this will sort the second column (String) in ascending order
        $anchors.eq(1).simulate("click");
        equal($table.find("tbody tr")[0].id, "test6row2");
        // Then descending
        $anchors.eq(1).simulate("click");
        equal($table.find("tbody tr")[0].id, "test6row1");

        // Click the 3rd anchor, this will sort the 3rd column (Float) in ascending order
        $anchors.eq(2).simulate("click");
        equal($table.find("tbody tr")[0].id, "test6row5");
        // Then descending
        $anchors.eq(2).simulate("click");
        equal($table.find("tbody tr")[0].id, "test6row1");

        // Click the 4th anchor, this will sort the 4th column (String) in ascending order
        $anchors.eq(3).simulate("click");
        equal($table.find("tbody tr")[0].id, "test6row4");
        // Then descending
        $anchors.eq(3).simulate("click");
        equal($table.find("tbody tr")[0].id, "test6row3");

        // Test that the announcements were made each time the sorting changed
        equal(jQuery("#jquery-ui-politeannounce p").length, 9); // once for the initial tables call and once for each click

    });

    test( "Filtering by simulating focus and then change events", function () {
        var $table = jQuery("#test7"), $anchors;

        jQuery("#jquery-ui-politeannounce").empty();

        expect(4);
        $table.tables(); // default will apply filtering to the table
        $anchors = $table.find("th a");

        $anchors.eq(0).simulate("focus");
        jQuery(document.activeElement).val("2").trigger("change");
        equal($table.find("tbody tr:visible").length, 1);

        $anchors.eq(1).simulate("focus");
        jQuery(document.activeElement).val("A").trigger("change");
        equal($table.find("tbody tr:visible").length, 3);

        $anchors.eq(2).simulate("focus");
        jQuery(document.activeElement).val("something A").trigger("change");
        equal($table.find("tbody tr:visible").length, 2);

        // Test that the announcements were made each time the filtering changed
        equal(jQuery("#jquery-ui-politeannounce p").length, 4); // once for the initial tables call and once for each change
    });

    test( "Off Screen Text by simulating focus/blur on the header anchors", function () {
        var $table = jQuery("#test8"), $anchors;

        expect(4);

        $table.tables();
        $anchors = $table.find("th a");

        equal($anchors.eq(0).find("span.offscreen").length, 0);
        $anchors.eq(0).simulate("focus");
        equal($anchors.eq(0).find("span.offscreen").length, 1);
        notEqual($anchors.eq(0).find("span.offscreen").text(), "");
        $anchors.eq(0).simulate("blur");
        equal($anchors.eq(0).find("span.offscreen").text(), "");
    });
})(jQuery);