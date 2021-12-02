class PanelClient {
	constructor () {
		this._socket = null
		//this._host = "cm2.local"
		this._host = "192.168.4.185"
		this._port = 13254
	}

	run () {
		this.connect()
		return this
	}

	url () {
		const url = "ws://" + this._host + ":" + this._port + "/"
		return url
	}

	connect () {
		this.log("new WebSocket('" + this.url() + "')")
		const socket = new WebSocket(this.url())
		socket.onopen = (event) => this.onOpen(event)
		socket.onmessage = (event) => this.onMessage(event)
		socket.onerror = (event) => this.onError(event)
		socket.onclose =(event) => this.onClose(event)
		return this
	}

	onOpen (event) {
		this.log("onOpen()")
	};

	onMessage (event) {
		const message = event.data
		this.log("onMessage('" + message + "')")
	}

	onError (event) {
		this.log("onError('" + event + "')")
	}

	onClose (event) {
		this.log("onClose('" + event.reason + "')<br>")
	}

	sendFrame1() {
		const msg = {
			frame: "0".repeat(256)
		}
	}

	sendFrame2() {
		const msg = {
			frame: "aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555aaaaaaaa55555555",
		}
	}

	sendFrame (frame) {
		const msg = {
			frame: frame
		}
		const s = JSON.stringify(msg)
		this.send(s)
	}

	send (s) {
		this.log("sending: [" + s + "]")
		this._socket.send(s);
	}

	log (msg) {
		const content = document.getElementById("content")
		content.innerHTML += " " + msg + "<br>\n"
	}

}


window.onkeydown= function(event) {
	const k = event.keyCode
	if (Math.random() > 0.5) {
		window.panelClient.sendFrame1()
	} else {
		window.panelClient.sendFrame2()
	}	
}

window.onload = function() {
	window.panelClient = new PanelClient()
	window.panelClient.run()
}

