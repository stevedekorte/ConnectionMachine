"use strict"

/*

*/

getGlobalThis().SparseMarketDataSearch = class SparseMarketDataSearch extends Base {
	constructor() {
		super()
		this.newSlot("sparseMarketData", null)
		this.newSlot("startDate", null)
		this.newSlot("endDate", null)
		this.newSlot("sampleCount", 1)
		this.newSlot("results", null)
		//this.newSlot("sourceHashAtTimeOfSearch", null) // if the same
		//this.newSlot("searchHash", null)
	}

	search () {
		const results = this.sparseMarketData().entriesFromToCount(this.startDate(), this.endDate(), this.sampleCount())
		this.setResults(results)
		return this
	}
}

