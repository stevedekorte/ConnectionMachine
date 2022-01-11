"use strict"

String.prototype.contains = function (s) {
	return this.indexOf(s) != -1
}

window.DataTable = class DataTable {
	constructor () {
		this._json = null
		//this._storage = new Storage()
	}

	valuesForColumnName (name) {
		return this.rows().map(row => row[name])
	}

	hasData () {
		return this._json != null
	}

	rows () {
		return this._json.rows
	}

	stringToNumberIfNeeded (cell) {
		const n = parseFloat(cell)
		if (Number.isNaN(n)) {
			return cell
		}
		return n
	}

	rowsName () {
		return Object.keys(this._json).filter(k => k.startsWith("Time Series"))[0]
	}

	setFromJson (json) {
		// TODO: add dates to rows
		this._json = json
		const rowsDict = this._json[this.rowsName()]
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

	/*
	setFromCvsString (s) {
		const lines = s.split("\r\n")
		const rows = lines.map(line => { 
			let cells = line.split(",")
			let strippedCells = cells.map(cell => cell.trim()) 
			strippedCells = strippedCells.map(cell => {
				let n = parseFloat(cell)
				if (Number.isNaN(n)) {
					return cell
				}
				return n
			})
			return strippedCells
		})
		this._headers = rows.shift()
		this._rows = rows
		return this
	}

	lineForRow (row) {
		return row.join(", ") + "\r\n"
	}

	asString () {
		const allRows = []
		allRows.append(this._headers)
		this._rows.forEach(row => allRows.push(row))
		const s = allRows.map(row => this.lineForRow(rows)).join("\r\n")
		return s
	}
*/
}

