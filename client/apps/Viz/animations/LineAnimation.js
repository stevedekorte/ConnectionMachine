"use strict"


// --------------------------------------------

window.LineAnimation = class LineAnimation extends Animation {
    constructor() {
        super()
        this.setTMax(this.frame().width())
        this.setStartKey("L")
        this.setAllowsMany(true)
        this.setCompositeStyle("or")
        return this
    }

    step() {
        if (this._t < this._tMax) {
            this._t++
            this.draw()
        } else {
            this.frame().clear()
            this.end()
        }
    }

    draw() {
    }
}
