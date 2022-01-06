"use strict"


window.ChristmasTreeMask = class ChristmasTreeMask extends Animation {
    constructor(self) {
        super()
        this.setTMax(10)
        this.setStartKey("T")
        this.setEndKey("Y")
        this.setAllowsMany(false)
        this.setCompositeStyle("xor")
        this.setup()
        return this
    }

    start() {
        super.start()
    }

    setup() {
        const xmax = this.frame().width()
        const ymax = this.frame().height()

        this.frame().clear()

        //const bitFunc = function(i) { return Math.random() > 0.2 }
        const bitFunc = function (i, x, y) { return y % 3 === 0 } //&& x*y % 2 !== 1}
        const y = ymax - 5
        const inset = 5
        for (let x = inset; x < xmax - inset; x++) {
            this.frame().drawFromTo(x, y, Math.floor(xmax / 2), 0, bitFunc)
        }

        //this.frame().drawFromTo(1, y, Math.floor(xmax/2), 0) 
        //this.frame().drawFromTo(xmax -2, y, Math.floor(xmax/2)-1, 0) 
        //this.frame().drawFromTo(1, y, xmax -2, y) 

        /*
        for (let x = 0; x < xmax/2; x++) {
            this.frame().drawFromTo(x, ymax-1, Math.floor(xmax/2), 0) 
        }

        for (let x = xmax/2; x < xmax -1; x++) {
            this.frame().drawFromTo(x, ymax-1, Math.floor(xmax/2) + 1, 0) 
        }
        */

        const mx = Math.floor(xmax / 2)
        this.frame().drawFromTo(mx - 1, y, mx - 1, ymax)
        this.frame().drawFromTo(mx, y, mx, ymax)
        this.frame().drawFromTo(mx + 1, y, mx + 1, ymax)
        //this.frame().drawFromTo(0, ymax-1, xmax, ymax-1) 

    }

    draw() {
        this.frame()
    }
}
