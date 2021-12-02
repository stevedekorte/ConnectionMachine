class PanelClient {
	constructor () {
		this._socket = null
		//this._host = "cm2.local"
		this._host = "192.168.4.185"
		this._port = 13254
		this._frame = new LedFrame()
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
		this._socket = socket
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

	display () {
		const msg = {
			frame: this._frame.asHexFrame(),
			brightness: 0
		}
		const s = JSON.stringify(msg)
		this.send(s)
	}

	setBightness (v) {
		const msg = {
			brightness: v
		}
		const s = JSON.stringify(msg)
		this.send(s)
	}

	send (s) {
		//this.log("sending: [" + s + "]")
		this._socket.send(s);
	}

	log (msg) {
		const content = document.getElementById("content")
		content.innerHTML += " " + msg + "<br>\n"
	}

	step () {
		this._frame.randomize()
		this.display()
	}
}


window.onkeydown= function(event) {
	const k = event.keyCode
	console.log("onkeydown ", k)

	const client = window.panelClient

	client._frame.randomize()
	client.display()
}

window.onload = function() {
	window.panelClient = new PanelClient()
	window.panelClient.run()
	setInterval(() => { window.panelClient.step() }, 1000/60)
}

