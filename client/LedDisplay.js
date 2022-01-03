class LedDisplay {
	constructor () {
		this._socket = null
		//this._host = "cm2.local"
		this._host = "192.168.4.185"
		this._port = 13254
		this._frame = new LedFrame()
		this._delegate = null
		this._isConnected = false
		this._brightness = 1
		this._autoBrightness = true
	}

	isConnected () {
		return this._isConnected
	}

	setIsConnected (bool) {
		this._isConnected = bool
		return this
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
		//const url = "wss://" + this._host + ":" + this._port + "/"
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
		this.setIsConnected(true)
		this._delegate.onLedDisplayOpen(this)
	};

	onMessage (event) {
		const message = event.data
		this.log("onMessage('" + message + "')")
	}

	onError (event) {
		this.log("onError('" + event + "')")
		this.setIsConnected(false)
	}

	onClose (event) {
		this.log("onClose('" + event.reason + "')")
		this.setIsConnected(false)
	}

	currentBrightness () {
		if (this._autoBrightness) {
			const d = new Date()
			const h = d.getHours()
			if (h > 7 && h < 22) {
				return 15
			}
			return 0
		} 
		return this._brightness
	}

	render () {
		if (this.isConnected()) {
			const json = {
				frame: this._frame.asHexFrame(),
				brightness: this.currentBrightness()
			}
			const s = JSON.stringify(json)
			this.rawSend(s)
			//console.log("this._brightness = ",  this._brightness)
		}
	}

	clear () {
		this.frame().clear()
		this.render()
	}

	setBrightness (v) { // max is 15
		v = Math.round(v)
		if (v > 15) { v = 15 }
		if (v < 0) { v = 0 }
		this._brightness = v
		return this
	}

	brightness () {
		return this._brightness
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

