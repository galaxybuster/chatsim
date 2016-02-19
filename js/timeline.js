$(function() {

	// Rather than using AJAX to load the file and explode into an array, we will start with an array for the sake of this demo
	script = [];
	script[0] = "[n]Theseus";
	script[1] = "[p]Partner message without extra parameters will show instantly after user message is sent";
	script[2] = "[u]This is a user message with no read notice";
	script[3] = "[u 2]User mesbeen marked read";
	script[4] = "[p 5]Partner message with a number denotes that many seconds of delay";
	pos = 0;
	cur = 0;

	delay = 0;
	line = "";

	partnerName = "";

	// Main event function
	function sim(i) {
		// terminate if end of script
		if (i >= script.length) return 0;

		matches = /\[([A-Za-z0-9])[ ]?([0-9]+)?\]([A-Za-z0-9 ]*)/g.exec(script[i]);
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
	sim(0); // start the script at position 0

	// USER TYPING
	$('#txt').on('keypress', function(e) {
		// prevent characters from showing
		e.preventDefault();

		// if enter was pressed...
		if (e.keyCode == 13) {
			// check that the user has finished typing the complete message
			v = $('#txt').val();
			if (v === line) {
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
						timestamp = t.getHours() + ":" + t.getMinutes();
						n.children('.msg-read').text("read "+timestamp);
						console.log("read");
					}
					setTimeout(d, delay*1000);
				}

				// jack in to sim function at advanced position
				sim(cur + 1);
			}
		} else {
			console.log('heh');
			$('#txt').val("");
			pos++;
			$('#txt').val(line.substring(0, pos));
		}
	});
});

function push(msg, isUser) {
	cnsl = $('#console');
	if (isUser) {
		newmsg = $('<div class="msg msg-user"><p>' + msg + '</p><span class="msg-read">delivered</span></div>');
	} else {
		newmsg = $('<div class="msg msg-partner"><p>' + msg + '</p></div>');
	}
	cnsl.append(newmsg);
	cnsl.animate({scrollTop: newmsg.position().top}, 750);

	return newmsg;
}