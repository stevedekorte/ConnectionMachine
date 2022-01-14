"use strict"

/*

	See docs at:

		https://www.blockcypher.com/dev/bitcoin/?javascript#blockchain-api

	Might need to get your own API token.

*/

getGlobalThis().BlockCypherAPI = class BlockCypherAPI {
	constructor () {
		this._socket = null
		this._protocol = "wss"
		this._host = "ws.blockchain.info"
		this._port = null
		this._path = "inv"
		this._delegate = null
		this._socket = null

		this._blocksDict = {}
		this._txsDict = {}
		this._utxsDict = {}
		this._blocks = []

		this._token = "f7676bb4292e4a159d33f93f78ef6d6a" 
	}


	updateBlocks () {
		const blocks = Object.values(this._blocksDict)
		blocks.sort( (a, b) => a.height > b.height )
		this._blocks = blocks
		return this
	}

	blocksDict () {
		return this._blocksDict
	}

	utxsDict () {
		return this._utxDicts
	}

	blocksCount () {
		return Object.keys(this._blocksDict).length
	}

	utxsCount () {
		return Object.keys(this._utxsDict).length
	}

	setDelegate (obj) {
		this._delegate = obj
		return this
	}

	run () {
		//this.connect()
		//this.fetchMain()
		return this
	}

	/*
	hasBlockHash (blockHash) {

	}
	*/

	blocks () {
		return this._blocks
	}

	getBlockForHash (blockHash) {
		return this._blocksDict[blockHash]
	}

	setBlockForHash (blockHash, block) {
		this._blocksDict[blockHash] = block
		this.updateBlocks()
		return this
	}

	tokenComponent () {
		if (this._token) {
			return "?token=" + this._token
		} 
		return ""
	}

	connect () {
		this._fetchPeriod = 1000 * 60 * 5 // once per five minutes
		this.fetch()
	}

	fetch () {
		const url = "https://api.blockcypher.com/v1/btc/main" + this.tokenComponent()
		console.log("fetch " + url)
		const request = new XMLHttpRequest();
		request.responseType = "";
		request.open('GET', url, true);
		request.send(null);
		request.onload =  (event) => {
			if (request.readyState === 4 && request.status === 200) {
				const json = JSON.parse(request.responseText)
				this.requestBlock(json.hash)
				if (this._fetchPeriod) {
					setTimeout(() => { this.fetch() }, this._fetchPeriod)
				}
			}
		}
		request.onerror =  (event) => {
			console.log("ERROR: on connect(" + url + ") - will try again with delay")
			setTimeout(() => {
				this.connect()
			}, 3000)
		}
	}

	hasBlock (blockHash) {
		const block = this.getBlockForHash(blockHash)
		if (block) { 
			return true 
		}
		return false
	}

	requestBlock (blockHash) {
		if (this.hasBlock(blockHash)) {
			console.log(" already loaded block " + blockHash)
			return this
		}
		console.log("requestBlock(" + blockHash + ")")

		const url = "https://api.blockcypher.com/v1/btc/main/blocks/" + blockHash + this.tokenComponent()
		const request = new XMLHttpRequest();
		request.responseType = "";
		request.open('GET', url, true);
		request.send(null);
		request.onload =  (event) => {
			if (request.readyState === 4 && request.status === 200) {
				const json = JSON.parse(request.responseText)
				this.onBlockMessage(json)
			}
		}
		request.onerror = (event) => {
			console.log("ERROR: on requestBlock(" + blockHash + ") - will try again with delay")
			setTimeout(() => {
				this.requestBlock(blockHash)
			}, 3000)
		}
	}

	// ----------------------------------------------------------

	requestTx (txHash) {
		const url = "https://api.blockcypher.com/v1/btc/main/txs/" + txHash + this.tokenComponent()
		const request = new XMLHttpRequest();
		request.responseType = "";
		request.open('GET', url, true);
		request.send(null);
		request.onload =  (event) => {
			if (request.readyState === 4 && request.status === 200) {
				const json = JSON.parse(request.responseText)
				this.onTxMessage(json.hash)
			}
		}
	}

	// --- websockets events API ---

	isConnected () {
		return this._socket !== null
	}

	webSocketsConnect () {
		if (this.isConnected()) {
			console.log("attempt to reconnect to already connected websocket")
			return
		}

		const url = "wss://socket.blockcypher.com/v1/btc/main" + this.tokenComponent()
		this.log("new WebSocket('" + url + "')")
		const socket = new WebSocket(url)
		socket.onopen = (event) => this.onOpen(event)
		socket.onmessage = (event) => this.onMessage(event)
		socket.onerror = (event) => this.onError(event)
		socket.onclose =(event) => this.onClose(event)
		this._socket = socket
		return this
	}

	startKeepAlive () {
		if (!this._keepAliveInterval) {
			this._keepAliveInterval = setInterval(() => {
				this.ping() // keep alive
			}, 20*1000) // every 20 seconds, as recommended by docs
		}
	}

	onOpen (event) {
		this.log("onOpen()")
		this.ping()
		//this.subscribeNewBlocks()
		//this.subscribeUnconfirmedTxs()
		//this.startKeepAlive()
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
		if (json.error) {
			console.log("ERROR: ", s.error)
		} else if (json.event === "new-block") {
			this.onBlockMessage(json)
		} else if (json.event === "unconfirmed-tx") {
			this.onUnconfirmedTxMessage(json)
		} else if (json.event === "confirmed-tx") {
			this.onUnconfirmedTxMessage(json)
		} else if (json.event === "pong") {
			this.onPongMessage(json)
		} else if (json.event == "events limit reached") {
			throw new Error("events limit reached")
		}	else {
			throw new Error("unrecognized event type " + s)
		}
	}

	// messages

	ping () {
		this.sendJson({ "op": "ping" })
	}

	// --------------------------------------------------

	onBlockMessage (json) {
		console.log("onBlockMessage(" + json.hash + ")")

		if (this._delegate && this._delegate.onBlockMessage) {
			this._delegate.onBlockMessage(json)
		}

		this.setBlockForHash(json.hash, json)

		if (this.blocksCount() < 32) {
			//console.log("fetch another this.blocksCount()=", this.blocksCount())
			setTimeout(() => {
				this.requestBlock(json.prev_block)
			}, 1000)
		} else {
			//this.webSocketsConnect()
		}

	}

	onUnconfirmedTxMessage (json) {
		//this.log("onUnconfirmedTxMessage('" + JSON.stringify(json) + "')")
		this.log("onUnconfirmedTxMessage('" + json.hash + "')")

		if (this._delegate && this._delegate.onUnconfirmedTxMessage) {
			this._delegate.onUnconfirmedTxMessage(json)
		}

	}

	// --------------------

	onPongMessage (json) {
		this.log("onPongMessage('" + JSON.stringify(json) + "')")
	}

	// tx subs

	subscribeUnconfirmedTxs () {
		this.sendJson({ "event": "unconfirmed-tx" })
	}

	subscribeConfirmedTxs () {
		this.sendJson({ "event": "confirmed-tx" })
	}

	subscribeDoubleSpendTxs () {
		this.sendJson({ "event": "double-spend-tx" })
		this.pingBlock()
	}

	ping () {
		this.sendJson({ "event": "ping" })
	}

	// block subs

	subscribeNewBlocks () {
		this.sendJson({ "event": "new-block" })
	}

	// send

	sendJson (json) {
		this.sendRaw(JSON.stringify(json))
	}

	sendRaw (s) {
		//this.log("sending: [" + s + "]")
		this._socket.send(s);
	}

	// -------------------------------------------------

	log (msg) {
		console.log("BlockChyperAPI:", msg)
		//const content = document.getElementById("content")
		//content.innerHTML += " " + msg + "\n"
	}
}

