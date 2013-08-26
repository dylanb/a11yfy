/**
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
                    if (opts.responsiveColumns) {
                        throw "responsiveColumns and sortFilter are mutually exclusive options because sortFilter implies a data table with row data and responsiveColumns implies columnar data";
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
                } else if (opts.responsiveColumns) {
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
                    if (opts.responsiveColumns.css) {
                        jQuery("body").append(
                            jQuery("<style>\n" +
                                jQuery.a11yfy.getI18nString("cssString", {breakPoint:opts.responsiveColumns.breakPoint}, jQuery.fn.tables.defaults.css) +
                                "</style>"));
                    }
                }
            });
        },
        destroy: function () {
            return this.each(function () {
                // Do something
            });
        }
    };

    function drawSmartPhoneTable(data, headers) {
        var html = "", i, _ilen, j, _jlen;
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
        if (isSmartPhone(dimensions, options.responsiveColumns.breakPoint)) {
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
