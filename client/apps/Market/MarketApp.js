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

getGlobalThis().MarketApp = class MarketApp extends LedApp {
    constructor () {
        super()
        this.newSlot("dataSource", new AlphaVantageAPI().setDelegate(this))
        this.newSlot("currentY", null)
        this.newSlot("needsRender", true)

        this.newSlot("sparseData", new SparseMarketData())
        this.newSlot("useLogScale", true)
        this.newSlot("startDate",Date.parse("2011-01-01") )
        this.newSlot("endDate", null )



        //this.dataSource().connect()

        this.setFps(20)

        this.loadHistory()
        return this
    }

    loadHistory () {
        const csvTable = new CsvTable().setCsvString(getGlobalThis().btcHistoryCsvString)
        const json = csvTable.json()
        console.log(JSON.stringify(window.bitcoinHistoryJson, 2, 2))
        json.forEach(row => {
            row.startDate = row.date
            row.endDate = row.date + 24*60*60*1000 // plus one day of milliseconds
            delete row.date
        })
        this.sparseData().addEntries(json)
    }

    step () {
        super.step()
        if (this.needsRender()) {
            this.render()
            this.setNeedsRender(false)
        }
        if (this.currentY() !== null) {
            const xmax = this.frame().width()
            const ymax = this.frame().height()
            //let r = Math.round(Math.random())
            const b = Math.floor(new Date(Date.now()).getSeconds()) % 2 ? 1:0
            this.frame().setBit(xmax-2, this.currentY(), b)
        }

        if (this.sparseData().entryCount() && this._t % 2) {
            const firstDate = this.sparseData().entriesStartDate()
            if (this.startDate() > firstDate) {
                this.setStartDate(this.startDate() - 30*24*60*60*1000)
                this.setNeedsRender(true)
            } else {
                this.setStartDate(firstDate - 24*60*60*1000)
            }
        }
    }

    render () {
        this.frame().clear()

        if (this.sparseData().entryCount() === 0) {
            return 
        }

        const xmax = this.frame().width()
        const ymax = this.frame().height()
        const sampleCount = xmax - 1

        const dayPeriod = 24*60*60*1000
        const startDate = this.startDate() 
        //const startDate = this.sparseData().entriesStartDate() + dayPeriod
        const endDate = this.sparseData().entriesEndDate() - dayPeriod
		let entries = this.sparseData().entriesFromToCount(startDate, endDate, sampleCount)

        //let entries = this.sparseData().entriesWithCount(sampleCount)
        //const entries = this.sparseData().entriesFromToCount(Date.parse("2019-05-31"), Date.parse("2022-01-11"), sampleCount) 
        //const entries = this.sparseData().entriesFromToCount(Date.parse("2013-04-29"), Date.parse("2021-07-06"), sampleCount) 

        if (this.useLogScale()) {
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
            //console.log("year: ", year, " x:", x)
        }

        // draw current price
        const state = Math.floor(this.t() / 100) % 2
        const v = Math.floor(ymax * opens[opens.length -1])
        //console.log("v =", v)
        this.setCurrentY(ymax-1 - v)
        this.frame().setBit(xmax, ymax-1 - this.currentY(), 0)
        return this
    }

    onChange (dataSource) {
        this.setNeedsRender(true)
	}

    onNewEntries (rows) {
        this.sparseData().addEntries(rows)
        this.setNeedsRender(true)
    }
}



