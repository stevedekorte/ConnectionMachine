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


// -------------------------------------------------------


getGlobalThis().SparseMarketData = class SparseMarketData extends Base {

	constructor() {
		super()
		this.newSlot("series", [])
		this.newSlot("compareFunc", this.defaultCompareFunc()) // date compare function
		//this.addCsvString(getGlobalThis().btcHistoryCsvString)
	}

	defaultCompareFunc() {
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

	sort() {
		this.series().sort(this.compareFunc())
		return this
	}

	addEntries(json) {
		json.forEach((row) => {
			this.addEntry(row)
		})
		this.sort()
		console.log("after addEntries entries date range ", new Date(this.entriesStartDate()), " -> ", new Date(this.entriesEndDate()))
	}

	addEntry(json) {
		this.series().push(json)
		return this
	}

	entryCount() {
		return this.series().length
	}

	entriesStartDate() {
		return this.series()[0].startDate + 1000
	}

	entriesEndDate() {
		return this.series()[this.series().length - 1].startDate - 1000
	}

	entriesWithCount(count) {
		return this.entriesFromToCount(this.entriesStartDate(), this.entriesEndDate(), count)
	}

	entriesFromToCount(startDate, endDate, count) {
		//console.log("entriesFromToCount ", new Date(startDate), " -> ", new Date(endDate))
		//console.log("entries date range ", new Date(this.entriesStartDate()), " -> ", new Date(this.entriesEndDate()))
		if (startDate > endDate) {
			throw new Error("startDate > endDate")
		}
		// TODO compose new entries by calculating high, low, start end
		const period = (endDate - startDate)
		const entries = []
		for (let i = 0; i < count; i++) {
			const d1 = startDate + period * ((i + 0) / count)
			const d2 = startDate + period * ((i + 1) / count)
			//const entry = this.bestForDateRange(d1, d2)
			const entry = this.constructEntryForDateRange(d1, d2)
			entries.push(entry)
		}
		return entries
	}

	constructEntryForDateRange(startDate, endDate) {
		const entries = this.entriesContainingDateRange(startDate, endDate)
		const newEntry = {
			startDate: startDate,
			endDate: endDate,
			low: Number.POSITIVE_INFINITY,
			high: Number.NEGATIVE_INFINITY
		}

		if (entries.length === 0) {
			throw new Error("no entries matching date range: " + new Date(startDate) + " -> " + new Date(endDate))
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

	bestForDateRange(startDate, endDate) {
		const entries = this.entriesContainingDateRange(startDate, endDate)
		let bestEntry = null
		let bestLength = null

		entries.every((entry) => {
			const length = endDate - startDate
			if (bestEntry === null || length < bestLength) {
				bestEntry = entry
				bestLength = length
			}
			// since entries are sorted by startDate, we can bail once we reach a later endDate entry
			if (entry.startDate > endDate) {
				return false
			}
			return true
		})
		return bestEntry
	}

	entriesContainingDateRange(startDate, endDate) {
		// as our entries are sorted by date, we can use binarySearch to quickly find first match 
		// we want an overlapping entry with the smallest span
		const series = this.series()
		const matches = []

		//- 24*60*60*1000
		let startIndex = series.binarySearch(startDate, (a, target) => {
			return (a.startDate < target ? -1 : (a.startDate > target ? 1 : 0));
		})

		//console.log("startIndex: ", startIndex)

		let i = 0
		for (i = startIndex; i < series.length; i++) {
			const entry = series[i]
			if (entry.startDate >= startDate && entry.endDate <= endDate) {
				// do we want to exclude by end date?
				matches.push(entry)
			}

			// since entries are sorted by startDate, we can bail once we reach a later endDate entry
			if (entry.startDate > endDate) {
				break
			}
		}

		/*
		console.log("search: " + startIndex + "-" + i, " = ", (i - startIndex) + "/" + series.length + " ", Math.floor(100*(i - startIndex)/series.length) + "%")

		if (matches.length) {
			const d1 = new Date(matches[0].startDate)
			const d2 = new Date(matches[matches.length - 1].startDate)
			console.log("dates: ", d1.getFullYear() + "-" + d1.getMonth(), " to ", d2.getFullYear() + "-" + d2.getMonth())
		}
		*/

		return matches
	}
}

