/* @projectDescription jQuery Password Strength Plugin - A jQuery plugin to provide accessibility functions
 * @author Tane Piper (digitalspaghetti@gmail.com)
 * @version 2.0
 * @website: http://digitalspaghetti.me.uk/digitalspaghetti
 * @license MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * === Changelog ===
 * Version 2.1 (18/05/2008)
 * Added a jQuery method to add a new rule: jQuery('input[@type=password]').pstrength.addRule(name, method, score, active)
 * Added a jQuery method to change a rule score: jQuery('input[@type=password]').pstrength.changeScore('one_number', 50);
 * Added a jQuery method to change a rules active state: jQuery('input[@type=password]').pstrength.ruleActive('one_number', false);
 * Hide the 'password to short' span if the password is more than the min chars
 *
 * Version 2.0 (17/05/2008)
 * Completly re-wrote the plugin from scratch.  Plugin now features lamda functions for validation and
 * custom validation rules
 * Plugin now exists in new digitalspaghetti. namespace to stop any conflits with other plugins.
 * Updated documentation
 *
 * Version 1.4 (12/02/2008)
 * Added some improvments to i18n stuff from Raffael Luthiger.
 * Version 1.3 (02/01/2008)
 * Changing coding style to more OO
 * Added default messages object for i18n
 * Changed password length score to Math.pow (thanks to Keith Mashinter for this suggestion)
 * Version 1.2 (03/09/2007)
 * Added more options for colors and common words
 * Added common words checked to see if words like 'password' or 'qwerty' are being entered
 * Added minimum characters required for password
 * Re-worked scoring system to give better results
 * Version 1.1 (20/08/2007)
 * Changed code to be more jQuery-like
 * Version 1.0 (20/07/2007)
 * Initial version.
 */

