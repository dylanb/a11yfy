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
})(jQuery);

