$(function() {
	// load the script file
	var script = [];
	$.get("script.txt", function(data) {
		script = data.split("\n");
	}).done(function() {
		console.log(script);
		sim(0);
	});
	
	// load up those SFX (sorry web purists)
	var sndNewMsg = new Audio('sounds/sndNew.wav');
	var sndMsgSent = new Audio('sounds/sndSent.wav');

	// some variables for typing, delay, desired text
	pos = 0;
	cur = 0;
	delay = 0;
	line = "";

	partnerName = "";

	// Main event function
	function sim(i) {
		// terminate if end of script
		if (i >= script.length) return 0;

		matches = /\[([A-Za-z0-9])[ ]?([0-9]+)?\](.*)/g.exec(script[i]);
		//console.log(matches);
		switch (matches[1]) {
			case "n":
				partnerName = matches[3];
				$('#pname').text(partnerName);
				console.log("Partner name updated to " + matches[3]);

				sim(i+1);
			break;

			case "p":
				
				// check for delay
				if (matches[2]) {
					p = function() {
						push(matches[3], false);
						sim(i+1);
						sndNewMsg.play();
					}
					setTimeout(p, matches[2] * 1000);
					
				} else {
					push(matches[3], false);
					sim(i+1);
				}
				
			break;

			case "u":
				/* Here we will exit this function
				enable the textbox
				watch for enter keypress on the input
				and jump back into the function at that position
				disabling the textbox.
				*/

				// enable the textbox
				$('#txt').prop('disabled', false);
				// focus the textbox
				$('#txt').focus();
				// set the full line of text to be typed
				line = matches[3];
				// read delay
				delay = matches[2];
				// track current script position
				cur = i;
				
				// do not call sim again as we will wait until the user presses enter.
			break;

			default: 
				console.log("Unknown case: " + matches[1]);
			break;
		}
	}


	// USER TYPING
	$('#txt').on('keypress', function(e) {
		// prevent characters from showing
		e.preventDefault();
		
		// if enter was pressed...
		if (e.keyCode == 13) {
			// check that the user has finished typing the complete message
			v = $('#txt').val();
			if (v === line) {
				sndMsgSent.play();
				// put a message in the log
				n = push(v, true);
				// erase input
				$('#txt').val("");
				
				pos = 0;
				// disable the textbox
				$('#txt').prop('disabled', true);

				console.log(delay);

				// set delay for read receipt
				if (delay) {
					d = function() {
						t = new Date();
						h = t.getHours() < 10?'0'+t.getHours():t.getHours();
						m = t.getMinutes() < 10?'0'+t.getMinutes():t.getMinutes();
						timestamp = h + ":" + m;
						n.children('.msg-read').text("read "+timestamp);
						console.log("read");
					}
					setTimeout(d, delay*1000);
					
				}

				// jack in to sim function at advanced position
				sim(cur + 1);
			}
		} else {
			$('#txt').val("");
			pos+=2;
			$('#txt').val(line.substring(0, pos));
		}
		$('#txt').scrollLeft(10000);
	});

	// clickable send
	$("#b-send").click(function() {
		var e = jQuery.Event("keypress");
		e.keyCode = 13; // # Some key code value
		$("#txt").trigger(e);
	});

	$('#container').center();
	$(window).resize(function() {
		$('#container').center();	
	});
});

jQuery.fn.center = function () {
	console.log("centering");
	this.css("position","absolute");
	par = this.parent();
	this.css("top", Math.max(0, ((par.height() - $(this).outerHeight()) / 2)));
	this.css("left", Math.max(0, ((par.width() - $(this).outerWidth()) / 2)));
	return this;
}

function push(msg, isUser) {
	cnsl = $('#console');
	if (isUser) {
		newmsg = $('<div class="msg msg-user"><p>' + msg + '</p><span class="msg-read">delivered</span></div>');
	} else {
		newmsg = $('<div class="msg msg-partner"><p>' + msg + '</p></div>');
	}
	newmsg.hide();
	cnsl.append(newmsg);
	newmsg.fadeIn(100);
	cnsl.animate({scrollTop: newmsg.position().top+1500}, 2000);

	return newmsg;
}