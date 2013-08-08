/**
 *
 * jQuery module for accessibility
 *
 * Copyright (C) 2013 Dylan Barrell. All Rights Reserved as specified in the LICENSE file
 *
 */

(function (jQuery){
    var $politeAnnouncer = jQuery("#jquery-a11yfy-politeannouncer"),
        $assertiveAnnouncer = jQuery('#jquery-a11yfy-assertiveannouncer');

    jQuery.a11yfy = function () {};

    jQuery.a11yfy.getI18nString = function(str, values, strings) {
        var msg = strings[str];

        if (values) {
            for (v in values) {
                msg = msg.replace("${"+v+"}", values[v])
            }
        }
        return msg;
    };

    jQuery.a11yfy.politeAnnounce = function (msg) {
        $politeAnnouncer.append(jQuery("<p>").text(msg));
    };

    jQuery.a11yfy.assertiveAnnounce = function (msg) {
        $assertiveAnnouncer.append(jQuery("<p>").text(msg));
    };

    // Add the polite announce div to the page
    if (!$politeAnnouncer || !$politeAnnouncer.length) {
        jQuery(document).ready(function () {
            $politeAnnouncer = jQuery("<div>").attr({
                    "id": "jquery-a11yfy-politeannounce",
                    "role": "log",
                    "aria-live": "polite",
                    "aria-relevant": "additions"
                }).addClass("offscreen");
            jQuery("body").append($politeAnnouncer);
        });
    }
    // Add the polite announce div to the page
    if (!$assertiveAnnouncer || !$assertiveAnnouncer.length) {
        jQuery(document).ready(function () {
            $assertiveAnnouncer = jQuery("<div>").attr({
                    "id": "jquery-a11yfy-assertiveannounce",
                    "role": "log",
                    "aria-live": "assertive",
                    "aria-relevant": "additions"
                }).addClass("offscreen");
            jQuery("body").append($assertiveAnnouncer);
        });
    }
})(jQuery);
