"use strict"




window.AlphaVantageAPI = class AlphaVantageAPI {
	constructor () {
		this._delegate = null
		this._dataTable = new DataTable()
		//columnNames ['time', 'open', 'high', 'low', 'close', 'volume']
		//this._storage = new Storage()
		this._symbol = "BTC"
		this._periodMinutes = 60 // 1min, 5min, 15min, 30min, 60min
		// "DIGITAL_CURRENCY_MONTHLY" // "CRYPTO_INTRADAY" // "DIGITAL_CURRENCY_DAILY" // "DIGITAL_CURRENCY_WEEKLY"
		this._function = "DIGITAL_CURRENCY_MONTHLY" //"CRYPTO_INTRADAY"
		// "TIME_SERIES_INTRADAY_EXTENDED"  

	}

	symbol () {
		return this._symbol
	}

	setDelegate (obj) {
		this._delegate = obj
		return this
	}

	delegate () {
		return this._delegate
	}

	hasData () {
		return this._dataTable.hasData()
	}

	lows () {
		return this._dataTable.valuesForColumnName("low")
	}

	highs () {
		return this._dataTable.valuesForColumnName("high")
	}

	closes () {
		return this._dataTable.valuesForColumnName("close")
	}

	opens () {
		return this._dataTable.valuesForColumnName("open")
	}

	connect () {
		this.fetchPrices()
	}

	function () {
		return this._function
	}

	fetchPrices () {
		const apiKey = "RQGBEZP842WDXRA5"

		const xhr = new XMLHttpRequest();
		//const url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY_EXTENDED&symbol=TSLA&interval=15min&slice=year1month1&apikey=RQGBEZP842WDXRA"
		//const url = "https://www.alphavantage.co/query?function=CRYPTO_INTRADAY&symbol=BTC5&market=USD&interval=15min&datatype=json&apikey=" + apiKey
		let url = "https://www.alphavantage.co/query?function=" + this.function() + "&symbol=" + this.symbol() + "&market=USD&datatype=json&apikey=" + apiKey 
		if (this.function() === "CRYPTO_INTRADAY") {
			const interval = this._periodMinutes + "min"
			url += "&interval=" + interval + "&outputsize=compact"
		}
		//const url = "https://www.alphavantage.co/query?function=CRYPTO_INTRADAY&symbol=" + this.symbol() + "&market=USD&interval=" + interval + "&datatype=json&apikey=" + apiKey + "&outputsize=compact"

		this.log("fetch " + url)

		xhr.addEventListener("readystatechange",  () => {
			if (xhr.readyState === xhr.DONE) {
				this.onFetchPrices(xhr.responseText)
			}
		})

		xhr.onerror = (event) => {
			this.log("ERROR: on connect(" + url + ") ")
		}

		xhr.open("GET", url, true);
		xhr.setRequestHeader('User-Agent', 'request');
		xhr.send(null);

		setTimeout(() => this.fetchPrices(), this._periodMinutes * 60 * 1000)
		return this
	}

	onFetchPrices (data) {
		let json = JSON.parse(data)
		let error = json["Error Message"]
		if (error) {
			this.log("ERROR: ", error)
		} else {
			this._dataTable.setFromJson(json)
			//this.delegate().onChange(this)
			this.delegate().onNewEntries(this._dataTable.rows())
		}
	}

	log (msg) {
		console.log("AlphaAdvantage:", msg)
	}
}

