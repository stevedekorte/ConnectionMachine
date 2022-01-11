"use strict"

/*
	{
		startDate: millisecondsSince1970 number,
		endDate: millisecondsSince1970 number,
		open: number,
		close: number,
		high: number,
		low: number,
		avarage: number,
	}

*/

window.SparseMarketData = class SparseMarketData {
	static shared () {
		if (!this._shared) {
			this._shared = new SparseMarketData()
		}
		return this._shared
	}

	constructor() {
		this._series = []

		// date compare function
		this._compareFunc = this.defaultCompareFunc()

		//this.addCsvString(window.btcHistoryCsvString)
	}

	series () {
		return this._series
	}

	defaultCompareFunc () {
		return function (a, b) {
			if (!a.startDate || !b.startDate) {
				throw new Errror("invalid date")
			}
			if (a.startDate < b.startDate) {
				return -1
			} else if (a.startDate < b.startDate) {
				return 1
			}
			return 0
		}
	}

	sort () {
		this._series.sort(this._compareFunc)
		return this
	}

	addEntries (json) {
		json.forEach((row) => {
			this.addEntry(row)
		})
		this.sort()
		console.log("after addEntries entries date range ", new Date(this.entriesStartDate()), " -> ", new Date(this.entriesEndDate()))
	}

	addEntry (json) {
		this._series.push(json)
		return this
	}

	entryCount () {
		return this._series.length
	}

	entriesStartDate () {
		return this._series[0].startDate + 1000
	}

	entriesEndDate () {
		return this._series[this._series.length-1].startDate - 1000
	}

	entriesWithCount (count) {
		return this.entriesFromToCount(this.entriesStartDate(), this.entriesEndDate(), count)
	}

	entriesFromToCount (startDate, endDate, count) {
		console.log("entriesFromToCount ", new Date(startDate), " -> ", new Date(endDate))
		console.log("entries date range ", new Date(this.entriesStartDate()), " -> ", new Date(this.entriesEndDate()))
		if (startDate > endDate) {
			throw new Error("startDate > endDate")
		}
		// TODO compose new entries by calculating high, low, start end
		const period = (endDate - startDate)
		const entries = []
		for (let i = 0; i < count; i++) {
			const d1 = startDate + period * ((i+0)/count)
			const d2 = startDate + period * ((i+1)/count)
			//const entry = this.bestForDateRange(d1, d2)
			const entry = this.constructEntryForDateRange(d1, d2)
			entries.push(entry)
		}
		return entries
	}

	constructEntryForDateRange (startDate, endDate) {
		const entries = this.entriesContainingDateRange(startDate, endDate)
		const newEntry = {
			startDate: startDate,
			endDate: endDate,
			low: Number.POSITIVE_INFINITY,
			high: Number.NEGATIVE_INFINITY
		}

		newEntry.open = entries[0].open
		newEntry.close = entries[0].close

		entries.forEach((entry) => {
			if (entry.low < newEntry.low) {
				newEntry.low = entry.low
			}
			if (entry.high > newEntry.high) {
				newEntry.high = entry.high
			}
			if (entry.startDate <= newEntry.startDate) {
				newEntry.open = entry.open

			}
			if (entry.endDate >= newEntry.endDate) {
				newEntry.close = entry.close
			}
			
		})

		return newEntry
	}

	bestForDateRange (startDate, endDate) {
		const entries = this.entriesContainingDateRange(startDate, endDate)
		let bestEntry = null
		let bestLength = null
		entries.forEach((entry) => {
			const length = endDate - startDate
			if (bestEntry === null || length < bestLength) {
				bestEntry = entry
				bestLength = length
			}
		})
		return bestEntry
	}

	entriesContainingDateRange (startDate, endDate) {
		// we want an overlapping entry with the smallest span
		const series = this.series()
		const matches = []

		for (let i = 0; i < series.length; i++) {
			const entry = series[i]
			if (entry.startDate >= startDate && entry.endDate <= endDate) { 
				// do we want to exclude by end date?
				matches.push(entry)
			}
		}
		return matches
	}


}

