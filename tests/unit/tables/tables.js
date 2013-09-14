(function(jQuery) {
    module( "tables - jQuery a11yfy" );

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

        jQuery("#jquery-a11yfy-politeannounce").empty();
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
        equal(jQuery("#jquery-a11yfy-politeannounce p").length, 9); // once for the initial tables call and once for each click

    });

    test( "Filtering by simulating focus and then change events", function () {
        var $table = jQuery("#test7"), $anchors;

        jQuery("#jquery-a11yfy-politeannounce").empty();

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
        equal(jQuery("#jquery-a11yfy-politeannounce p").length, 4); // once for the initial tables call and once for each change
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

    asyncTest( "Test exception when sortFilter and responsive set", function () {
        var $table = jQuery("#test8");

        expect(1);

        try {
            $table.tables({
                sortFilter: "both",
                responsive: {
                    breakPoint: 500
                }
            });
        } catch( err) {
            ok(true);
            start();
        }
    });

    test( "That when smaller than the breakpoint, we get row data tables and a thead", function () {
        var $table = jQuery("#test9");

        expect(2);

        $table.tables({
            sortFilter: "none",
            responsive: {
                breakPoint: window.screen.availWidth +1
            }
        });
        equal($table.find("tr").first().find("th").length, 1);
        equal($table.find("thead").length, 1);
    });

    test( "That when NOT using css, and when smaller than the breakpoint, td and th have display table-cell", function () {
        var $table = jQuery("#test10");

        expect(16);

        $table.tables({
            sortFilter: "none",
            responsive: {
                breakPoint: window.screen.availWidth +1
            }
        });
        $table.find("td,th").each(function(index, value) {
            equal(jQuery(value).css("display"), "table-cell");
        });
    });

    test( "That when using css, and when smaller than the breakpoint, td and th have display block", function () {
        var $table = jQuery("#test11");

        expect(32);

        $table.tables({
            sortFilter: "none",
            responsive: {
                breakPoint: window.screen.availWidth +1,
                css: true
            }
        });
        $table.find("td,th").each(function(index, value) {
            equal(jQuery(value).css("display"), "block");
            equal(jQuery(value).css("position"), "relative");
        });
    });

    test( "That for responsive row-based table, css must also be used", function () {
        var $table = jQuery("#test12");

        expect(1);

        try {
            $table.tables({
                sortFilter: "none",
                responsive: {
                    breakPoint: window.screen.availWidth +1,
                    rowBased: true
                }
            });
        } catch(err) {
            ok("exception thrown because rowBased used without css");
        }
    });

    test( "That for responsive row-based table, td and th have display block ", function () {
        var $table = jQuery("#test13");

        expect(19);

        $table.tables({
            sortFilter: "none",
            responsive: {
                breakPoint: window.screen.availWidth +1,
                rowBased: true,
                css: true
            }
        });
        $table.find("td,th").each(function(index, value) {
            equal(jQuery(value).css("display"), "block");
            equal(jQuery(value).css("position"), "relative");
        });
        // added body
        equal($table.find("tbody").length, 1);
        // added head
        equal($table.find("thead").length, 1);
        // rows are moved into the body
        equal($table.find("tbody").find("tr").length, 2);
    });

    test( "That for columnar responsive table thead exists", function () {
        var $table = jQuery("#test14");

        expect(1);

        try {
            $table.tables({
                sortFilter: "none",
                responsive: {
                    breakPoint: window.screen.availWidth +1
                }
            });
        } catch( err) {
            ok("expected exception caught");
        }
    });

    test( "That for columnar responsive table tbody exists", function () {
        var $table = jQuery("#test15");

        expect(1);

        try {
            $table.tables({
                sortFilter: "none",
                responsive: {
                    breakPoint: window.screen.availWidth +1
                }
            });
        } catch( err) {
            ok("expected exception caught");
        }
    });
})(jQuery);