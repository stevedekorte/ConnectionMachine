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
        this._app = null
        this._startKey = "A"
        this._endKey = "S"
        return this
    }

    compositeStyle () {
        return this._compositeStyle
    }

    setStartKey (k) {
        this._startKey = k
        return this
    }

    setEndKey (k) {
        this._endKey = k
        return this
    }

    setTMax (t) {
        this._tMax = t
        return this
    }

    frame () {
        return this._frame
    }

    setOwner (owner) {
        this._owner = owner
        return this
    }

    start () {
        this._t = 0
        this._owner.addActiveAnimation(this)
    }

    end () {
        this.didComplete()
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
        this._owner.removeActiveAnimation(this)
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
        const c = String.fromCharCode(event.keyCode)
        if (c === this._startKey) {
            this.start()
        }
    }

    onKeyUp (event) {
        const c = String.fromCharCode(event.keyCode)
        if (c === this._endKey) {
            this.end()
        }
    }
}

