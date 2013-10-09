# jQuery(selector).a11yfy("validate")

Add accessibile validation to a form. The function is dependent on the jQuery validation plugin and will not work without it.

## Synopsis

    jQuery(selector).a11yfy("validate", options)

## Parameters

options - use the attributes of this parameter to control the features of the validation. The valid attributes are:

1. skipLink - Boolean - default value : true - should skip links be created and inserted to allow keyboard users to navigate more quickly between the fields with validation errors. Use this when the form is large or where there are a few fields that are required and the likelihood large that a user might make a small number of errors.
2. summary - Boolean - default value : true - when true, the validator will create a summary of the fields with validation errors at the top of the form. It will add links to the summary to allow a user to easily navigate to the fields with errors.
3. validatorOptions - Object - default value : {} - optional object of options that can be passed to the validate() method. The attributes invalidHandler, errorPlacement and showErrors will be overridden by this function.


## Example

    jQuery(document).ready(function () {
        jQuery("#myform").a11yfy("validate");
    });

## Structuring the form

Validate requires the form labels to be associated using the for-if method in order to be able to find the label for the error message associated with the form to be associated with the form. This is an example of correct for-id association.

    <label for="myinput">My Form Input Label<label>
    <input id="myinput" name="myinput" type="text" />

Validate will place the anchor for the link to the next invalid form field immediately after the input element with the error. Sometimes, form fields will contain instructions that follow the input field. For example, a date field might need the user to know the format of the date field. If these instructions follow the input field, then the addition of the anchor will change the layout and the reading order of the form. To prevent this, validate allows for the group of elements that make up the form to be wrapped in a <p> paragraph element. This will cause validate to locate the anchor tag after the paragraph, thereby keeping the integrity of the layout and the reading order. The following is an example of this:

    <p>
        <label for="dob">Date of Birth *</label>
        <input type="date" name="dob" id="dob" required aria-describedby="dateformat"/>
        <span id="dateformat">mm/dd/yyyy</span>
    </p>


## Dependencies

The function is dependent on the <a href="http://jqueryvalidation.org/">jQuery validation plugin</a> and uses this plugin for the actual validation. Read the documentation of that to understand how to use the validation plugin.

