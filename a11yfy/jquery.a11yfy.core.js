/**
 *
 * jQuery module for accessibility
 *
 * Copyright (C) 2013 Dylan Barrell. All Rights Reserved as specified in the LICENSE file
 *
 */

(function (jQuery){
    var $politeAnnouncer = jQuery("#jquery-a11yfy-politeannouncer"),
        $assertiveAnnouncer = jQuery("#jquery-a11yfy-assertiveannouncer"),
        methods = {
            showAndFocus: function(focus) {
                var $focus = focus ? jQuery(focus) : focus;
                return this.each(function (index, value) {
                    var $this = jQuery(value);

                    $this.show();
                    if ($focus && $focus.length) {
                        if (platform === "iOS") {
                            jQuery("body").focus();
                            setTimeout(function () {
                                $focus.focus();
                            }, 1000);
                        } else {
                            $focus.focus();
                        }
                    }
                });
            },
            focus : function() {
                return this.each(function (index, value) {
                    var $this = jQuery(value);

                    if (platform === "iOS") {
                        jQuery("body").focus();
                        setTimeout(function () {
                            $this.focus();
                        }, 1000);
                    } else {
                        $this.focus();
                    }
                });
            },
            menu : function() {
                return this.each(function (index, value) {
                    var $this = jQuery(value),
                        $menu = $this;

                    if (value.nodeName !== "UL") {
                        throw new Error("The menu container must be an unordered list");
                    }
                    /* First make all anchor tags in the structure non-naturally focussable */
                    $this.find("a").attr("tabindex", "-1");
                    $this.attr("role", "menubar").addClass("a11yfy-top-level-menu");
                    $this.find(">li>ul")
                        .addClass("a11yfy-second-level-menu")
                        .parent()
                            .addClass("a11yfy-has-submenu")
                            .attr("aria-haspopup", "true");
                    $this.find(">li>ul>li>ul")
                        .addClass("a11yfy-third-level-menu")
                        .parent()
                            .addClass("a11yfy-has-submenu")
                            .attr("aria-haspopup", "true");
                    $this.find("li").each(function(index, value) {
                        var $this = jQuery(value);

                        $this.attr({
                            "role": "menuitem",
                            "tabindex": "-1"
                        });
                        $this.find("ul").each(function(index, value) {
                            jQuery(value).attr("role", "menu");
                        });

                    }).on("keypress", function(e) {
                        var keyCode = e.charCode || e.which || e.keyCode,
                            keyString = String.fromCharCode(keyCode).toLowerCase(),
                            ourIndex,
                            currentItem = this,
                            $this = jQuery(this),
                            $nextItem,
                            $menuitems = $menu.find("li[role=\"menuitem\"]:visible");

                        $menuitems.each(function(index, value) {
                            if (value === currentItem) {
                                ourIndex = index;
                            }
                            if (index > ourIndex && !$nextItem) {
                                if (jQuery(value).text().trim().toLowerCase().indexOf(keyString) === 0) {
                                    $nextItem = jQuery(value);
                                }
                            }
                        });
                        $nextItem.attr("tabindex", "0").focus();
                        $this.attr("tabindex", "-1");
                        if ($nextItem.parent().get(0) !== $this.parent().get(0)) {
                            $this.parent().removeClass("open").attr("aria-expanded", "false");
                        }
                        e.stopPropagation();
                        e.preventDefault();
                    }).on("keydown", function(e) {
                        var keyCode = e.which || e.keyCode,
                            handled = false,
                            $this = jQuery(this),
                            $submenu;

                        if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
                            // not interested
                            return;
                        }
                        $submenu = $this.find(">ul").first();
                        function openMenu() {
                            if ($submenu.length) {
                                $submenu.addClass("open").attr("aria-expanded", "true").find(">li").first().attr("tabindex", "0").focus();
                                $this.attr("tabindex", "-1");
                            }
                        }
                        function prevInMenu() {
                            if ($this.prev().length) {
                                $this.prev().attr("tabindex", "0").focus();
                            } else {
                                $this.parent().find(">li").last().attr("tabindex", "0").focus();
                            }
                            $this.attr("tabindex", "-1");
                        }
                        function nextInMenu() {
                            if ($this.next().length) {
                                $this.next().attr("tabindex", "0").focus();
                            } else {
                                $this.parent().find(">li").first().attr("tabindex", "0").focus();
                            }
                            $this.attr("tabindex", "-1");
                        }
                        switch(keyCode) {
                            case 32: // space
                            case 13: // enter
                                handled = true;
                                if ($this.find(">a").length) {
                                    // This is a hack for PhantomJS
                                    if ($this.find(">a")[0].click) {
                                        $this.find(">a")[0].click();
                                    } else {
                                        $this.find(">a").first().trigger("click");
                                    }
                                } else {
                                    openMenu();
                                }
                                break;
                            case 37: //left
                            case 27: //esc
                                handled = true;
                                if (keyCode === 37 && $this.parent().hasClass("a11yfy-top-level-menu")) {
                                    prevInMenu();
                                } else {
                                    if ($this.parent().attr("role") === "menu") {
                                        // this is part of a submenu, set focus on containing li
                                        $this.parent().parent().attr("tabindex", "0").focus();
                                        $this.parent().removeClass("open").attr("aria-expanded", "false");
                                        $this.attr("tabindex", "-1");
                                    } else {
                                        if ($this.prev().length) {
                                            $this.prev().attr("tabindex", "0").focus();
                                        } else {
                                            $this.parent().find("li").last().attr("tabindex", "0").focus();
                                        }
                                        $this.attr("tabindex", "-1");
                                    }
                                }
                                break;
                            case 38: //up
                                handled = true;
                                if ($this.parent().hasClass("a11yfy-top-level-menu")) {
                                    openMenu();
                                } else {
                                    prevInMenu();
                                }
                                break;
                            case 39: //right
                                handled = true;
                                if ($this.parent().hasClass("a11yfy-top-level-menu")) {
                                    nextInMenu();
                                } else {
                                    openMenu();
                                }
                                break;
                            case 40: //down
                                handled = true;
                                if ($this.parent().hasClass("a11yfy-top-level-menu")) {
                                    openMenu();
                                } else {
                                    nextInMenu();
                                }
                                break;
                            default:
                                break;
                        }
                        if (handled) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }).on("click", function() {
                        var $submenu = jQuery(this).find(">ul").first();

                        if ($submenu.is(":hidden")) {
                            $submenu.addClass("open").attr("aria-expanded", "true");
                        } else {
                            $submenu.removeClass("open").attr("aria-expanded", "false");
                        }
                    }).first().attr("tabindex", "0");
                    $this.on("keydown", function (e) {
                        var focusInTopMenu = false,
                            keyCode = e.which || e.keyCode;

                        if (e.ctrlKey || e.altKey || e.metaKey) {
                            // not interested
                            return;
                        }
                        if (keyCode !== 9) {
                            return;
                        }
                        $this.find(">li").each(function(index, value) {
                            if (jQuery(value).attr("tabindex") === "0") {
                                focusInTopMenu = true;
                            }
                        });
                        if (!focusInTopMenu) {
                            $this.find(">li li[tabindex=0]").attr("tabindex", "-1");
                            $this.find("ul.open").each(function(index, value) {
                                if (jQuery(value).parent().parent().hasClass("a11yfy-top-level-menu")) {
                                    jQuery(value).parent().attr("tabindex", "0");
                                }
                            }).removeClass("open").attr("aria-expanded", "false");
                        }
                    });
                });
            }
        },
        ua = window.navigator.userAgent,
        platform = ua.match(/iPhone|iPad|iPod/) ? "iOS" :
                    ua.match(/Mac OS X/) ? "OSX" :
                    ua.match(/Windows/) ? "Windows" : "Other";
    
    jQuery.a11yfy = function () {} ;

    jQuery.fn.a11yfy = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1 ));
        } else {
            jQuery.error("Method " +  method + " does not exist on jQuery.a11yfy");
        }
    };

    jQuery.a11yfy.getI18nString = function(str, values, strings) {
        var msg = strings[str], v;

        if (values) {
            for (v in values) {
                msg = msg.replace("${"+v+"}", values[v]);
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
