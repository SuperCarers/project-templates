/*jslint devel: true, maxerr: 100, browser: true, indent: 4 */
/*

Jquery and General Utility Stuff. 

*/

/*
 *  'method' method for augmenting types.
 *  Usage:  String.method('strip', function() {..}  );
 */
Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
};

/*
 * Currying function
 * Usage: var add_1_to = add.curry(1);  assert add_1_to(5) == 6;
 */
Function.method('curry', function() {
	var slice = Array.prototype.slice,
	    args = slice.apply(arguments),
	    that = this;
	return function() {
		return that.apply(null, args.concat(slice.apply(arguments)));
	};
});


/* 
 *  Prototypal beget method on Object.
 *  Usage: var newThing = Object.beget(baseType);
 */
/*
if (typeof(Object.beget) !== 'function'){
	Object.beget = function(o) {
		var F = function() {};
		F.prototype = o;
		return new F();
	};
}
*/

/*
 *  'superior' method invocation pattern (see JS: THe Good Parts Ch5 )
 */
/*
Object.method('superior', function(name) {
	var that = this,
	    method = that[name];
	return function() {
		return method.apply(that, arguments);
	};
});
*/


/*
 *  Add 'append' event to $.append()
 */
/*
(function($) {
    var origAppend = $.fn.append;
    $.fn.append = function () {
        return origAppend.apply(this, arguments).trigger("append");
    };
})(jQuery);

*/