// Create our namespaced object
/*global window */
/*global jQuery */
/*global digitalspaghetti*/
window.digitalspaghetti = window.digitalspaghetti || {};
digitalspaghetti.password = {
    'defaults' : {
        'displayMinChar': true,
        'minChar': 8,
        'minCharText': 'You must enter a minimum of %d characters',
        'colors': ["#f00", "#c06", "#f60", "#3c0", "#3f0"],
        'scores': [20, 30, 43, 50],
        'verdicts': ['Weak', 'Normal', 'Medium', 'Strong', 'Very Strong'],
        'raisePower': 1.4,
        'debug': false
    },
    'ruleScores' : {
        'length': 0,
        'lowercase': 1,
        'uppercase': 3,
        'one_number': 3,
        'three_numbers': 5,
        'one_special_char': 3,
        'two_special_char': 5,
        'upper_lower_combo': 2,
        'letter_number_combo': 2,
        'letter_number_char_combo': 2
    },
    'rules' : {
        'length': true,
        'lowercase': true,
        'uppercase': true,
        'one_number': true,
        'three_numbers': true,
        'one_special_char': true,
        'two_special_char': true,
        'upper_lower_combo': true,
        'letter_number_combo': true,
        'letter_number_char_combo': true
    },
    'validationRules': {
        'length': function (word, score) {
            digitalspaghetti.passwo{{{top_namespace}}}.tooShort = false;
            var wordlen = wo{{{top_namespace}}}.length;
            var lenScore = Math.pow(wordlen, digitalspaghetti.passwo{{{top_namespace}}}.options.raisePower);
            if (wordlen < digitalspaghetti.passwo{{{top_namespace}}}.options.minChar) {
                lenScore = (lenScore - 100);
                digitalspaghetti.passwo{{{top_namespace}}}.tooShort = true;
            }
            return lenScore;
        },
        'lowercase': function (word, score) {
            return wo{{{top_namespace}}}.match(/[a-z]/) && score;
        },
        'uppercase': function (word, score) {
            return wo{{{top_namespace}}}.match(/[A-Z]/) && score;
        },
        'one_number': function (word, score) {
            return wo{{{top_namespace}}}.match(/\d+/) && score;
        },
        'three_numbers': function (word, score) {
            return wo{{{top_namespace}}}.match(/(.*[0-9].*[0-9].*[0-9])/) && score;
        },
        'one_special_char': function (word, score) {
            return wo{{{top_namespace}}}.match(/.[!,@,#,$,%,\^,&,*,?,_,~]/) && score;
        },
        'two_special_char': function (word, score) {
            return wo{{{top_namespace}}}.match(/(.*[!,@,#,$,%,\^,&,*,?,_,~].*[!,@,#,$,%,\^,&,*,?,_,~])/) && score;
        },
        'upper_lower_combo': function (word, score) {
            return wo{{{top_namespace}}}.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && score;
        },
        'letter_number_combo': function (word, score) {
            return wo{{{top_namespace}}}.match(/([a-zA-Z])/) && wo{{{top_namespace}}}.match(/([0-9])/) && score;
        },
        'letter_number_char_combo' : function (word, score) {
            return wo{{{top_namespace}}}.match(/([a-zA-Z0-9].*[!,@,#,$,%,\^,&,*,?,_,~])|([!,@,#,$,%,\^,&,*,?,_,~].*[a-zA-Z0-9])/) && score;
        }
    },
    'attachWidget': function (element) {
        var output = ['<div id="passwo{{{top_namespace}}}-strength">'];
        if (digitalspaghetti.passwo{{{top_namespace}}}.options.displayMinChar && !digitalspaghetti.passwo{{{top_namespace}}}.tooShort) {
            output.push('<span class="passwo{{{top_namespace}}}-min-char">' + digitalspaghetti.passwo{{{top_namespace}}}.options.minCharText.replace('%d', digitalspaghetti.passwo{{{top_namespace}}}.options.minChar) + '</span>');
        }
        output.push('<span class="passwo{{{top_namespace}}}-strength-bar"></span>');
        output.push('</div>');
        output = output.join('');
        jQuery(element).after(output);
    },
    'debugOutput': function (element) {
        if (typeof console.log === 'function') {
            console.log(digitalspaghetti.password);
        } else {
            alert(digitalspaghetti.password);
        }
    },
    'addRule': function (name, method, score, active) {
        digitalspaghetti.passwo{{{top_namespace}}}.rules[name] = active;
        digitalspaghetti.passwo{{{top_namespace}}}.ruleScores[name] = score;
        digitalspaghetti.passwo{{{top_namespace}}}.validationRules[name] = method;
        return true;
    },
    'init': function (element, options) {
        digitalspaghetti.passwo{{{top_namespace}}}.options = jQuery.extend({}, digitalspaghetti.passwo{{{top_namespace}}}.defaults, options);
        digitalspaghetti.passwo{{{top_namespace}}}.attachWidget(element);
        jQuery(element).keyup(function () {
            digitalspaghetti.passwo{{{top_namespace}}}.calculateScore(jQuery(this).val());
        });
        if (digitalspaghetti.passwo{{{top_namespace}}}.options.debug) {
            digitalspaghetti.passwo{{{top_namespace}}}.debugOutput();
        }
    },
    'calculateScore': function (word) {
        digitalspaghetti.passwo{{{top_namespace}}}.totalscore = 0;
        digitalspaghetti.passwo{{{top_namespace}}}.width = 0;
        for (var key in digitalspaghetti.passwo{{{top_namespace}}}.rules) if (digitalspaghetti.passwo{{{top_namespace}}}.rules.hasOwnProperty(key)) {
            if (digitalspaghetti.passwo{{{top_namespace}}}.rules[key] === true) {
                var score = digitalspaghetti.passwo{{{top_namespace}}}.ruleScores[key];
                var result = digitalspaghetti.passwo{{{top_namespace}}}.validationRules[key](word, score);
                if (result) {
                    digitalspaghetti.passwo{{{top_namespace}}}.totalscore += result;
                }
            }
            if (digitalspaghetti.passwo{{{top_namespace}}}.totalscore <= digitalspaghetti.passwo{{{top_namespace}}}.options.scores[0]) {
                digitalspaghetti.passwo{{{top_namespace}}}.strColor = digitalspaghetti.passwo{{{top_namespace}}}.options.colors[0];
                digitalspaghetti.passwo{{{top_namespace}}}.strText = digitalspaghetti.passwo{{{top_namespace}}}.options.verdicts[0];
                digitalspaghetti.passwo{{{top_namespace}}}.width =  "1";
            } else if (digitalspaghetti.passwo{{{top_namespace}}}.totalscore > digitalspaghetti.passwo{{{top_namespace}}}.options.scores[0] && digitalspaghetti.passwo{{{top_namespace}}}.totalscore <= digitalspaghetti.passwo{{{top_namespace}}}.options.scores[1]) {
                digitalspaghetti.passwo{{{top_namespace}}}.strColor = digitalspaghetti.passwo{{{top_namespace}}}.options.colors[1];
                digitalspaghetti.passwo{{{top_namespace}}}.strText = digitalspaghetti.passwo{{{top_namespace}}}.options.verdicts[1];
                digitalspaghetti.passwo{{{top_namespace}}}.width =  "25";
            } else if (digitalspaghetti.passwo{{{top_namespace}}}.totalscore > digitalspaghetti.passwo{{{top_namespace}}}.options.scores[1] && digitalspaghetti.passwo{{{top_namespace}}}.totalscore <= digitalspaghetti.passwo{{{top_namespace}}}.options.scores[2]) {
                digitalspaghetti.passwo{{{top_namespace}}}.strColor = digitalspaghetti.passwo{{{top_namespace}}}.options.colors[2];
                digitalspaghetti.passwo{{{top_namespace}}}.strText = digitalspaghetti.passwo{{{top_namespace}}}.options.verdicts[2];
                digitalspaghetti.passwo{{{top_namespace}}}.width =  "50";
            } else if (digitalspaghetti.passwo{{{top_namespace}}}.totalscore > digitalspaghetti.passwo{{{top_namespace}}}.options.scores[2] && digitalspaghetti.passwo{{{top_namespace}}}.totalscore <= digitalspaghetti.passwo{{{top_namespace}}}.options.scores[3]) {
                digitalspaghetti.passwo{{{top_namespace}}}.strColor = digitalspaghetti.passwo{{{top_namespace}}}.options.colors[3];
                digitalspaghetti.passwo{{{top_namespace}}}.strText = digitalspaghetti.passwo{{{top_namespace}}}.options.verdicts[3];
                digitalspaghetti.passwo{{{top_namespace}}}.width =  "75";
            } else {
                digitalspaghetti.passwo{{{top_namespace}}}.strColor = digitalspaghetti.passwo{{{top_namespace}}}.options.colors[4];
                digitalspaghetti.passwo{{{top_namespace}}}.strText = digitalspaghetti.passwo{{{top_namespace}}}.options.verdicts[4];
                digitalspaghetti.passwo{{{top_namespace}}}.width =  "99";
            }
            jQuery('.passwo{{{top_namespace}}}-strength-bar').stop();

            if (digitalspaghetti.passwo{{{top_namespace}}}.options.displayMinChar && !digitalspaghetti.passwo{{{top_namespace}}}.tooShort) {
                jQuery('.passwo{{{top_namespace}}}-min-char').hide();
            } else {
                jQuery('.passwo{{{top_namespace}}}-min-char').show();
            }

            jQuery('.passwo{{{top_namespace}}}-strength-bar').animate({opacity: 0.5}, 'fast', 'linear', function () {
                jQuery(this).css({'display': 'block', 'background-color': digitalspaghetti.passwo{{{top_namespace}}}.strColor, 'width': digitalspaghetti.passwo{{{top_namespace}}}.width + "%"}).text(digitalspaghetti.passwo{{{top_namespace}}}.strText);
                jQuery(this).animate({opacity: 1}, 'fast', 'linear');
            });
        }
    }
};

jQuery.extend(jQuery.fn, {
    'pstrength': function (options) {
        return this.each(function () {
            digitalspaghetti.passwo{{{top_namespace}}}.init(this, options);
        });
    }
});
jQuery.extend(jQuery.fn.pstrength, {
    'addRule': function (name, method, score, active) {
        digitalspaghetti.passwo{{{top_namespace}}}.addRule(name, method, score, active);
        return true;
    },
    'changeScore': function (rule, score) {
        digitalspaghetti.passwo{{{top_namespace}}}.ruleScores[rule] = score;
        return true;
    },
    'ruleActive': function (rule, active) {
        digitalspaghetti.passwo{{{top_namespace}}}.rules[rule] = active;
        return true;
    }
});