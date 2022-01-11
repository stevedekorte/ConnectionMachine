"use strict"

/*
    subclass this class to make custom Led apps
*/

Array.prototype.minValue = function () {
    let minValue = Number.POSITIVE_INFINITY
    this.forEach((v) => { if (v < minValue) { minValue = v }})
    return minValue
}

Array.prototype.maxValue = function () {
    let maxValue = Number.NEGATIVE_INFINITY
    this.forEach((v) => { if (v > maxValue) { maxValue = v }})
    return maxValue
}

Array.prototype.normalized = function () {
    const minValue = this.minValue()
    const maxValue = this.maxValue()
    return this.map(v => (v - minValue)/(maxValue - minValue))
}

window.MarketApp = class MarketApp extends LedApp {
    constructor () {
        super();
        this._dataSource = new AlphaVantageAPI()

        this._dataSource.setDelegate(this)
        //this._dataSource.connect()

        this.setFps(5)

        this._needsRender = true

        this._sparseData = new SparseMarketData()
        this._useLogScale = true
        this._startDate = Date.parse("2017-01-01")
        this.loadHistory()
        return this
    }

    loadHistory () {
        const csvTable = new CsvTable().setCsvString(window.btcHistoryCsvString)
        const json = csvTable.json()
        console.log(JSON.stringify(window.bitcoinHistoryJson, 2, 2))
        json.forEach(row => {
            row.startDate = row.date
            row.endDate = row.date + 24*60*60*1000 // plus one day of milliseconds
            delete row.date
        })
        this._sparseData.addEntries(json)
    }

    step () {
        super.step()
        if (this._needsRender) {
            this.render()
            this._needsRender = false
        }
        if (this._currentY) {
            const xmax = this.frame().width()
            const ymax = this.frame().height()
            let r = Math.round(Math.random())
            //console.log(
            this.frame().setXorBit(xmax-1, this._currentY, this._t % 2)
        }

        if (this._dataSource.hasData() && this._t % 2) {
            this._startDate = this._startDate - 30*24*60*60*1000
            this._needsRender = true
        }
    }

    render () {
        this.frame().clear()

        if (this._sparseData.entryCount() === 0) {
            return 
        }

        const xmax = this.frame().width()
        const ymax = this.frame().height()
        const sampleCount = xmax - 1

        const dayPeriod = 24*60*60*1000
        //const startDate = this._startDate 
        const startDate = this._sparseData.entriesStartDate() + dayPeriod
        const endDate = this._sparseData.entriesEndDate() - dayPeriod
		let entries = this._sparseData.entriesFromToCount(startDate, endDate, sampleCount)

        //let entries = this._sparseData.entriesWithCount(sampleCount)
        //const entries = this._sparseData.entriesFromToCount(Date.parse("2019-05-31"), Date.parse("2022-01-11"), sampleCount) 
        //const entries = this._sparseData.entriesFromToCount(Date.parse("2013-04-29"), Date.parse("2021-07-06"), sampleCount) 

        if (this._useLogScale) {
            entries = entries.map(e => {
                return {
                    startDate: e.startDate,
                    endDate: e.endDate,
                    low: Math.log10(e.low),
                    high: Math.log10(e.high),
                    open: Math.log10(e.open),
                    close: Math.log10(e.close)
                }
            })
        }

        let lows  = entries.map(e => e.low)
        let highs = entries.map(e => e.high)
        let opens = entries.map(e => e.open)

        const minValue = lows.minValue()
        const maxValue = highs.maxValue()

        //console.log("minValue: ", minValue)
        //console.log("maxValue: ", maxValue)

        // normalize values between 0 and 1
        lows = lows.map(v => (v - minValue)/(maxValue - minValue))
        highs = highs.map(v => (v - minValue)/(maxValue - minValue))
        opens = opens.map(v => (v - minValue)/(maxValue - minValue))

        // draw y axis high/low bars for each y value
        for (let x = 0; x < sampleCount; x++) {
            const i = x
            const maxHeight = ymax - 2
            const v1 = Math.floor(maxHeight * lows[i])
            const v2 = Math.floor(maxHeight * highs[i])
            this.frame().drawFromTo(x, maxHeight - v1, x, maxHeight - v2)
        }

        // draw y axis ticks
        for (let p = Math.floor(minValue)-1; p <= Math.ceil(maxValue); p++) {
            const y = minValue + p/((maxValue - minValue)/ymax)
            //this.frame().setXorBit(xmax - 1, y, 1)
            this.frame().setBit(xmax - 1, y, 1)
        }

        // draw x ticks
        const startYear = new Date(startDate).getFullYear()
        const endYear = new Date(endDate).getFullYear()
        for (let year = startYear; year < endYear; year++) {
            const d = Date.parse(year, 0, 1)  // year tick 
            const x = Math.floor(sampleCount*(d - startDate)/(endDate - startDate))
            this.frame().setBit(x, ymax - 1, 1)
            console.log("year: ", year, " x:", x)
        }

        // draw current price
        const state = Math.floor(this._t / 100) % 2
        const v = Math.floor(ymax * opens[opens.length -1])
        console.log("v =", v)
        this._currentY = ymax-1 - v
        this.frame().setBit(xmax, ymax-1 - this._currentY, 0)


    }

    onChange (dataSource) {
        this._needsRender = true
	}

    onNewEntries (rows) {
        this._sparseData.addEntries(rows)
        this._needsRender = true
    }
}



