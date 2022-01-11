"use strict"

window.BitcoinExplorerAPI = class BitcoinExplorerAPI {
	constructor () {
		this._delegate = null

		//this._utxs = []
		//this._utxSet = new Set()
		this._blocksDict = {}
		this._blocks = []

		//this._storage = new Storage()
	}

	blocks () {
		return this._blocks
	}

	getBlockForHash (blockHash) {
		return this._blocksSet[blockHash]
	}

	setBlockForHash (blockHash, block) {
		this._blocksDict[blockHash] = block
		this.updateBlocks()
		return this
	}

	updateBlocks () {
		const blocks = Object.values(this._blocksDict)
		blocks.sort( (a, b) => a.height > b.height )
		this._blocks = blocks
		return this
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

	connect () {
		this.fetchTip()
		return this
	}

	onPrices (data) {
		const json = JSON.parse(data)
		console.log("onPrices: ", data)
	}

	fetchTip () {
		this.fetch("https://data.nasdaq.com/api/v3/datasets/BCHARTS/BITSTAMPUSD", data => this.onPrices(data))
		//this.fetch("https://bitcoinexplorer.org/api/blocks/tip/hash", data => this.onTip(data))
	}

	onTip (blockHash) {
		this.fetchBlock(blockHash)
	}

	fetchBlock (blockHash) {
		this.fetch("https://bitcoinexplorer.org/api/block/" + blockHash, data => this.onBlock(data))

	}

	onBlock (data) {
		const json = JSON.parse(data)
		this.setBlockForHash(json.hash, json)
		this._delegate.onBlock(json)
	}
	
	fetch (url, callback) {
		console.log("fetch " + url)
		const request = new XMLHttpRequest();
		request.responseType = "";
		request.open('GET', url, true);
		request.send(null);

		request.onload =  (event) => {
			if (request.readyState === 4 && request.status === 200) {
				callback(request.responseText)
			}
		}

		request.onerror =  (event) => {
			console.log("ERROR: on connect(" + url + ") - will try again with delay")
			setTimeout(() => {
				this.connect()
			}, 3000)
		}
	}

	log (msg) {
		console.log("BitcoinExplorer:", msg)
	}
}

