"use strict"

getGlobalThis().GameOfLifeApp = class GameOfLifeApp extends LedApp {
    constructor () {
        super()
        this.setFps(1/5)
        this.newSlot("ca", new CellularAutomata2d())
        this.ca().setupGameOfLifeRules()
        this.ca().setWidth(Math.floor(this.frame().width()))
        this.ca().setHeight(Math.floor(this.frame().height()))
    }

    /*
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
    */

    step () {
        const ca = this.ca()
        super.step()
        ca.step()
        //this.renderRules()
        const x1 = Math.floor((this.frame().width() - ca.frame().width())/2)
        const y1 = Math.floor((this.frame().height() - ca.frame().height())/2)
        this.frame().atCompositeFrame(x1, y1, ca.frame())
    }
}
