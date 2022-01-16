"use strict"

class LedDisplay extends Base {
	constructor () {
		super()
		this.newSlot("socket", null)
		this.newSlot("host", "192.168.4.185")
		//this.newSlot("host", "cm2.local")

		this.newSlot("port", 13254)
		this.newSlot("frame", new LedFrame())
		this.newSlot("delegate", null)
		this.newSlot("isConnected", false)

		this.newSlot("brightness", 1)
		this.newSlot("autoBrightness", true)
		this.newSlot("isSecure", false)

		this.newSlot("width", 32) // taken from server after connection
		this.newSlot("height", 32) // taken from server after connection

	}

	run () {
		this.connect()
		return this
	}

	protocol () {
		if (this.isSecure()) {
			return "wss"
		}
		return "ws"
	}

	url () {
		const url = this.protocol() + "://" + this._host + ":" + this._port + "/"
		return url
	}

	connect () {
		this.log("new WebSocket('" + this.url() + "')")
		try {
			const socket = new WebSocket(this.url())
			socket.onopen = (event) => this.onOpen(event)
			socket.onmessage = (event) => this.onMessage(event)
			socket.onerror = (event) => this.onError(event)
			socket.onclose =(event) => this.onClose(event)
			this.setSocket(socket)
		} catch (e) {
			console.log("websocket connect error ", e)
		}
		return this
	}

	onOpen (event) {
		this.log("onOpen()")
		this.setIsConnected(true)
		this.delegate().onLedDisplayOpen(this)
	};

	onMessage (event) {
		const message = event.data
		this.log("onMessage('" + message + "')")
		const json = JSON.parse(message)
		const f = json.frame
		if (f) {
			this.setWidth(f.width)
			this.setHeight(f.height)
			this.onResize()
		}
	}

	onResize () {
		if (this.delegate().onResizeLedDisplay) {
			this.delegate().onResizeLedDisplay()
		}
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
		if (this.autoBrightness()) {
			const d = new Date()
			const h = d.getHours()
			if (h > 7 && h < 22) {
				return 15
			}
			return 0
		} 
		return this.brightness()
	}

	render () {
		if (this.isConnected()) {
			const json = {
				frame: this.frame().asHexFrame(),
				brightness: this.currentBrightness()
			}
			const s = JSON.stringify(json)
			this.rawSend(s)
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

	rawSend (s) {
		//this.log("sending: [" + s + "]")
		this.socket().send(s)
	}

	log (msg) {
		console.log(msg)
		//const content = document.getElementById("content")
		//content.innerHTML += " " + msg + "<br>\n"
	}
}

