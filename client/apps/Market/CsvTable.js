
class CsvTable {
	constructor () {
		this._json = null
	}

	setColumnNames (names) {
		this._columnNames = names
		return this
	}

	columnNames () {
		return this._columnNames
	}

	json () {
		return this._json
	}

	setCsvString (csv) {
		this._json = this.jsonForCsvString(csv)
		return this
	}

	jsonForCsvString (csv) {
		const lineBreak = csv.indexOf("\r\n") === -1 ? "\n" : "\r\n"
		const lines = csv.split(lineBreak)
		const columnNames = lines.shift().split(",").map(s => s.trim()).map(s => s.toLowerCase())
		this.setColumnNames(columnNames)
		const json = lines.map(line => this.rowForLine(line))
		return json
	}

	rowForLine (aLine) {
		const cells = aLine.split(",").map(cell => this.formattedCell(cell))
		const row = {}
		for (let i = 0; i < cells.length; i ++) {
			const columnName = this.columnNames()[i]
			const value = cells[i]
			row[columnName] = value
		}
		return row
	}

	formattedCell (cell) {
		cell = cell.trim()
		const asNumber = parseFloat(cell)
		const asDate = Date.parse(cell)
		
		if ((cell.indexOf(" ") != -1 || cell.split("-").length > 2) && asDate) {
			return asDate
		}
		
		if (!Number.isNaN(asNumber)) {
			return asNumber
		}

		return cell
	}
}
