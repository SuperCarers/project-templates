/*jslint devel: true, maxerr: 100, browser: true, indent: 4 */
/*
 *  TimeReference handlers
 *  Ed Easton 2013-04-02
 * 
*/

$.timeref = $.extend({}, $.timeref);
(function (NS) {

    var settings = {
    };
    
	var CLOSED_CLOSED = 0;
	var CLOSED_OPEN = 1;
	var OPEN_CLOSED = 2;
	var OPEN_OPEN = 3;
	
    NS.TimeRef = function(spec) {
    	/*
    	 *  Base Time Reference
    	 */
    };
    
    NS.DateRange = function(spec) {
    	/*
    	 *  DateRange Class
    	 */
    	NS.TimeRef.call(this, spec)
    	this.start = spec.start != undefined ? moment(spec.start) : null;
	    this.end = spec.end != undefined ? moment(spec.end) : null;
    	this.interval = spec.interval != undefined ? spec.interval : OPEN_CLOSED;
    }
    NS.DateRange.prototype = Object.create(NS.TimeRef);
    NS.DateRange.prototype.shift = function(dayDelta, minuteDelta) {
    	/*
    	 * Shift start and end dates
    	 */
    	if (this.start != null) {
	    	this.start.add('days', dayDelta);
	    	this.start.add('minutes', minuteDelta);
	    }
	    if (this.end != null) {
	    	this.end.add('days', dayDelta);
	    	this.end.add('minutes', minuteDelta);
	    }
	    return this;
    	
    };
    NS.DateRange.prototype.resize = function(dayDelta, minuteDelta) {
    	/*
    	 * Shift the end date only
    	 */
	    if (this.end != null) {
	    	this.end.add('days', dayDelta);
	    	this.end.add('minutes', minuteDelta);
	    }
	    return this;
    	
    };
    NS.DateRange.prototype.clone = function() {
    	/*
    	 * Clone this DateRange
    	 */
    	return new NS.DateRange({
    		start: this.start != null ? this.start.clone() : null,
    		end: this.end != null ? this.end.clone() : null,
    		interval: this.interval
    	})
    };
    NS.DateRange.prototype.toJSON = function() {
    	/*
    	 * Convert to JSON
    	 */
    	return {
    		timeref_type: "daterange",
    		// moment has bugs in json handling with timezones >:(
    		start: this.start != null ? this.start.clone().utc().toJSON() : null,
    		end: this.end != null ? this.end.clone().utc().toJSON() : null,
    		interval: this.interval
    	}
    };
    
    NS.fromJSON = function(item) {
    	/*
    	 * Parse json object data into timeref class
    	 */
    	if (item.timeref_type == 'daterange') {
    		return new NS.DateRange(item);
    	}
    	throw  {
    		name: 'TypeError',
    		message: 'Unknown timeref type: ' + item.timeref_type
    	};
    };

    NS.init = function(options) {
        if (options) {
            $.extend(settings, options);
        }
        $.bookingsys.log("bookingsys.timeref.init() OK.");
    }

})(jQuery.timeref);

