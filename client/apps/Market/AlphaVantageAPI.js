"use strict"




getGlobalThis().AlphaVantageAPI = class AlphaVantageAPI extends Base {
	constructor () {
		super()
		this.newSlot("delegate", null)
		this.newSlot("dataTable", new DataTable())
		this.newSlot("symbol", "BTC")
		this.newSlot("periodMinutes", 60) // 1min, 5min, 15min, 30min, 60min
		this.newSlot("function", "DIGITAL_CURRENCY_MONTHLY")


		//columnNames ['time', 'open', 'high', 'low', 'close', 'volume']
		//this.setStorage = new Storage()

		/*
		function options:

			"DIGITAL_CURRENCY_MONTHLY" 
			"CRYPTO_INTRADAY" 
			"DIGITAL_CURRENCY_DAILY" 
			"DIGITAL_CURRENCY_WEEKLY"
			"CRYPTO_INTRADAY"
			"TIME_SERIES_INTRADAY_EXTENDED"  
			"DIGITAL_CURRENCY_MONTHLY" 
		*/

	}


	hasData () {
		return this.dataTable().hasData()
	}

	lows () {
		return this.dataTable().valuesForColumnName("low")
	}

	highs () {
		return this.dataTable().valuesForColumnName("high")
	}

	closes () {
		return this.dataTable().valuesForColumnName("close")
	}

	opens () {
		return this.dataTable().valuesForColumnName("open")
	}

	connect () {
		this.fetchPrices()
	}

	fetchPrices () {
		const apiKey = "RQGBEZP842WDXRA5"

		const xhr = new XMLHttpRequest();
		//const url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY_EXTENDED&symbol=TSLA&interval=15min&slice=year1month1&apikey=RQGBEZP842WDXRA"
		//const url = "https://www.alphavantage.co/query?function=CRYPTO_INTRADAY&symbol=BTC5&market=USD&interval=15min&datatype=json&apikey=" + apiKey
		let url = "https://www.alphavantage.co/query?function=" + this.function() + "&symbol=" + this.symbol() + "&market=USD&datatype=json&apikey=" + apiKey 
		if (this.function() === "CRYPTO_INTRADAY") {
			const interval = this.periodMinutes() + "min"
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

		setTimeout(() => this.fetchPrices(), this.periodMinutes() * 60 * 1000)
		return this
	}

	onFetchPrices (data) {
		let json = JSON.parse(data)
		let error = json["Error Message"]
		if (error) {
			this.log("ERROR: ", error)
		} else {
			this.dataTable().setFromJson(json)
			//this.delegate().onChange(this)
			this.delegate().onNewEntries(this.dataTable().rows())
		}
	}

	log (msg) {
		console.log("AlphaAdvantage:", msg)
	}
}

