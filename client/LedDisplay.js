class LedDisplay {
	constructor () {
		this._socket = null
		//this._host = "cm2.local"
		this._host = "192.168.4.185"
		this._port = 13254
		this._frame = new LedFrame()
		this._delegate = null
	}

	setDelegate (obj) {
		this._delegate = obj
		return this
	}

	frame () {
		return this._frame
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
		this._delegate.onLedDisplayOpen(this)
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
		const json = {
			frame: this._frame.asHexFrame()		
		}
		const s = JSON.stringify(json)
		this.rawSend(s)
	}

	clear () {
		this.frame().clear()
		this.display()
	}

	setBightness (v) {
		const msg = {
			brightness: v
		}
		const s = JSON.stringify(msg)
		this.rawSend(s)
	}

	rawSend (s) {
		//this.log("sending: [" + s + "]")
		this._socket.send(s);
	}

	log (msg) {
		console.log(msg)
		//const content = document.getElementById("content")
		//content.innerHTML += " " + msg + "<br>\n"
	}
}

