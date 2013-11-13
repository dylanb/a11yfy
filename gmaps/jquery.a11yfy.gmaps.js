/**
 *
 * jQuery module for accessibility
 *
 * Copyright (C) 2013 Dylan Barrell. All Rights Reserved as specified in the LICENSE file
 *
 */
(function (jQuery) {
    var timeout;

    // Add the focus styles
    jQuery(document).ready(function () {
        var styleNode = document.createElement("style");

        styleNode.innerHTML = ".gm-style :focus { outline : dotted 2px black !important; box-shadow: inset 0 0 1em black; }";
        document.body.appendChild(styleNode);
    });

    /*
     * Get the absolute coordinates of an element on the page
     */
    function getElementCoordinates(node) {
        var coords = {
            "top": 0, "right": 0, "bottom": 0, "left": 0, "width": 0, "height": 0
        },
        xOffset, yOffset, rect;

        if (node) {
            xOffset = window.scrollX;
            yOffset = window.scrollY;
            rect = node.getBoundingClientRect();

            coords = {
                "top": rect.top + yOffset,
                "right": rect.right + xOffset,
                "bottom": rect.bottom + yOffset,
                "left": rect.left + xOffset,
                "width": rect.right - rect.left,
                "height": rect.bottom - rect.top
            };
        }
        return coords;
    }
    /*
     *
     */
    function mapTitleToButton(title) {
        var titleMaps = {
            /* English */
            "Click to zoom" : "C2Z",
            "Drag to zoom" : "D2Z",
            "Show street map" : "SSM",
            "Show satellite imagery" : "SSI",
            "Show street map with terrain" : "SSMWT",
            "Show imagery with street names" : "SIWSN",
            /* German */
            "Klicken zum Zoomen" : "C2Z",
            "Ziehen zum Zoomen" : "D2Z",
            "Stadtplan anzeigen" : "SSM",
            "Satellitenbilder anzeigen" : "SSI",
            "Stadtplan mit Gelände anzeigen" : "SSMWT",
            "Satellitenbilder mit Straßennamen anzeigen" : "SIWSN"
        }
        if (titleMaps[title]) {
            return titleMaps[title];
        }
        return title;
    }
    /*
     * This set of functions (isDisplayNone, fireMouseOvers, fireMouseover,
     * fireMouseOuts and fireMouseOut) is here to handle the mouseover and mouseout
     * events that cause the "menus" to pop down from the action buttons
     * The display calculations is here to handle the correct hiding of the
     * pop downs
     */
    function isDisplayNone(el) {
        var styl = window.getComputedStyle(el);
        if (styl.display === 'none') {
            return true;
        }
        return false;
    }
    function fireMouseOver(e) {
        var evt, coords;

        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
        evt = document.createEvent("MouseEvent");
        coords = getElementCoordinates(e.target);
        evt.initMouseEvent( "mouseover", true, true, window, 1, 0, 0, 1, 1,
            false, false, false, false, 0, null);
        e.target.dispatchEvent(evt);
    }
    function fireMouseOut(e) {
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
        timeout = setTimeout(function () {
            var evt, coords;

            timeout = undefined;
            evt = document.createEvent("MouseEvent");
            coords = getElementCoordinates(e.target);
            evt.initMouseEvent( "mouseout", true, true, window, 1, 0, 0, 1, 1,
                false, false, false, false, 0, null);
            e.target.dispatchEvent(evt);
        }, 100);
    }
    var methods = {
        init: function() {
            this.each(function(index, value) {
                var pButtons = [];

                function fireMouseOvers(e) {
                    var i;
                    for (i = pButtons.length; i--;) {
                        if (isDisplayNone(pButtons[i].nextSibling)) {
                            fireMouseOver({target: pButtons[i]});
                        }
                    }
                }
                function fireMouseOuts(e) {
                    var i;
                    for (i = pButtons.length; i--;) {
                        if (!isDisplayNone(pButtons[i].nextSibling)) {
                            fireMouseOut({target: pButtons[i]});
                        }
                    }
                }
                function fixMap(node) {
                    var mapButtons, nodes, i, title,
                        sliderButton,
                        sliderRange, sliderMin, sliderMax, sliderCurrent,
                        sliderIncrement,
                        currentSliderSlot;

                    mapButtons = document.querySelectorAll('.gmnoprint div[title]');
                    if (!mapButtons.length) {
                        // If the map has not yet been drawn, wait
                        setTimeout(fixMap, 100);
                        return;
                    }
                    for (i = mapButtons.length;i--;) {
                        title = mapTitleToButton(mapButtons[i].getAttribute('title'));
                        if (title !== "C2Z" && title !== "D2Z") {
                            /*
                             * All elements except the slider and its background
                             * Will be made keybord operable
                             */
                            mapButtons[i].setAttribute('role', 'button');
                            mapButtons[i].setAttribute('tabindex', '0');
                            mapButtons[i].setAttribute('aria-label', title);
                            google.maps.event.addDomListener(mapButtons[i], 'keydown', function (e) {
                                e = e || event;
                                var keyCode = e.which || e.keyCode;
                                if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
                                    return;
                                }
                                if (keyCode === 32 || keyCode === 13) {
                                    e.target.click();
                                }
                            });
                        } else if (title === "D2Z") {
                            /*
                             * The slider button
                             */
                            // set role, state and value
                            sliderButton = mapButtons[i];
                            sliderButton.setAttribute('tabindex', '0');
                            sliderButton.setAttribute('role', 'slider');
                            sliderButton.setAttribute('aria-valuemax', '100');
                            sliderButton.setAttribute('aria-valuemin', '0');
                            sliderButton.setAttribute('aria-orientation', 'vertical');
                            sliderMin = 20;
                            sliderMax = 188;
                            sliderIncrement = (sliderMax - sliderMin) / 10;
                            sliderCurrent = parseInt(sliderButton.style.top, 10) - sliderMin;
                            currentSliderSlot = 10 -
                                Math.floor((((sliderCurrent) / (sliderMax - sliderMin)) * 100) / 10 - 0.5);
                            sliderButton.setAttribute('aria-valuenow', (currentSliderSlot - 1) * 10);

                            // Now set keyboard handlers to maintain state and value as user operates it
                            google.maps.event.addDomListener(sliderButton, 'keydown', function (e) {
                                e = e || event;
                                var keyCode = e.which || e.keyCode,
                                    move = false;
                                if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
                                    return;
                                }
                                if (keyCode === 38) { // up
                                    if (currentSliderSlot < 11) {
                                        currentSliderSlot += 1;
                                        move = true;
                                    }
                                    e.preventDefault();
                                } else if (keyCode === 40) { //down
                                    if (currentSliderSlot >= 0) {
                                        currentSliderSlot -= 1;
                                        move = true;
                                    }
                                    e.preventDefault();
                                }
                                if (move) {
                                    // simulate mouse click to move the slider to the correct position
                                    coords = getElementCoordinates(sliderRange);
                                    evt = document.createEvent("MouseEvent");
                                    evt.initMouseEvent( "click", true, true, window, 1, 0, 0, 1,
                                        coords.top + ((10 - currentSliderSlot) * sliderIncrement) + sliderMin,
                                        false, false, false, false, 0, null);
                                    sliderRange.dispatchEvent(evt);
                                    sliderButton.setAttribute('aria-valuenow', (currentSliderSlot - 1) * 10);
                                }
                            });
                        } else if (title === "C2Z") {
                            /* Fetch the slider background */
                            sliderRange = mapButtons[i];
                        }
                        /*
                         * Attach event handlers for pop-downs
                         */
                        if (title === "SSM" || title === "SSI") {
                            /*
                             * For the "Map" and "Satellite" buttons with popups,
                             * simulate the mouseover and mouseout on focus to and blur to
                             * allow the popup menus to be activated
                             */
                            google.maps.event.addDomListener(mapButtons[i], 'focus', fireMouseOvers);
                            google.maps.event.addDomListener(mapButtons[i], 'click', fireMouseOver);
                            google.maps.event.addDomListener(mapButtons[i], 'blur', fireMouseOuts);
                            pButtons.push(mapButtons[i]);
                        } else if (title === "SSMWT" || title === "SIWSN") {
                            /* simulate the mouseover and mouseout on focus and blur for the popups */
                            google.maps.event.addDomListener(mapButtons[i], 'focus', fireMouseOvers);
                            google.maps.event.addDomListener(mapButtons[i], 'blur', fireMouseOuts);
                        }
                    }
                    // Fix the images without alt attributes
                    nodes = node.querySelectorAll('img');
                    for (i= nodes.length; i--;) {
                        alt = nodes[i].getAttribute('alt');
                        if (!alt) {
                            nodes[i].setAttribute('alt', '');
                        }
                    }
                    // Fix the bunches of empty divs where the map panels are located
                    nodes = node.querySelectorAll('.gm-style>div');
                    for (i = nodes.length; i--;) {
                        if (!nodes[i].className) {
                            nodes[i].setAttribute('aria-hidden', 'true');
                        }
                    }
                }
                fixMap(value);
            });
        }
    };

    jQuery.fn.gmaps = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1 ));
        } else if (typeof method === "object" || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            jQuery.error("Method " +  method + " does not exist on jQuery.gmaps");
        }
    };
})(jQuery);
