"use strict"


window.AltAnimation = class AltAnimation extends LineAnimation {
    constructor(self) {
        super()
        this.setTMax(10)
        this.setStartKey("E")
        this.setAllowsMany(true)
        this.setCompositeStyle("and")
        return this
    }

    draw() {
        const xmax = this.frame().width()
        const ymax = this.frame().height()

        this.frame().clear()
        const x = (this._t) // % xmax
        for (let x = 0; x < xmax; x++) {
            for (let y = 0; y < ymax; y++) {
                if ((x + (y % 2)) % 2 === 0) {
                    this.frame().setBit(x, y, 1)
                }
            }
        }
    }
}

