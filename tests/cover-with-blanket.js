(function() {
	/*
	 * This little function inserts the blanket into the QUnit HTML suite in such a way that interactive
	 * coverage tests can be used when in a real browser and automatic coverage testing performed
	 * when using PhantomJS. Another solution would be to use a custom Blanket adapter but that is more
	 * work, so being saved for a rainy day
	 */
    var $script = jQuery("<script src=\"../../../bower_components/blanket/dist/qunit/blanket.js\">");
    if (window && window.navigator.userAgent.indexOf("antom") !== -1) {
        $script.attr("data-cover-reporter", "../../creporter.js").attr("data-cover-flags", " autoStart ");
    }
    jQuery("script").last().after($script);
}());
