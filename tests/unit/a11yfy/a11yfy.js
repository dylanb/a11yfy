(function(jQuery) {
    module( "core - jQuery a11yfy" );

    test( "Test addition of the polite announce div", function () {
        expect(1);
        equal(jQuery("#jquery-a11yfy-politeannounce").length, 1);
    });

    test( "Test addition of the polite announce function", function () {
        expect(1);
        equal(typeof jQuery.a11yfy.politeAnnounce, "function");
    });

    test( "The insertion of a paragraph into the polite announce div when jQuery.a11yfy.politeAnnounce() called", function () {
        expect(2);
        equal(jQuery("#jquery-a11yfy-politeannounce p").length, 0);
        jQuery.a11yfy.politeAnnounce("Message");
        equal(jQuery("#jquery-a11yfy-politeannounce p").length, 1);
    });

    test( "Test addition of the assertive announce div", function () {
        expect(1);
        equal(jQuery("#jquery-a11yfy-assertiveannounce").length, 1);
    });

    test( "Test addition of the assertive announce function", function () {
        expect(1);
        equal(typeof jQuery.a11yfy.assertiveAnnounce, "function");
    });

    test( "The insertion of a paragraph into the assertive announce div when jQuery.a11yfy.assertiveAnnounce() called", function () {
        expect(2);
        equal(jQuery("#jquery-a11yfy-assertiveannounce p").length, 0);
        jQuery.a11yfy.assertiveAnnounce("Message");
        equal(jQuery("#jquery-a11yfy-assertiveannounce p").length, 1);
    });

    test( "The getI18nString functionality", function () {
        expect(2);
        equal(jQuery.a11yfy.getI18nString("test", undefined, {"test": "test"}), "test");
        equal(jQuery.a11yfy.getI18nString("test", { one: 1, two: 2}, {"test": "test ${two}, ${one}"}), "test 2, 1");
    });

    asyncTest( "Test focus being set on element after 1 second", function () {
        var $fixture = jQuery("#qunit-fixture");

        expect(1);
        $fixture.empty();
        $fixture.append(jQuery("<div><button id=\"focus1\">button</button></div>"));
        jQuery("#focus1").on("focus", function () {
            ok(true);
            start();
        }).a11yfy("focus");
    });

    asyncTest( "Test focus being set on shown element after 1 second", function () {
        var $fixture = jQuery("#qunit-fixture");

        expect(1);
        $fixture.empty();
        $fixture.append(jQuery("<div id=\"show2\" style=\"display:none;\"><button id=\"focus2\">button</button></div>"));
        jQuery("#focus2").on("focus", function () {
            ok(true);
            start();
        });
        jQuery("#show2").a11yfy("showAndFocus", "#focus2");
    });

    asyncTest( "Test focus NOT being set on display:none element after 1 second", function () {
        var $fixture = jQuery("#qunit-fixture");

        expect(1);
        $fixture.empty();
        $fixture.append(jQuery("<div style=\"display:none;\"><button id=\"focus3\">button</button></div>"));
        jQuery("#focus3").on("focus", function () {
            ok(false);
        }).a11yfy("focus", "#focus3");

        setTimeout(function () {
            ok(true);
            start();
        }, 1100);
    });

    test("That the markup of the menu is applied correctly", function () {
        var $menu = jQuery("#menu-test-1"),
            $topMenuItems;

        expect(16);
        $menu.a11yfy("menu");
        $topMenuItems = $menu.find(">li[role='menuitem']");
        equal($menu.attr("role"), "menubar", "top ul should have role menubar");
        ok($menu.hasClass("a11yfy-top-level-menu"), "should have to level menu class");
        equal($menu.find(">li[role='menuitem']").length, 4, "should be 4 first level menuitems");
        $topMenuItems.each(function(index, value) {
            if (index === 0) {
                equal(jQuery(value).attr("tabindex"), "0", "the first top level menu item should be focussable");
            } else {
                equal(jQuery(value).attr("tabindex"), "-1", "All other top level menu items should not be focussable");
            }
        });
        equal($menu.find(">li.a11yfy-has-submenu").length, 2, "There should be two top level menu items with sub menus");
        equal(jQuery($topMenuItems[1]).attr("aria-haspopup"), "true", "The second top level menu item should have an aia-haspopup attribute of true");
        equal(jQuery($topMenuItems[1]).find("li.a11yfy-has-submenu").length, 1, "The second top level menu item should have the submenu class");
        equal(jQuery($topMenuItems[1]).find("li.a11yfy-has-submenu").attr("aria-haspopup"), "true", "The sub-submenu item must also have aria-haspopup true");
        equal(jQuery($topMenuItems[1]).find(">ul.a11yfy-second-level-menu").length, 1, "The second menu item's sub menu must have the correct class");
        equal(jQuery($topMenuItems[1]).find(">ul.a11yfy-second-level-menu>li>ul.a11yfy-third-level-menu").length, 1, "The second menu items sub-sub-menu must have the correct class");
        equal(jQuery($topMenuItems[1]).find("li[tabindex=-1]").length, 8, "The second menu item should have 8 menu items in total below it");
        equal(jQuery($topMenuItems[1]).find("a[tabindex=-1]").length, 7, "The second menu item should have 7 anchor tags with tabindex of -1");
        equal(jQuery($topMenuItems[1]).find("ul[role='menu']").length, 2, "The second menu item should have 2 sub-menus");
    });

    test("The keyboard and focus functionality", function () {
        var $menu = jQuery("#menu-test-2");

        expect(24);
        $menu.a11yfy("menu");
        $menu.find("li").each(function(index, value) {
            // Add ids to all the lis so we can track him
            jQuery(value).attr("id", "test2-" + index);
        });
        // focus the first item to simulate the focus coming into the widget
        $menu.find("li[tabindex=0]").simulate("focus");
        equal($menu.find("li[tabindex=0]")[0], document.activeElement, "The focus should go to the first top level menu item by default");

        // Test wraparound on menu bar
        jQuery(document.activeElement).simulate("keydown", {keyCode: 37}); // LEFT
        equal(jQuery(document.activeElement).attr("id"), "test2-15", "wrap around at beginning goes to the end");
        jQuery(document.activeElement).simulate("keydown", {keyCode: 39}); // RIGHT
        equal(jQuery(document.activeElement).attr("id"), "test2-0", "wrap around at the end goes to the beginning");

        // Test opening sub-menu from menu bar
        jQuery(document.activeElement).simulate("keydown", {keyCode: 39}); // RIGHT
        equal(jQuery(document.activeElement).attr("id"), "test2-5", "Right should get us to the second top level menu item");
        jQuery(document.activeElement).simulate("keydown", {keyCode: 40}); // DOWN
        equal(jQuery(document.activeElement).attr("id"), "test2-6", "Down on the second top level menu item (with a sub menu) should open it and set focus into it");
        equal(jQuery(document.activeElement).parent().attr("aria-expanded"), "true", "When opened, the menu should have aria-expanded set to true");
        ok(jQuery(document.activeElement).parent().hasClass("open"), "When opened, the menu should have open class");

        // Test the wraparound within the sub-menu
        jQuery(document.activeElement).simulate("keydown", {keyCode: 38}); // UP
        equal(jQuery(document.activeElement).attr("id"), "test2-13", "Up should wrap to the bottom at the top");
        jQuery(document.activeElement).simulate("keydown", {keyCode: 40}); // DOWN
        equal(jQuery(document.activeElement).attr("id"), "test2-6", "Down should wrap to the top at the bottom");
        // Open sub-sub-menu
        jQuery(document.activeElement).simulate("keydown", {keyCode: 39}); // RIGHT
        equal(jQuery(document.activeElement).attr("id"), "test2-7", "Right should open the sub-sub-menu");
        // Close sub-sub-menu
        jQuery(document.activeElement).simulate("keydown", {keyCode: 27}); // ESC
        equal(jQuery(document.activeElement).attr("id"), "test2-6", "ESC should close the sub-sub-menu");
        equal(jQuery("#test2-7").parent().attr("aria-expanded"), "false", "aria-expended should be false after close");
        ok(!jQuery("#test2-7").parent().hasClass("open"), "open class should be removed after close");
        // Open sub-sub-menu
        jQuery(document.activeElement).simulate("keydown", {keyCode: 39}); // RIGHT
        equal(jQuery(document.activeElement).attr("id"), "test2-7", "open the sub-sub-menu");
        // Close sub-sub-menu
        jQuery(document.activeElement).simulate("keydown", {keyCode: 37}); // LEFT
        equal(jQuery(document.activeElement).attr("id"), "test2-6", "Left should close the sub-sub-menu");
        // tab out of menu
        $menu.simulate("keydown", {keyCode: 9}); // TAB
        equal(jQuery("#test2-6").attr("tabindex"), "-1", "Tab should cause the sub-menus to all be closed and the tabindexes set to -1");
        // focus should now go to the parent of the sub-menu previously focussed
        $menu.find("li[tabindex=0]").simulate("focus");
        equal(jQuery(document.activeElement).attr("id"), "test2-5", "The top level menu item that previously contained the focus shold have tabindex set to 0");

        // move to top-level menu item without sub-menu
        jQuery(document.activeElement).simulate("keydown", {keyCode: 39}); // RIGHT
        equal(jQuery(document.activeElement).attr("id"), "test2-14", "Focussed on a top level menu item without sub-menu");
        jQuery(document.activeElement).on("click", function(e) {
            ok("clicked the anchor in the menu item of a top level menu item");
            e.preventDefault();
        });
        jQuery(document.activeElement).simulate("keydown", {keyCode: 13}); // ENTER
        jQuery(document.activeElement).simulate("keydown", {keyCode: 32}); // SPACE

        // Move to sub-menu without sub-sub-menu
        jQuery(document.activeElement).simulate("keydown", {keyCode: 37}); // LEFT
        equal(jQuery(document.activeElement).attr("id"), "test2-5");
        jQuery(document.activeElement).simulate("keydown", {keyCode: 40}); // DOWN
        jQuery(document.activeElement).simulate("keydown", {keyCode: 40}); // DOWN
        equal(jQuery(document.activeElement).attr("id"), "test2-11");
        jQuery(document.activeElement).on("click", function(e) {
            ok("clicked the anchor in the menu item of a sub-menu");
            e.preventDefault();
        });
        jQuery(document.activeElement).simulate("keydown", {keyCode: 13}); // ENTER
        jQuery(document.activeElement).simulate("keydown", {keyCode: 32}); // SPACE
    });

    test("The exception thrown when called on something that is not a UL", function () {
        var $menu = jQuery("div").first();

        expect(1);
        try {
            $menu.a11yfy("menu");
        } catch( err) {
            ok("exception expected and caught");
        }
    });
    test("The cycling when sub-menus all have sub-sub-menus", function () {
        var $menu = jQuery("#menu-test-3");

        expect(3);
        $menu.a11yfy("menu");
        $menu.find("li").each(function(index, value) {
            // Add ids to all the lis so we can track him
            jQuery(value).attr("id", "test3-" + index);
        });
        // focus the first item to simulate the focus coming into the widget
        $menu.find("li[tabindex=0]").simulate("focus");

        // Test opening sub-menu from menu bar
        jQuery(document.activeElement).simulate("keydown", {keyCode: 40}); // DOWN
        equal(jQuery(document.activeElement).attr("id"), "test3-1", "Down open the sub-menu and place focus on the first element");
        // Test the wraparound within the sub-menu
        jQuery(document.activeElement).simulate("keydown", {keyCode: 38}); // UP
        equal(jQuery(document.activeElement).attr("id"), "test3-6", "Up should wrap to the bottom at the top");
        jQuery(document.activeElement).simulate("keydown", {keyCode: 40}); // DOWN
        equal(jQuery(document.activeElement).attr("id"), "test3-1", "Down should wrap to the top at the bottom");
    });
})(jQuery);

