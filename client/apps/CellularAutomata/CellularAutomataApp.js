"use strict"

getGlobalThis().CellularAutomataApp = class CellularAutomata extends LedApp {
    constructor () {
        super()
        this.newSlot("ca", new CA())
        this.setFps(1)
    }

    step () {
        super.step()

        if (this.t() % 15 != 1) {
            return
        }

        const ca = this.ca()
        const xmax = this.frame().width()
        const ymax = this.frame().height()
        const frame = this.frame()
        

        ca.mutateRules()
        ca.randomizeCells()


        frame.clear()

        // draw rules at center top

        const ruleString = ca.ruleString()

        let x = Math.floor(xmax/2) - Math.floor(ruleString.length/2) - 1
        frame.setBit(x, 0, 1); x ++
        for (let i = 0; i < ruleString.length; i++) {
            let b = ruleString[i] 
            if (b === "1") {
                frame.setBit(x, 0, 1)
            }
            x ++
        }
        frame.setBit(x, 0, 1)

        // generate CA below

        const y1 = 2

        let s= ""
        for (let y = y1; y < ymax - 1; y++) {

            // copy cells to frame
            for (let x = 0; x < xmax; x++) { 
                const v = ca.cells()[x] ? 1 : 0
                frame.setBit(x, y, v)
                s += v
                //console.log("set bit ", x, " ", y, " ", v)
            }
            s += "\n"

            ca.generate()
        }

        console.log(s)
        console.log("---")
        /*
        // copy cells from frame
        for (let x = 0; x < xmax; x++) {
            ca.cells[x] = frame.getBit(x, y)
            //console.log("frame:", frame.bits)
        }
        */
    }
}
