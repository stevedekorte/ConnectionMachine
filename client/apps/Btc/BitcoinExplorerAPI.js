"use strict"

getGlobalThis().BitcoinExplorerAPI = class BitcoinExplorerAPI {
	constructor () {
		this.newSlot("delegate", null)

		this.newSlot("utxs", [])
		this.newSlot("utxSet", new Set())
		this.newSlot("blocksDict", {})
		this.newSlot("blocks", [])

		//this.newSlot("storage", new Storage())
	}

	getBlockForHash (blockHash) {
		return this.blocksDict()[blockHash]
	}

	setBlockForHash (blockHash, block) {
		this.blocksDict()[blockHash] = block
		this.updateBlocks()
		return this
	}

	updateBlocks () {
		const blocks = Object.values(this.blocksDict())
		blocks.sort( (a, b) => a.height > b.height )
		this.setBlocks(blocks)
		return this
	}

	utxCount () {
		return Object.keys(this.utxDict()).length
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
		this.delegate().onBlock(json)
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

