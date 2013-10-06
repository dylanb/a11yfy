### jQuery.a11yfy.politeAnnounce

Use aria-live to make a polite announcement. Polite announcements do not interrupt the announcements currently being made by the AT and are also not guaranteed to be made.

#### Synopsis

    jQuery.a11yfy.politeAnnounce(msg)

#### Parameters

1. msg - a String with the information that should be announced to the AT user

#### Example

    jQuery.a11yfy.politeAnnounce("Your cost estimate has been recalculated");

#### See also

    jQuery.a11yfy.assertiveAnnounce

### jQuery.a11yfy.assertiveAnnounce

Use aria-live to make an assertive announcement. Assertive announcements will not interrupt the announcements currently being made by the AT.

#### Synopsis

    jQuery.a11yfy.assertiveAnnounce(msg)

#### Parameters

1. msg - a String with the information that should be announced to the AT user

#### Example

    jQuery.a11yfy.assertiveAnnounce("Please correct the error in the date field before continuing!");

#### See also

    jQuery.a11yfy.politeAnnounce
