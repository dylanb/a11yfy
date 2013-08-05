/**
 *
 * jQuery module for accessible data tables
 *
 * Copyright (C) 2013 Dylan Barrell. All Rights Reserved as specified in the LICENSE file
 *
 */
(function (jQuery){
    var methods,
        $politeAnnouncer = jQuery("#jquery-ui-politeannouncer");

    methods = {
        init: function (options) {
            var opts = jQuery.extend({}, jQuery.fn.tables.defaults, options);
            return this.each(function () {
                var $table = jQuery(this),
                    $anchors, data, timeout, $select, cellIndex;

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
                    msg = "Table sorted by " + $this.text() + ", " + (direction === "asc" ? "Ascending" : "Descending");
                    jQuery.fn.tables.politeAnnounce(msg);
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
                    msg = "Table filtered on " + $anchor.text() + ", by " + (val === "__none__" ? "All" : val);
                    jQuery.fn.tables.politeAnnounce(msg);

                    $this.hide();
                    $anchor.show().focus();
                }

                if (opts.sortFilter !== "none") {
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
                                    $select = jQuery("<select>").attr("aria-label", $this.text() + ", Filterable");
                                    $select.append(jQuery("<option>").attr("value", "__none__").attr("label", "All"));
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
                }
            });
        },
        destroy: function () {
            return this.each(function () {
                // Do something
            });
        }
    };

    function getSortedText($this) {
        var sorted = $this.attr("data-sorted");
        return "Sortable" +
                (sorted === "asc" ? ", Sorted Ascending" :
                (sorted === "desc" ? ", Sorted Descending" :
                ", Not Sorted"));
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
            jQuery.error("Method " +  method + " does not exist on jQuery.slider");
        }
    };

    jQuery.fn.tables.defaults = {
        sortFilter: "both"
    };

    jQuery.fn.tables.politeAnnounce = function (msg) {
        $politeAnnouncer.append(jQuery("<p>").text(msg));
    };

    // Add the polite announce div to the page
    if (!$politeAnnouncer || !$politeAnnouncer.length) {
        jQuery(document).ready(function () {
            $politeAnnouncer = jQuery("<div>").attr({
                    "id": "jquery-ui-politeannounce",
                    "role": "log",
                    "aria-live": "polite",
                    "aria-relevant": "additions"
                }).addClass("offscreen");
            jQuery("body").append($politeAnnouncer);
        });
    }
})(jQuery);
