"use strict"


window.LineRightAnimation = class LineRightAnimation extends LineAnimation {
    constructor() {
        super()
        this.setTMax(this.frame().width() - 1)
        this.setStartKey("D")
        this.setAllowsMany(true)
        return this
    }

    draw() {
        const xmax = this.frame().width()
        const ymax = this.frame().height()

        this.frame().clear()
        const x = (this._t) % xmax
        this.frame().drawFromTo(x, 0, x, ymax)
    }
}

