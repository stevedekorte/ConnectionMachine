"use strict"

getGlobalThis().DataTable = class DataTable extends Base {
	constructor () {
		super()
		this.newSlot("json", null)
		//this._storage = new Storage()
	}

	valuesForColumnName (name) {
		return this.rows().map(row => row[name])
	}

	hasData () {
		return this.json() != null
	}

	rows () {
		return this.json().rows
	}

	stringToNumberIfNeeded (cell) {
		const n = parseFloat(cell)
		if (Number.isNaN(n)) {
			return cell
		}
		return n
	}

	rowsName () {
		return Object.keys(this.json()).filter(k => k.startsWith("Time Series"))[0]
	}

	setFromJson (json) {
		// TODO: add dates to rows
		this.setJson(json)
		const rowsDict = this.json()[this.rowsName()]
		const sortedKeys = Object.keys(rowsDict).sort()
		
		const date1 = sortedKeys.slice().shift()
		const date2 = sortedKeys.slice().pop()
		console.log(date1, " to ", date2)

		const rows = sortedKeys.map(key => {
			const rowDict = rowsDict[key]
			const newDict = {}
			newDict.startDate = Date.parse(key)
			newDict.endDate = newDict.startDate + 24*60*60*1000 // one day
			const keys = Object.keys(rowDict)
			const goodKeys = ["open", "close", "high", "low"]
			keys.forEach(key => {
				const goodKey = goodKeys.filter(gk => key.contains(gk))[0]
				if (goodKey) {
					newDict[goodKey] = this.stringToNumberIfNeeded(rowDict[key])
				}
			})
			return newDict
		})
		
		
		json.rows = rows
		return this
	}
}

