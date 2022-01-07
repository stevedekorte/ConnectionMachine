"use strict"

console.log("CellularAutomataApp")

window.CellularAutomataApp = class CellularAutomata extends LedApp {
    constructor () {
        super()
        this._ca = new CA()
        this.setFps(1)
    }

    step () {
        super.step()

        const ca = this._ca
        const xmax = this.frame().width()
        const ymax = this.frame().height()
        const frame = this.frame()

        
        if (ca.generation() % 32 == 0) {
            //ca.randomizeRules()
            ca.mutateRules()
        }

        
        if (ca.generation() % 32 == 1) {
            ca.randomizeCells()
            ca.mutateCells()
        }

        const y = ca.generation() % ymax

        ca.generate()

        // copy cells to frame
        for (let x = 0; x < xmax; x++) { 
            const v = ca.cells()[x] ? 1 : 0
            frame.setBit(x, y, v)
        }

        /*
        // copy cells from frame
        for (let x = 0; x < xmax; x++) {
            ca.cells[x] = frame.getBit(x, y)
            //console.log("frame:", frame.bits)
        }
        */
    
    }
}
