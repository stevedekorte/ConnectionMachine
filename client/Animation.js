/*

*/

class Animation {
    constructor (self) {
        this._tMax = 100
        this._t = 0
        this._frame = new LedFrame()
        this._compositeStyle = "or"
        this._owner = null
        this._isPaused = false
        return this
    }

    step () {
        if (this._t < this._tMax) {
            this._t ++
            this.frame().randomize()
        }
    }

    isDone () {
        return this._tMax !== null && this._t >= this._tMax
    }

    didComplete () {
        this._owner.didCompleteAnimation(this)
    }
    
    pause () {
        this._isPaused = true
    }

    resume () {
        this._isPaused = false
    }

    togglePause () {
        this._isPaused = !this._isPaused
    }

    compositeToFrame (destinationFrame) {
        destinationFrame.compositeWithStyle(this._frame, this._compositeStyle)
    }

    onKeyDown (event) {
    }

    onKeyUp (event) {
    }
}

