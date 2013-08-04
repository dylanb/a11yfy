(function(jQuery) {

module( "tables - jQuery extensions" );

test( "Test addition of the polite announce div", function () {
    expect(1);
    equal(jQuery("#jquery-ui-politeannounce").length, 1);
});

/*asyncTest( "what test does", function() {
    expect( 1 );
    jQuery( "#unique_id" )
        .one( "focus", function() {
            ok( true, "success message" );
            start();
        })
        .focus();
});*/
})(jQuery);