"use strict"

/*

*/

window.RandomAnimation = class RandomAnimation extends Animation {
    constructor(self) {
        super()
        this.setTMax(30)
        this.setStartKey("R")
        return this
    }

    setCompositeStyle(s) {
        super.setCompositeStyle(s)
        return this
    }

    step() {
        if (this._t < this._tMax) {
            if (this._t % 10 === 0) {
                this.frame().randomize()
            }
            this._t++
        } else {
            this.end()
        }
    }
}

