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

})(jQuery);

