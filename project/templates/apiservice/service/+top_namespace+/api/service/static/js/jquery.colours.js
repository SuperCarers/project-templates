/*jslint devel: true, maxerr: 100, browser: true, indent: 4 */
/*
 *  Colour handlers - mostly 'borrowed' from http://charliepark.org/bootstrap_buttons
 *  Ed Easton 2013-04-02
 * 
*/

$.colours = $.extend({}, $.colours);
(function (NS) {
	
	var shadowAlpha = function(puffiness){
		var a = parseInt(3.3*puffiness);
		if(a<10){a="0"+a};
		return a;
	}
	
	var hexify = function(i){
	  var hex = parseInt(i).toString(16);
	  if(hex.length == 1){hex="0"+hex};
	  return hex;
	};
	
	var hueToRgb = function(m1, m2, hue) {
	  var v;
	  if (hue < 0)
	    hue += 1;
	  else if (hue > 1)
	    hue -= 1;
	  if (6 * hue < 1)
	    v = m1 + (m2 - m1) * hue * 6;
	  else if (2 * hue < 1)
	    v = m2;
	  else if (3 * hue < 2)
	    v = m1 + (m2 - m1) * (2/3 - hue) * 6;
	  else
	    v = m1;
	  return 255 * v;
	};
	
	NS.hsl2Hex = function(h, s, l) {
	  var m1, m2, hue;
	  var r, g, b
	  s /=100;
	  l /= 100;
	  if (s == 0)
	    r = g = b = (l * 255);
	  else {
	    if (l <= 0.5)
	      m2 = l * (s + 1);
	    else
	      m2 = l + s - l * s;
	    m1 = l * 2 - m2;
	    hue = h / 360;
	    r = hueToRgb(m1, m2, hue + 1/3);
	    g = hueToRgb(m1, m2, hue);
	    b = hueToRgb(m1, m2, hue - 1/3);
	  }
	  return "#"+hexify(r) + hexify(g) + hexify(b);
	};
	
	var getTextColor = function(lightness, puffiness){
		if (parseInt(lightness) < 50) {
			return "color: #fff !important;\n" + 
				   "text-shadow: 0 -1px 0 rgba(0, 0, 0, 0." + shadowAlpha(puffiness) + ");\n" + 
				   "-webkit-font-smoothing: antialiased;";
		} 
		else {
			return "color: #333 !important;\n" + 
			       "text-shadow: 0 1px 1px rgba(255, 255, 255, 0." + shadowAlpha(puffiness) + ");\n" + 
			       "-webkit-font-smoothing: antialiased;";
		}
	};
	
	
	var generateCSS = function(hsl, highlight, lowlight, superLowlight, text, highhex, lowhex) {
	  // return '  background-color: ' + lowlight + ' !important;\n\
	  //   background-repeat: repeat-x;\n\
	  //   filter: progid:DXImageTransform.Microsoft.gradient(startColorStr="'+highhex+'", endColorStr="'+lowhex+'");\n\
	  //   background-image: -khtml-gradient(linear, left top, left bottom, from('+highlight+'), to('+lowlight+'));\n\
	  //   background-image: -moz-linear-gradient(top, '+highlight+', '+lowlight+');\n\
	  //   background-image: -ms-linear-gradient(top, '+highlight+', '+lowlight+');\n\
	  //   background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, '+highlight+'), color-stop(100%, '+lowlight+'));\n\
	  //   background-image: -webkit-linear-gradient(top, '+highlight+', '+lowlight+');\n\
	  //   background-image: -o-linear-gradient(top, '+highlight+', '+lowlight+');\n\
	  //   background-image: linear-gradient('+highlight+', '+lowlight+');\n\
	  //   border-color: '+lowlight+' '+lowlight+' '+superLowlight+';\n\
	  //   '+text+'\n';
	  //  filter: progid:DXImageTransform.Microsoft.gradient(startColorStr="'+highhex+'", endColorStr="'+lowhex+'");\n\ // replaced with hack below
		return '  background-color: ' + lowlight + ' !important;\n\
	  background-repeat: repeat-x;\n\
	  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="'+highhex+'", endColorstr="'+lowhex+'");\n\
	  background-image: -khtml-gradient(linear, left top, left bottom, from('+highhex+'), to('+lowhex+'));\n\
	  background-image: -moz-linear-gradient(top, '+highhex+', '+lowhex+');\n\
	  background-image: -ms-linear-gradient(top, '+highhex+', '+lowhex+');\n\
	  background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, '+highhex+'), color-stop(100%, '+lowhex+'));\n\
	  background-image: -webkit-linear-gradient(top, '+highhex+', '+lowhex+');\n\
	  background-image: -o-linear-gradient(top, '+highhex+', '+lowhex+');\n\
	  background-image: linear-gradient('+highhex+', '+lowhex+');\n\
	  border-color: '+lowhex+' '+lowhex+' '+superLowlight+';\n\
	  '+text+'\n';
	};
	
	
	NS.generateButtonCSS = function(hue, saturation, lightness, delta) {
		/*
		 * Generates the stylesheet snippet for given colour values
		 */
		var highlight = lightness + delta,
			lowlight = lightness - delta,
			superLowlight = lightness - delta * 1.5,
			gradientTop = "hsl("+hue+", "+saturation+"%, "+highlight+"%)",
			gradientBottom = "hsl("+hue+", "+saturation+"%, "+lowlight+"%)",
			borderBottom = "hsl("+hue+", "+saturation+"%, "+superLowlight+"%)",
			hsl = "hsl("+hue+", "+saturation+"%, "+lightness+"%)",
			highhex = NS.hsl2Hex(hue, saturation, highlight),
			lowhex = NS.hsl2Hex(hue, saturation, lowlight),
			text = getTextColor(lightness, delta);
		return generateCSS(hsl, gradientTop, gradientBottom, borderBottom, text, highhex, lowhex);
	}
	
	var colourSelectModal =  _.template(
	   '<div id="colour-select-modal" class="modal hide fade">' + 
		  '<div class="modal-header">' +
		    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
		    '<h3> Select colours <button id="colour-preview" class="btn large">Preview</button></h3>' +
		  '</div>' +
		  '<div class="modal-body">' +
			  '<h4>Hue <small id="hue-value"><%= hue %></small></h4>' + 
              '<div class="colour-select-slider" id="hue"></div>' +
              '<h4>Saturation <small id="saturation-value"><%= saturation %></small></h4>' +
              '<div class="colour-select-slider" id="saturation"></div>' +
              '<h4>Lightness <small id="lightness-value"><%= lightness %></small></h4>' +
              '<div class="colour-select-slider" id="lightness"></div>' +
              '<h4>Shading <small id="delta_value"><%= delta %></small></h4>' +
              '<div class="colour-select-slider" id="delta"></div>' +
		  '</div>' +
		  '<div class="modal-footer">' +
		    '<button type="button" class="btn" data-dismiss="modal" aria-hidden="true">Close</button>' +
		    '<a id="colour-select-submit" href="#" class="btn btn-primary">Save changes</a>' +
		  '</div>' +
		'</div>');
		
	NS.showColourSelect = function(currentColour, fnResultCallback) {
		/*
		 * Bring up a colour selection dialog, post results to fnResultCallback. Results are in this form:
		 *  [ hue, saturation, lightness, 'puffiness' (gradient delta)]
		 */
		var modal = $(colourSelectModal({
			hue: currentColour[0],
			saturation: currentColour[1],
			lightness: currentColour[2],
			delta: currentColour[3]
		})),
			css = NS.generateButtonCSS.apply(null, currentColour);
		$('#colour-select-modal').remove();
		$('body').append(modal);
		$('#colour-preview').attr('style', css);
		$("#hue").slider({
			range: "min",
			max: 360,
			value: currentColour[0],
			slide: NS.handleSliderUpdate,
			change: NS.handleSliderUpdate
		});
		$("#saturation").slider({
			range: "min",
			max: 100,
			value: currentColour[1],
			slide: NS.handleSliderUpdate,
			change: NS.handleSliderUpdate
		});
		$("#lightness").slider({
			range: "min",
			max: 100,
			value: currentColour[2],
			slide: NS.handleSliderUpdate,
			change: NS.handleSliderUpdate
		});
		$("#delta").slider({
			range: "min",
			max: 30,
			value: currentColour[3],
			slide: NS.handleSliderUpdate,
			change: NS.handleSliderUpdate
		});
		$('#colour-select-submit').click(function() {
			fnResultCallback([
				$("#hue").slider("value"),
			    $("#saturation").slider("value"),
				$("#lightness").slider("value"),
				$("#delta").slider("value")
			])
			modal.modal('hide');
		})
		modal.modal({})
	};
	
	NS.handleSliderUpdate = function() {
		var hue = $("#hue").slider("value"),
		    saturation = $("#saturation").slider("value"),
			lightness = $("#lightness").slider("value"),
			delta = $("#delta").slider("value"),
			css = NS.generateButtonCSS(hue, saturation, lightness, delta);
		$('#colour-preview').attr('style', css);
		$('#hue-value').text(hue);
		$('#saturation-value').text(saturation);
		$('#lightness-value').text(lightness);
		$('#delta-value').text(delta);
	};
	
})(jQuery.colours);

