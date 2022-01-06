"use strict"

window.LineUpAnimation = class LineUpAnimation extends LineAnimation {
    constructor(self) {
        super()
        this.setTMax(this.frame().height() - 1)
        this.setStartKey("W")
        this.setAllowsMany(true)
        return this
    }

    draw() {
        const xmax = this.frame().width()
        const ymax = this.frame().height()

        this.frame().clear()
        const y = (ymax - this._t) % ymax
        this.frame().drawFromTo(0, y, xmax, y)
    }
}

