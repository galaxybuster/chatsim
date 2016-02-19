$(function() {

	// Rather than using AJAX to load the file and explode into an array, we will start with an array for the sake of this demo
	script = [];
	script[0] = "[n]Theseus";
	script[1] = "[p]Partner message without extra parameters will show instantly after user message is sent";
	script[2] = "[u]This is a user message with no read notice";
	script[3] = "[u 20]User message with a number indicates the amount of time until the message has been marked read";
	script[4] = "[p 30]Partner message with a number denotes that many seconds of delay";
	pos = 0;
	cur = 0;

	partnerName = "";

	regex = /\[([A-Za-z0-9])[ ]?([0-9]+)?\]([A-Za-z0-9 ]*)/g;
	// Main event loop
	/*for (i = 0; i < script.length; i++) {
		//matches = script[i].match(regex);
		matches = /\[([A-Za-z0-9])[ ]?([0-9]+)?\]([A-Za-z0-9 ]*)/g.exec(script[i]);
		//console.log(matches);
		switch (matches[1]) {
			case "n":
				partnerName = matches[3];
				console.log("Partner name updated to " + matches[3]);
			break;

			case "p":
				push(matches[3]);
			break;

			case "u":
				console.log("thisll be the hard one");
			break;

			default: 
				console.log("Unknown match: " + matches[1]);
			break;
		}
	}*/




	$('#txt').on('keypress', function(e) {
		//e.preventDefault();
		if (e.keyCode == 13) { // enter
			v = $('#txt').val();
			//if (v === script[cur]) {
				push(v);
				$('#txt').val("");
			//	cur++;
			//	pos = 0;
			//}
		}// else {
			//console.log('heh');
			//$('#txt').val("");
			//pos++;
			//$('#txt').val(script[cur].substring(0, pos));
		//}
	});
});

function push(msg) {
	cnsl = $('#console');
	newmsg = $('<div class="msg msg-user"><p>' + msg + '</p><span class="msg-read">delivered</span></div>');
	cnsl.append(newmsg);
	cnsl.animate({scrollTop: newmsg.position().top}, 750);
}