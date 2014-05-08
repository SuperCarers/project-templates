/*jslint devel: true, maxerr: 100, browser: true, indent: 4 */
/*
This requires before this file:
    * JQuery : http://code.jquery.com/jquery-1.6.1.js
    * JSON2 : http://www.JSON.org/json2.js
    * JQote2 : http://aefxx.com/jquery-plugins/jqote2/
    * jquery.bookingsys.js : JQuery booking sys common funcs.

Oisin Mulvihill
2011-11-25.

*/
(function ($) {

    var settings = {
        // Where to POST document data to to add / update an exiting entry.
        "profile_url": "/profile",
        "profile_form": "#profile-form"
    };

    function harvest() {
        var data_for_server = {};
        $.bookingsys.flash("Updating...");

        function get_data() {
            var field = "";
            var name = "";
            var data = {};

            $(settings.profile_form).find(".data").each(function (i, ele) {
                field = $(ele);
                name = field.attr('name');
                $.bookingsys.log(i + ": " + name + " = '" + field.val() + "'.");
                data[name] = field.val();
            });

            return JSON.stringify(data);
        }

        try {
            data_for_server = get_data();

        } catch (e) {
            $.bookingsys.print_message("Form data recovery failure: " + e);
            return;
        }
        $.bookingsys.log("To Server: " + data_for_server);

        var handler = $.bookingsys.ServerResponseHandler(function (response) {
            if (response.status === "error") {
                $.bookingsys.flash("Error: " + response.message, 'error');
            }
            else {
                $.bookingsys.flash("Updated OK.");
                $.bookingsys.log("Updated ok: " + response.message);
                //$(settings.profile_form)[0].reset();
            }
        });

        $.bookingsys.log("Sending data to URI: '" + settings.profile_url + "'.");

        $.bookingsys.ajax_req(
            settings.profile_url,
            "PUT",
            data_for_server,
            handler
        );

        return false;
    }

    function init(options) {
        if (options) {
            $.extend(settings, options);
        }
        $('#save-profile-btn').click(harvest);

        $.bookingsys.log("bookingsys profile.js setup finish.");
    }

    // Add to the JQuery plugin namespace i.e. $.bookingsys.<XYZ calls>

    // create $.bookingsys if its not present.
    if (!$.bookingsys) { $.extend({bookingsys: {}}); }

    // Now add $.bookingsys.profile namespace contents:
    $.extend($.bookingsys, {profile: {
        init: init
    }});

})(jQuery);

