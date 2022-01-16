"use strict"

getGlobalThis().CellularAutomataApp = class CellularAutomata extends LedApp {
    constructor () {
        super()
        this.newSlot("ca", new CA())
        this.setFps(1/10)
    }

    step () {
        super.step()
/*
        if (this.t() % 15 != 1) {
            return
        }
*/
        this.frame().clear()
        
        this.setupCaForRun()
        this.renderRules()
        this.renderCaRun()
    }

    setupCaForRun () {
        const ca = this.ca()
        ca.mutateRules()
        ca.randomizeCells()
        ca.enforceCellStateSymmetry()
    }

    renderRules () {
        // draw rules at center top
        const xmax = this.frame().width()
        const ymax = this.frame().height()
        const frame = this.frame()
        const ca = this.ca()

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
    }

    renderExpandedRules () {
        // draw rules at center top
        const xmax = this.frame().width()
        const ymax = this.frame().height()
        const frame = this.frame()
        const ca = this.ca()
        const rules = ca.rules()


        const y = 0
        for (let ri = 0; ri < rules.length; ri++) {
            const rule = rules[ri] 
            let x = ri * 4
            frame.setBit(x+0, y+0, rule[0])
            frame.setBit(x+1, y+0, rule[1])
            frame.setBit(x+2, y+0, rule[2])
            frame.setBit(x+1, y+1, rule[3])
        }
    }

    renderCaRun () {
        const xmax = this.frame().width()
        const ymax = this.frame().height()
        const frame = this.frame()
        const ca = this.ca()
        const y1 = 2

        let s = ""
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
    }


}
