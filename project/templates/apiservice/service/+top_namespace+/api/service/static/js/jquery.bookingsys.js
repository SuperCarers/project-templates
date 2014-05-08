/*jslint devel: true, maxerr: 100, browser: true, indent: 4 */
/*

Common JS functions across bookingsys

This requires before this file:
    * JQuery : http://code.jquery.com/jquery-1.6.1.js

Oisin Mulvihill
2012-10-16.

*/
$.bookingsys = $.extend({}, $.bookingsys);
(function (NS) {
    NS.settings = {
        // where print-message will attempt to append user visible messages:
        "flash_messages": "#flash-messages"
    };

    NS.init = function(options) {
        if (options) {
            $.extend(NS.settings, options);
        }
        NS.log("jquery.bookingsys.js ok.");
    }

    NS.log = function(msg) {
        try {
            // Uncomment for development running under firefox
            if (window.console) {
                console.log(msg);
            }
        } catch (e) {
            /* Ignore as firebug is turned off or not available. */
        }
    }

    NS.get_base_url = function() {
        // http://www.gotknowhow.com/articles/how-to-get-the-base-url-with-javascript
        var url = location.href;  // entire url including querystring - also: window.location.href;
        var baseURL = url.substring(0, url.indexOf('/', 14));

        if (baseURL.indexOf('http://localhost') != -1) {
            // Base Url for localhost
            url = location.href;  // window.location.href;
            var pathname = location.pathname;  // window.location.pathname;
            var index1 = url.indexOf(pathname);
            var index2 = url.indexOf("/", index1 + 1);
            var baseLocalUrl = url.substr(0, index2);

            return baseLocalUrl;

        } else {
            // Root Url for domain name
            return baseURL;
        }
    }

    // Trigger the flash message bar
    var flash_tmpl = _.template('<div class="alert alert-<%= klass %>">' +
                                '<%= msg %>' +
                                '<a class="close" data-dismiss="alert" href="#">&times;</a>' +
                                '</div>');

    NS.flash = function(msg, type) {
        klass = "info";
        if(type === 'error') {
            klass = "danger";
        }
        else if (type == "success") {
            klass = "success";
        }
        var new_msg = flash_tmpl({msg : msg, klass : klass});
        $(NS.settings.flash_messages).empty().append(new_msg).fadeOut(100).fadeIn(100);
        // Enable alert close buttons
        $('.alert').alert();
    };

    NS.print_message = NS.flash;

    // Flash messages can come from page templates too, flash these on page load
    $(document).ready(function() {
        $('.alert').alert();
        $(NS.settings.flash_messages).fadeOut(100).fadeIn(100);
    });

    // common handler for errors on ajax posts:
    NS.ajax_error = function(XMLHttpRequest, textStatus, errorThrown) {
        NS.flash('Server connection error: check server.', 'error');
        NS.log("Ajax Error: " + XMLHttpRequest + ":" + textStatus + ":" + errorThrown);
    };

    // Wrap $.ajax using the common set up we use for JSON POST/Response.
    NS.ajax_req = function(url, method, data, ok_handler) {
        $.ajax({
            url: url,
            type: method,
            data: data,
            dataType: 'json',
            contentType: 'application/json',
            context: this,
            success: ok_handler,
            error: NS.ajax_error
        });
    }

    NS.ServerResponseHandler = function(handler_callback) {
        /* Wrap the result handler with response dict checker.

        The 'response' from the server should be:

            // for success:
            {
                "status": "ok",
                "message": "ok",
                "result": <data returned>
            }

            // for error
            {
                "status": "error",
                "message": "<long message>",
                "result": <short error message>
            }

        If the response must be one of these or it will result in a general

        */
        function response_from_server(response, textStatus, XMLHttpRequest) {
            //NS.log("received '" + textStatus + "' looking at data.");
            try {
                if (response.hasOwnProperty("status")) {
                    handler_callback(response);
                } else {
                    print_message("Bad response! No result dict.", true);
                }
            } catch (e) {
                print_message("Error reading response: " + e, true);
            }
        }
        return response_from_server;
    }

    NS.json_promise = function(url, method, data) {
        /*
         * Alternative Ajax usage using deferreds that respects the extra
         * response encapsulation above.
         *
         * url: URL
         * method: GET, POST, PUT etc
         * data: json data body (PUT/POST) or query string (GET)
         */
        NS.log(method + " " + url)
        NS.log(data)
        var requestPromise = $.ajax({
            type: method,
            url: url,
            data: method === 'GET' ? data : JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
        });
        var responseDeferred = $.Deferred();
        requestPromise.fail(NS.ajax_error);
        requestPromise.done( function(response, textStatus, XMLHttpRequest) {
            if (response.hasOwnProperty("status")) {
                if (response.status === 'ok') {
                    responseDeferred.resolve(response.message);
                }
                else {
                    NS.log("JSON response status not 'ok':");
                    NS.log(response);
                    responseDeferred.reject();
                }
            } else {
                NS.log('Malformed json response: ');
                NS.log(response);
                responseDeferred.reject();
            }
        });
        return responseDeferred.promise();
    };

})(jQuery.bookingsys);




