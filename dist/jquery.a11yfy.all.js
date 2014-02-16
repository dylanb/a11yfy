/**
 *
 * jQuery module for accessibility
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2013, 2014 Dylan Barrell
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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
            validate : function(options) {
                var opts = jQuery.extend({}, jQuery.fn.a11yfy.defaults.validate, options);
                return this.each(function (index, value) {

                    function errorPlacement() {
                        // do nothing - overrides default behavior
                    }
                    function showErrors() {
                        // do nothing - overrides default behavior
                    }

                    function invalidHandler(event, validator) {
                        var id, invalidIds = [],
                            $this = jQuery(this),
                            $errorSummary = $this.find(".a11yfy-error-summary"),
                            $errorSummaryList = jQuery("<ul>");

                        for (id in validator.invalid) {
                            if (validator.invalid.hasOwnProperty(id)) {
                                invalidIds.push(id);
                            }
                        }

                        // remove any previous validation markup
                        $this.find("a.a11yfy-skip-link").remove(); // remove all the old skip links
                        $this.find(".a11yfy-validation-error").removeClass("a11yfy-validation-error"); // Remove old validation errors
                        $this.find(".a11yfy-error-message").remove(); // remove the old error messages
                        $errorSummary.empty();

                        jQuery(invalidIds).each(function(index, invalidId) {
                            var $input = jQuery("#"+invalidId),
                                $label = jQuery("label[for=\"" + invalidId + "\"]"),
                                $next, $span;
                            $label.addClass("a11yfy-validation-error");
                            $input.addClass("a11yfy-validation-error");

                            // create the summary entry
                            $errorSummaryList.append("<li><a class=\"a11yfy-skip-link a11yfy-summary-link\" href=\"#" + invalidId + "\">" + $label.text() + "</a>"  + " : " + validator.invalid[invalidId] + "</li>");

                            // add link to the next field with a validation error
                            if (index < (invalidIds.length - 1) && opts.skipLink) {
                                $next = jQuery("<a href=\"#\" class=\"a11yfy-skip-link\">");
                                $next.text(jQuery.a11yfy.getI18nString("skipToNextError", undefined, jQuery.fn.a11yfy.defaults.strings));
                                $next.attr("href", "#" + invalidIds[index+1]);
                                if ($input.parent()[0].nodeName === "P") {
                                    $input.parent().after($next);
                                } else {
                                    $input.after($next);
                                }
                            }

                            // Add the error message into the label
                            $span = jQuery("<span class=\"a11yfy-error-message\">");
                            $span.text(" - " + validator.invalid[invalidId]);
                            $label.append($span);
                        });
                        if (opts.summary) {
                            // Add the summary to the document
                            $errorSummary.append($errorSummaryList);
                        }
                    }
                    var $this = jQuery(value),
                        vOptions = jQuery.extend({}, opts.validatorOptions, {
                                invalidHandler : invalidHandler,
                                errorPlacement : errorPlacement,
                                showErrors : showErrors
                            });

                    $this.validate(vOptions);
                    if (opts.skipLink) {
                        $this.delegate("a.a11yfy-skip-link", "click", function(e) {
                            var $target = jQuery(e.target);

                            jQuery($target.attr("href")).select().focus();
                            e.preventDefault();
                            e.stopPropagation();
                        });
                    }
                    $this.children().first().before(
                        jQuery("<div class=\"a11yfy-error-summary\" role=\"alert\" aria-live=\"assertive\">")
                    );
                    // Add the aria-required attributes to all the input elements that have the required
                    // attribute
                    $this.find("[required]").attr("aria-required", "true");
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
                    /* Set the roles for the menubar */
                    $this.attr("role", "menubar").addClass("a11yfy-top-level-menu");
                    /* set the aria attributes and the classes for the sub-menus */
                    $this.find(">li>ul")
                        .addClass("a11yfy-second-level-menu")
                        .parent()
                            .addClass("a11yfy-has-submenu")
                            .attr("aria-haspopup", "true")
                            .attr("aria-expanded", "false");
                    $this.find(">li>ul>li>ul")
                        .addClass("a11yfy-third-level-menu")
                        .parent()
                            .addClass("a11yfy-has-submenu")
                            .attr("aria-haspopup", "true")
                            .attr("aria-expanded", "false");
                    /*
                     * Set up the keyboard and mouse handlers for all the individual menuitems
                     */
                    $this.find("li").each(function(index, value) {
                        /* Set the roles for the sub-menus and the menuitems */
                        var $this = jQuery(value);

                        $this.attr({
                            "role": "menuitem",
                            "tabindex": "-1"
                        });
                        $this.find("ul").each(function(index, value) {
                            jQuery(value).attr("role", "menu");
                        });

                    }).on("keypress", function(e) {
                        /*
                         * This implements the WAI-ARIA-PRACTICES keyboard functionality where
                         * pressing the key, corresponding to the first letter of a VISIBLE element
                         * will move the focus to the first such element after the currently focussed
                         * element
                         */
                        var keyCode = e.charCode || e.which || e.keyCode,
                            keyString = String.fromCharCode(keyCode).toLowerCase(),
                            ourIndex = -1,
                            currentItem = this,
                            $this = jQuery(this),
                            $nextItem, $prevItem,
                            $menuitems = $menu.find("li[role=\"menuitem\"]:visible");

                        $menuitems.each(function(index, value) {
                            if (value === currentItem) {
                                ourIndex = index;
                            }
                            if (index > ourIndex && !$nextItem) {
                                if (jQuery(value).text().trim().toLowerCase().indexOf(keyString) === 0) {
                                    if (ourIndex !== -1) {
                                        $nextItem = jQuery(value);
                                    } else if (!$prevItem) {
                                        $prevItem = jQuery(value);
                                    }
                                }
                            }
                        });
                        if (!$nextItem && $prevItem) {
                            $nextItem = $prevItem;
                        }
                        if ($nextItem) {
                            $nextItem.attr("tabindex", "0").focus();
                            $this.attr("tabindex", "-1");
                            if ($nextItem.parent().get(0) !== $this.parent().get(0)) {
                                $this.parent().parent("li").removeClass("open").attr("aria-expanded", "false");
                            }
                        }
                        e.stopPropagation();
                    }).on("keydown", function(e) {
                        /*
                         * This implements the WAI-ARIA-PRACTICES keyboard navigation functionality
                         */
                        var keyCode = e.which || e.keyCode,
                            handled = false,
                            $this = jQuery(this);

                        if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
                            // not interested
                            return;
                        }
                        /*
                         * Open a sub-menu and place focus on the first menuitem within it
                         */
                        function openMenu() {
                            if($this.hasClass("a11yfy-has-submenu")) {
                                $this.addClass("open").attr("aria-expanded", "true").find(">ul>li:visible").first().attr("tabindex", "0").focus();
                                $this.attr("tabindex", "-1");
                            }
                        }
                        /*
                         * Move the focus to the menuitem preceding the current menuitem
                         */
                        function prevInMenu() {
                            var $context = $this;
                            $this.attr("tabindex", "-1");
                            while (true) {
                                if ($context.prev().is(':visible')) {
                                    $context.prev().attr("tabindex", "0").focus();
                                    return
                                }
                                $context = $context.prev();
                                if (!$context.prev().length) {
                                    $context =  $this.parent().find(">li").last();
                                    if ($context.is(':visible')) {
                                        $context.attr("tabindex", "0").focus();
                                        return
                                    }
                                }
                                if ($context[0] === $this[0]) {
                                    $this.attr("tabindex", "0")
                                    break;
                                }
                            }
                        }
                        /*
                         * Move the focus to the next menuitem after the currently focussed menuitem
                         */
                        function nextInMenu() {
                            var $context = $this;
                            $this.attr("tabindex", "-1");
                            while (true) {
                                if ($context.next().is(':visible')) {
                                    $context.next().attr("tabindex", "0").focus();
                                    return
                                }
                                $context = $context.next();
                                if (!$context.next().length) {
                                    $context = $this.parent().find(">li").first();
                                    if ($context.is(':visible')) {
                                        $context.attr("tabindex", "0").focus();
                                        return
                                    }
                                }
                                if ($context[0] === $this[0]) {
                                    $this.attr("tabindex", "0")
                                    break;
                                }
                            }
                        }
                        switch(keyCode) {
                            case 32: // space
                            case 13: // enter
                                handled = true;
                                if ($this.find(">a").length) {
                                    if ($this.find(">a")[0].click) {
                                        /* If this is a leaf node, activate it*/
                                        $this.find(">a")[0].click();
                                    } else {
                                        // This is a hack for PhantomJS
                                        $this.find(">a").first().trigger("click");
                                    }
                                } else {
                                    /* If it has a sub-menu, open the sub-menu */
                                    openMenu();
                                }
                                break;
                            case 37: //left
                            case 27: //esc
                                handled = true;
                                if (keyCode === 37 && $this.parent().hasClass("a11yfy-top-level-menu")) {
                                    /* If in the menubar, then simply move to the previous menuitem */
                                    prevInMenu();
                                } else {
                                    if ($this.parent().attr("role") === "menu") {
                                        // this is part of a submenu, set focus on containing li
                                        $this.parent().parent().attr("tabindex", "0").focus()
                                            .removeClass("open").attr("aria-expanded", "false");
                                        $this.attr("tabindex", "-1");
                                    }
                                }
                                break;
                            case 38: //up
                                handled = true;
                                if ($this.parent().hasClass("a11yfy-top-level-menu")) {
                                    /* If in the menubar, then open the sub-menu */
                                    openMenu();
                                } else {
                                    /* If in sub-menu, move to previous element */
                                    prevInMenu();
                                }
                                break;
                            case 39: //right
                                handled = true;
                                if ($this.parent().hasClass("a11yfy-top-level-menu")) {
                                    /* If in menubar, move to next menuitem */
                                    nextInMenu();
                                } else {
                                    /* If in sub-menu, open sub-sub-menu */
                                    openMenu();
                                }
                                break;
                            case 40: //down
                                handled = true;
                                if ($this.parent().hasClass("a11yfy-top-level-menu")) {
                                    /* If in menubar, open sub-menu */
                                    openMenu();
                                } else {
                                    /* If in sub-menu, move to the next menuitem */
                                    nextInMenu();
                                }
                                break;
                        }
                        if (handled) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }).on("click", function() {
                        var $this = jQuery(this);

                        if (!$this.hasClass("open")) {
                            $this.addClass("open").attr("aria-expanded", "true");
                        } else {
                            $this.removeClass("open").attr("aria-expanded", "false");
                        }
                    }).first().attr("tabindex", "0"); // Make the first menuitem in the menubar tab focussable
                    $this.on("keydown", function (e) {
                        /*
                         * This callback handles the tabbing out of the widget
                         */
                        var focusInTopMenu = false,
                            keyCode = e.which || e.keyCode;

                        if (e.ctrlKey || e.altKey || e.metaKey) {
                            // not interested
                            return;
                        }
                        if (keyCode !== 9) {
                            return;
                        }
                        /* Find out whether we are currently in the menubar */
                        $this.find(">li").each(function(index, value) {
                            if (jQuery(value).attr("tabindex") === "0") {
                                focusInTopMenu = true;
                            }
                        });
                        if (!focusInTopMenu) {
                            /*
                             * If not in the menubar, close sub-menus and set the tabindex of the top item in the
                             * menubar so it receives focus when the user tabs back into the menubar
                             */
                            $this.find(">li li[tabindex=0]").attr("tabindex", "-1");
                            $this.find("li.open").each(function(index, value) {
                                if (jQuery(value).parent().hasClass("a11yfy-top-level-menu")) {
                                    jQuery(value).attr("tabindex", "0");
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

    jQuery.fn.a11yfy.defaults = {
        strings : {
            skipToNextError: "skip to next field with an error"
        },
        validate : {
            skipLink : true,
            summary : true,
            validatorOptions : {}
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
;/**
 *
 * jQuery module for accessible data tables
 *
 * Copyright (C) 2013 Dylan Barrell. All Rights Reserved as specified in the LICENSE file
 *
 */

(function (jQuery){
    var methods;

    methods = {
        init: function (options) {
            var opts = jQuery.extend({}, jQuery.fn.tables.defaults, options);
            return this.each(function () {
                var $table = jQuery(this),
                    $anchors, data, $select, cellIndex, dimensions, newDimensions, resizeTimer, headers;

                function anchorClickHandler(e) {
                    var $this = jQuery(this),
                        sorted = $this.attr("data-sorted"),
                        direction = "asc",
                        index = this.parentNode.cellIndex,
                        $span = $this.find("span.offscreen"),
                        msg;

                    if (sorted) {
                        direction = (sorted === "asc" ? "desc" : "asc");
                    }
                    // reset all the previous sorting
                    $anchors.removeAttr("data-sorted");
                    sortTableData(data, direction, index);
                    redrawTable($table, data);
                    $this.attr("data-sorted", direction);
                    // Reset the offscreen text
                    $span.text("");
                    // Make announcement
                    if (direction === "asc") {
                        msg = jQuery.a11yfy.getI18nString("tableSortedAscending", {
                            column: $this.text()
                        }, jQuery.fn.tables.defaults.strings);
                    } else {
                        msg = jQuery.a11yfy.getI18nString("tableSortedDescending", {
                            column: $this.text()
                        }, jQuery.fn.tables.defaults.strings);
                    }
                    jQuery.a11yfy.politeAnnounce(msg);
                    // Set the offscreen text
                    setSortedText($span, $this);
                    e.preventDefault();
                }

                function selectChangeHandler() {
                    var $this = jQuery(this),
                        val = $this.val(),
                        $anchor = $this.parent().find("a"),
                        cellIndex = this.parentNode.cellIndex,
                        msg;

                    jQuery(data).each(function (index, value) {
                        if (val+"" === value[cellIndex]+"" || val === "__none__") {
                            value[value.length-1].show();
                        } else {
                            value[value.length-1].hide();
                        }
                    });
                    // Make announcement
                    msg = jQuery.a11yfy.getI18nString("tableFilteredOnAndBy", {
                        column: $anchor.text(),
                        value: (val === "__none__" ? jQuery.a11yfy.getI18nString("all") : val)
                    }, jQuery.fn.tables.defaults.strings);
                    jQuery.a11yfy.politeAnnounce(msg);

                    $this.hide();
                    $anchor.show().focus();
                }

                if (opts.sortFilter !== "none") {
                    if (opts.responsive) {
                        throw new Error("responsive and sortFilter are mutually exclusive options because sortFilter implies a data table with row data and responsive implies columnar data");
                    }
                    $table.find("th").each(function (index, value) {
                        var $this = jQuery(value);

                        if ($this.attr("data-filter") &&
                            (opts.sortFilter === "both" || opts.sortFilter === "filter")) {
                            $this.wrapInner("<a href=\"#\" data-filter=\"true\">");
                        } else if (!$this.attr("data-filter") && (opts.sortFilter === "both" || opts.sortFilter === "sort")) {
                            $this.wrapInner("<a href=\"#\">");
                        }
                    });

                    $anchors = $table.find("th a");
                    data = getTableData($table);
                    $anchors.each( function (index, anchor) {
                        var $anchor = jQuery(anchor),
                            timeout;

                        function anchorFocusHandler(e) {
                            var $this = jQuery(this),
                                $span;

                            if ($this.attr("data-filter")) {
                                if (timeout) {
                                    clearTimeout(timeout);
                                    timeout = undefined;
                                }
                                $select = $this.parent().find("select");
                                cellIndex = $this.parent().get(0).cellIndex;
                                if (!$select.length) {
                                    $select = jQuery("<select>").attr("aria-label", $this.text() + jQuery.a11yfy.getI18nString("filterable", undefined, jQuery.fn.tables.defaults.strings));
                                    $select.append(jQuery("<option>").attr("value", "__none__").attr("label", jQuery.a11yfy.getI18nString("all", undefined, jQuery.fn.tables.defaults.strings)));
                                    jQuery(data).each(function (index, value) {
                                        $select.append(jQuery("<option>").text(value[cellIndex]));
                                    });
                                    $this.parent().append($select);
                                    $select.bind("mouseover focus", selectFocusHandler)
                                        .bind("mouseout blur", selectBlurHandler)
                                        .bind("change", selectChangeHandler);
                                } else {
                                    $select.show();
                                }
                                if (e.type === "focus") {
                                    $select.focus();
                                }
                                $this.hide();
                            } else {
                                $span = $this.find("span.offscreen");
                                if (!$span.length) {
                                    $span = jQuery("<span class=\"offscreen\">");
                                    $this.append($span);
                                }
                                setSortedText($span, $this);
                            }

                        }

                        function anchorBlurHandler() {
                            var $this = jQuery(this), $span;

                            if (!$this.attr("data-filter")) {
                                $span = $this.find("span.offscreen");
                                $span.empty().text("");
                            }
                        }

                        function selectFocusHandler() {
                            if (timeout) {
                                clearTimeout(timeout);
                                timeout = undefined;
                            }
                        }

                        function selectBlurHandler() {
                            var $this = jQuery(this);
                            timeout = setTimeout(function () {
                                $this.hide();
                                $this.parent().find("a").show();
                            }, 500);
                        }

                        $anchor.bind("click", anchorClickHandler)
                            .bind("focus mouseover", anchorFocusHandler)
                            .bind("blur mouseout", anchorBlurHandler);
                    });
                    if ((opts.sortFilter === "both" || opts.sortFilter === "sort")) {
                        $anchors.first().click();
                    }
                } else if (opts.responsive && !opts.responsive.rowBased) {
                    // table must have a thead and a tbody
                    if (!$table.find("tbody").length) {
                        throw new Error("Columnar responsive table must have a tbody");
                    }
                    if (!$table.find("thead").length) {
                        throw new Error("Columnar responsive table must have a thead");
                    }
                    data = getTableData($table);
                    headers = getTableHeaders($table);
                    dimensions = getDimensions();
                    drawTable( $table, data, headers, dimensions, opts);
                    jQuery(window).on("resize", function () {
                        newDimensions = getDimensions();
                        if (!equalDimensions(newDimensions, dimensions)) {
                            if (resizeTimer) {
                                clearTimeout(resizeTimer);
                                resizeTimer = undefined;
                            }
                            dimensions = newDimensions;
                            resizeTimer = setTimeout(function () {
                                drawTable( $table, data, headers, newDimensions, opts);
                            }, 50);
                        }
                    });
                    if (opts.responsive.css) {
                        jQuery("body").append(
                            jQuery("<style>\n" +
                                jQuery.a11yfy.getI18nString("cssString", {breakPoint:opts.responsive.breakPoint}, jQuery.fn.tables.defaults.css) +
                                "</style>"));
                    }
                } else if (opts.responsive && opts.responsive.rowBased) {
                    if (!opts.responsive.css) {
                        throw new Error("css must be used in conjunction with rowBased");
                    }
                    jQuery("body").append(
                        jQuery("<style>\n" +
                            jQuery.a11yfy.getI18nString("cssString", {breakPoint:opts.responsive.breakPoint}, jQuery.fn.tables.defaults.css) +
                            "</style>"));
                    if (!$table.find("thead").length) {
                        $table.children().first().before(jQuery("<thead></thead>"));
                    }
                    if (!$table.find("tbody").length) {
                        $table.find("thead").after(jQuery("<tbody></tbody>"));
                        $table.find("tbody").append($table.find("tr"));
                    }
                }
            });
        }
    };

    function drawSmartPhoneTable(data, headers) {
        var html = "<thead></thead>", i, _ilen, j, _jlen;
        for (i = 0, _ilen = data[0].length - 1; i < _ilen; i++) {
            html += "<tr>";
            if (headers) {
                html += "<th scope=\"row\">" + headers[i] + "</th>";
            }
            for (j = 0, _jlen = data.length; j < _jlen; j++) {
                html += "<td>" + data[j][i] + "</td>";
            }
            html += "</tr>";
        }
        return html;
    }

    function drawDesktopTable(data, headers) {
        var html = "", i, _ilen, j, _jlen;
        if (headers) {
            html += "<tr>";
            jQuery(headers).each(function (index, value) {
                html += "<th scope=\"col\">" + value + "</th>";
            });
            html += "</tr>";
        }
        for (j = 0, _jlen = data.length; j < _jlen; j++) {
            html += "<tr>";
            for (i = 0, _ilen = data[0].length - 1; i < _ilen; i++) {
                html += "<td>" + data[j][i] + "</td>";
            }
            html += "</tr>";
        }
        return html;
    }

    function isSmartPhone(dimensions, breakPoint) {
        if (dimensions.width <= breakPoint) {
            return true;
        }
        return false;
    }

    function drawTable($table, data, headers, dimensions, options) {
        if (isSmartPhone(dimensions, options.responsive.breakPoint)) {
            $table.html(drawSmartPhoneTable(data, headers));
        } else {
            $table.html(drawDesktopTable(data, headers));
        }
    }

    function getDimensions() {
        var retVal = { width: 0, height: 0};
        retVal.width = window.innerWidth-1;
        retVal.height = window.innerHeight;
        return retVal;
    }

    function equalDimensions(first, second) {
        if (first.width === second.width && first.height === second.height) {
            return true;
        }
        return false;
    }

    function getSortedText($this) {
        var sorted = $this.attr("data-sorted");
        return (sorted === "asc" ? jQuery.a11yfy.getI18nString("sortableSortedAscending", undefined, jQuery.fn.tables.defaults.strings) :
                (sorted === "desc" ? jQuery.a11yfy.getI18nString("sortableSortedDescending", undefined, jQuery.fn.tables.defaults.strings) :
                jQuery.a11yfy.getI18nString("sortableNotSorted", undefined, jQuery.fn.tables.defaults.strings)));
    }

    function getTableData($table) {
        var retVal = [];
        $table.find("tbody tr").each(function (index, value) {
            var $this = jQuery(value), row = [];
            $this.find("td").each(function (index, td) {
                var text = jQuery.trim(jQuery(td).text()),
                    intNum, flt;

                intNum = parseInt(text, 10);
                flt = parseFloat(text);
                if (intNum.toString() === text) {
                    row.push(intNum);
                } else if (flt.toString() === text) {
                    row.push(flt);
                } else {
                    row.push(text);
                }
            });
            row.push($this); // put the row into the data so we can manipulate
            retVal.push(row);
        });
        return retVal;
    }
    function getTableHeaders($table) {
        var retVal = [];
        $table.find("tr").first().find("th").each(function (index, value) {
            var $this = jQuery(value);
            retVal.push($this.text());
        });
        return retVal;
    }

    function sortTableData(data, direction, index) {
        data.sort(function (first, second) {
            if (typeof first[index] !== typeof second[index]) {
                if (typeof first[index] === "string") {
                    return (direction === "asc" ? -1 : 1);
                } else if (typeof second[index] === "string") {
                    return (direction === "asc" ? 1 : -1);
                }
            }
            return first[index] < second[index] ? (direction === "asc" ? -1 : 1) :
                    ( first[index] > second[index] ? (direction === "asc" ? 1 : -1) : 0);
        });
    }
    function redrawTable($table, data) {
        var $tbody = $table.find("tbody");
        jQuery(data).each(function (index, value) {
            $tbody.append(value[value.length - 1]);
        });
    }
    function setSortedText($span, $this) {
        $span.text(getSortedText($this));
    }

    // add the jquery instance method
    jQuery.fn.tables = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1 ));
        } else if (typeof method === "object" || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            jQuery.error("Method " +  method + " does not exist on jQuery.tables");
        }
    };

    jQuery.fn.tables.defaults = {
        sortFilter: "both",
        strings : {
            sortableSortedAscending: " Sortable, Sorted Ascending",
            sortableNotSorted: " Sortable, Not Sorted",
            sortableSortedDescending: " Sortable, Sorted Descending",
            filterable: ", Filterable",
            all: "All",
            tableSortedAscending: "Table sorted by ${column}, Ascending",
            tableSortedDescending: "Table sorted by ${column}, Descending",
            tableFilteredOnAndBy: "Table filtered on ${column}, by ${value}"
        },
        css : {
              cssString: "@media\n" +
              "(max-width: ${breakPoint}px) {\n" +
                "/* Force table to not be like tables anymore but still be navigable as a table */\n" +
                "table, thead, tbody, tr {\n" +
                  "width: 100%;\n" +
                "}\n" +

                "td, th {\n" +
                  "display: block;\n" +
                "}\n" +

                "/* Hide table headers with display: none because accessibility APIs do not pick up reliably on these headers anyway */\n" +
                "thead tr {\n" +
                  "display:none;\n" +
                "}\n" +

                "tr { border: 1px solid #ccc; }\n" +

                "td, th {\n" +
                  "/* Behave  like a \"row\" */\n" +
                  "border: none;\n" +
                  "border-bottom: 1px solid #eee;\n" +
                  "position: relative;\n" +
                "}\n" +

                "td:before, th:before {\n" +
                  "/* Now like a table header */\n" +
                  "position: absolute;\n" +
                  "/* Top/left values mimic padding */\n" +
                  "top: 6px;\n" +
                  "left: 6px;\n" +
                  "width: 45%;\n" +
                  "padding-right: 10px;\n" +
                  "white-space: nowrap;\n" +
                "}\n" +
              "}\n"
        }
    };
})(jQuery);
