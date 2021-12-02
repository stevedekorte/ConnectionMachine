
function run() {
	const content = document.getElementById("content")
	const ip = "cm2.local"
	const port = 13254

	//var socket = new WebSocket("ws://127.0.0.1:13254/socketserver", ["protocolOne", "protocolTwo"]);
	const url = "ws://" + ip + ":" + port + "/"
	var socket = new WebSocket(url);

	log("new WebSocket('" + url + "')")

	socket.onopen = function (event) {
		log("onopen()")
		const msg = {
			frame: "aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555"
		}
		const s = JSON.stringify(msg)
		console.log("sending: [" + s + "]")
		socket.send(s);
	};

	socket.onmessage = function(event) {
		const message = event.data
		log("onmessage('" + message + "')")
	}

	socket.onerror = function(event) {
		log("onerror('" + event + "')")
	}

	socket.onclose = function(event) {
		log("onclose('" + event.reason + "')<br>")
	}

	function log(msg) {
		content.innerHTML += " " + msg + "<br>\n"
	}

	window.onkeydown= function(event) {
		const k = event.keyCode
		//socket.send("{ keyCode: " + k + " }");
	}

	//socket.close();
}

window.onload = function() {
	run()
}

