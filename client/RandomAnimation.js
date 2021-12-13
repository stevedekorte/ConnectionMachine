/*

*/

class RandomAnimation extends Animation {
    constructor (self) {
        super()
        this.setTMax(3)
        this.setStartKey("R")
        return this
    }

    step () {
        if (this._t < this._tMax) {
            this._t ++
            this.frame().randomize()
        } else {
            this.end()
        }
    }
}

class LineAnimation extends Animation {
    constructor (self) {
        super()
        this.setTMax(32)
        this.setStartKey("L")
        return this
    }

    step () {
        if (this._t < this._tMax) {
            this._t ++
            this.frame().randomize()
        } else {
            this.end()
        }
    }
}


