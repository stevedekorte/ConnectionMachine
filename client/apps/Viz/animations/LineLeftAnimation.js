"use strict"


window.LineLeftAnimation = class LineLeftAnimation extends LineAnimation {
    constructor(self) {
        super()
        this.setTMax(this.frame().width() - 1)
        this.setStartKey("A")
        this.setAllowsMany(true)
        return this
    }

    draw() {
        const xmax = this.frame().width()
        const ymax = this.frame().height()

        this.frame().clear()
        const x = (xmax - this._t) % xmax
        this.frame().drawFromTo(x, 0, x, ymax)
    }
}
