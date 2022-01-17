"use strict"

getGlobalThis().GameOfLifeApp = class GameOfLifeApp extends LedApp {
    constructor () {
        super()
        this.setFps(1/5)
        this.newSlot("ca", new CellularAutomata2d())
        this.ca().setupGameOfLifeRules()
    }

    renderRules () {
        const xmax = this.frame().width()
        const ymax = this.frame().height()
        const frame = this.frame()
        let x = 0

        for (let y = 0; y < this.minY(); y++) {
            for (x = 0; x < xmax; x++) {
                frame.setBit(x, y, 0); 
            }
        }

        x = 5

        frame.setBit(x, 0, 1); x++

        this.ca().rulesForOn().forEach(v => {
            frame.setBit(x, 0, v)
            x++
        })
        frame.setBit(x, 0, 1); x++
        frame.setBit(x, 0, 0); x++
        frame.setBit(x, 0, 0); x++
        frame.setBit(x, 0, 1); x++
        this.ca().rulesForOff().forEach(v => {
            frame.setBit(x, 0, v)
            x++
        })
        frame.setBit(x, 0, 1); x++
    }

    step () {
        super.step()
        this.ca().step()
        //this.renderRules()
        this.frame().copy(this.ca().frame())
    }
}
