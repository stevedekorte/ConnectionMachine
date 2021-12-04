class BtcData {
	constructor () {
		this._socket = null
		this._protocol = "wss"
		this._host = "ws.blockchain.info"
		this._port = null
		this._path = "inv"
		this._delegate = null

		//this._utxs = []
		this._utxDict = {}
		this._newBlocks = []
	}

	newBlocks () {
		return this._newBlocks
	}

	utxDict () {
		return this._utxDict
	}

	utxCount () {
		return Object.keys(this._utxDict).length
	}

	setDelegate (obj) {
		this._delegate = obj
		return this
	}

	run () {
		this.connect()
		return this
	}

	url () {
		let url = this._protocol + "://" + this._host 
		if (this._port) {
			url += ":" + this._port
		} 

		url += "/"

		if (this._path) {
			url += this._path
		}

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
		this.ping()
		this.subscribeNewBlocks()
		this.subscribeUnconfirmedTxs()
	};

	onError (event) {
		this.log("onError('" + event + "')")
	}

	onClose (event) {
		this.log("onClose('" + event.reason + "')")
	}

	onMessage (event) {
		const s = event.data
		//this.log("onMessage('" + s + "')")
		const json = JSON.parse(s)
		if (json.op === "block") {
			this.onBlockMessage(json)
		} else if (json.op === "utx") {
			this.onUnconfirmedTxMessage(json)
		} else if (json.op === "pong") {
			this.onPongMessage(json)
		}
	}

	// messages

	ping () {
		this.sendJson({ "op": "ping" })
	}

	onBlockMessage (json) {
		this.log("onBlockMessage('" + JSON.stringify(json) + "')")
		this._newBlocks.push(json)

		json.x.txIndexes.forEach((txIndex) => {
			delete this._utxDict[txIndex]
		})

		if (this._delegate && this._delegate.onBlockMessage) {
			this._delegate.onBlockMessage(json)
		}
	}

	onUnconfirmedTxMessage (json) {
		//this.log("onUnconfirmedTxMessage('" + JSON.stringify(json) + "')")
		this.log("onUnconfirmedTxMessage('" + json.x.tx_index + "')")

		this._utxDict[json.x.tx_index] = json

		if (this._delegate && this._delegate.onUnconfirmedTxMessage) {
			this._delegate.onUnconfirmedTxMessage(json)
		}
	}

	onPongMessage (json) {
		this.log("onPongMessage('" + JSON.stringify(json) + "')")
	}

	// unconfirmed tx subs

	subscribeUnconfirmedTxs () {
		this.sendJson({ "op": "unconfirmed_sub" })
		this.pingTx()
	}

	unsubscribeUnconfirmedTxs () {
		this.sendJson({ "op": "unconfirmed_unsub" })
	}

	pingTx () {
		this.sendJson({ "op": "ping_tx" })

	}

	// block subs

	subscribeNewBlocks () {
		this.sendJson({ "op": "blocks_sub" })
		this.pingBlock()
	}

	unsubscribeNewBlocks () {
		this.sendJson({ "op": "blocks_unsub" })
	}

	pingBlock () {
		this.sendJson({ "op": "ping_block" })

	}

	// send

	sendJson (json) {
		this.sendRaw(JSON.stringify(json))
	}

	sendRaw (s) {
		//this.log("sending: [" + s + "]")
		this._socket.send(s);
	}

	log (msg) {
		console.log("BtcData:", msg)
		//const content = document.getElementById("content")
		//content.innerHTML += " " + msg + "<br>\n"
	}
}

