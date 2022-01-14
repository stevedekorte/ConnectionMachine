"use strict"


getGlobalThis().LineDownAnimation = class LineDownAnimation extends LineAnimation {
    constructor() {
        super()
        this.setTMax(this.frame().height() - 1)
        this.setStartKey("S")
        this.setAllowsMany(true)
        return this
    }

    draw() {
        const xmax = this.frame().width()
        const ymax = this.frame().height()

        this.frame().clear()
        const y = this._t % ymax
        this.frame().drawFromTo(0, y, xmax, y)
    }
}
