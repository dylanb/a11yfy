### jQuery(selector).a11yfy()

Execute an accessibility core function on the element(s) targeted by the jQuery selector

#### Synopsis

    jQuery(selector).a11yfy(method, arguments)

#### Parameters

1. method - a String specifying which method to execute on the element(s). The valid methods are: `menu`, `focus` and `showAndFocus`
2. arguments - optional set of arguments to be passed to the method

#### Methods

##### focus

focus the selected element(s) in a way that will work on all platforms

##### Synopsis

    jQuery(selector).a11yfy("focus");

##### Example

    jQuery("#confirm_button_1").a11yfy("focus");

##### showAndFocus

Show the targeted element and then set focus to the element (normally within it, but this is not enforced) identified by the first argument

##### Synopsis

    jQuery(selector).a11yfy("showAndFocus", selector);

##### Parameters

1. selector - String | Element | jQuery object - the element to focus after the content is shown in a way that will work across platforms

##### Example

    jQuery("#confirm_dialog_1").a11yfy("showAndFocus", "#confirm_button_1");

##### menu

Turn a hierarchy of unordered lists into an aria menu. The target must be a ul element and any leaf nodes must contain anchor tags that respond to a click in when the menu item is selected. The menu implementation uses the jquery.a11yfy.core.css CSS styling by default and can of course be restyled to match the look and feel of any web site or application.

The aria menu implements the DHTML style guid keyboard navigation

In the top level menu:

1. LEFT and RIGHT : move between the menu items and cycle at the ends
2. DOWN : open a sub-menu

In the sub-menus

1. UP and DOWN : move between the menu items and cycle at the ends
2. ESC and LEFT: close the menu
3. RIGHT : open the sub menu

To turn the menu into a mega-menu, simply apply class="a11yfy-mega" to the top-level <ul> element, add the class
a11yfy-col to each of the second level <li> elements and apply either a11yfy-two_col, a11yfy-three_col or a11yfy-four_col to the second level <ul> elements (depending on whether it has 2, 3 or 4 sub-sub-menus) and the menu will function as a mega menu.

##### Synopsis

    jQuery(selector).a11yfy("menu");

##### Examples

Given the following HTML code

    <ul id="mymenu">
        <li>One
            <ul>
                <li><a href="oneone">One One</a></li>
                <li><a href="onetwo">One Two</a></li>
                <li><a href="onethree">One Three</a></li>
                <li><a href="onefour">One Four</a></li>
            </ul>
        </li>
        <li>Two
            <ul>
                <li>Two One
                    <ul>
                        <li><a href="twooneone">Two One One</a></li>
                        <li><a href="twoonetwo">Two One Two</a></li>
                        <li><a href="twoonethree">Two One Three</a></li>
                        <li><a href="twoonefour">Two One Four</a></li>
                    </ul>
                </li>
                <li><a href="onetwo">Two Two</a></li>
                <li><a href="onethree">Two Three</a></li>
                <li><a href="onefour">Two Four</a></li>
            </ul>
        </li>
        <li><a href="three">Three</a></li>
        <li><a href="four">Four</a></li>
    </ul>

The following call will turn the above HTML into a simple menu that can be used with a keyboard, a mouse and a screen reader.

    jQuery("#mymenu").a11yfy("menu");

Given the following HTML code

    <ul id="mymegamenu" class="a11yfy-mega">
        <li>One
            <ul>
                <li><a href="oneone">One One</a></li>
                <li><a href="onetwo">One Two</a></li>
                <li><a href="onethree">One Three</a></li>
                <li><a href="onefour">One Four</a></li>
            </ul>
        </li>
        <li>Two
            <ul class="a11yfy-two_col">
                <li class="a11yfy-col">Two One
                    <ul>
                        <li><a href="twooneone">Two One One</a></li>
                        <li><a href="twoonetwo">Two One Two</a></li>
                        <li><a href="twoonethree">Two One Three</a></li>
                        <li><a href="twoonefour">Two One Four</a></li>
                    </ul>
                </li>
                <li class="a11yfy-col">Two Two
                    <ul>
                        <li><a href="twooneone">Two Two One</a></li>
                        <li><a href="twoonetwo">Two Two Two</a></li>
                        <li><a href="twoonethree">Two Two Three</a></li>
                        <li><a href="twoonefour">Two Two Four</a></li>
                    </ul>
                </li>
            </ul>
        </li>
        <li><a href="three">Three</a></li>
        <li><a href="four">Four</a></li>
    </ul>

The following call will turn the above HTML into a mega menu that can be used with a keyboard, a mouse and a screen reader.

    jQuery("#mymegamenu").a11yfy("menu");

