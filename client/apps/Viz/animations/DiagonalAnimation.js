"use strict"

window.DiagonalAnimation = class DiagonalAnimation extends LineAnimation {
    constructor() {
        super()
        this.setTMax(this.frame().width() * 2 - 1)
        this.setStartKey("Q")
        this.setAllowsMany(true)
        return this
    }

    draw() {
        const xmax = this.frame().width()
        const ymax = this.frame().height()

        this.frame().clear()
        const x = (this._t) // % xmax
        this.frame().drawFromTo(x, 0, 0, x)
    }
}
