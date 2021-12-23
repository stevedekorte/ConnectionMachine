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
        this._endKey = null
        this._endKey = "S"
        this._allowsMany = true
        return this
    }

    allowsMany () {
        return this._allowsMany
    }

    setAllowsMany (aBool) {
        this._allowsMany = aBool
        return this
    }

    setCompositeStyle (aStyle) {
        this._compositeStyle = aStyle
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
        let instance = this

        if (this.allowsMany()) {
            instance = new this.__proto__.constructor()
            instance.setCompositeStyle(this.compositeStyle()) // TODO: something cleaner
        }

        this._owner.addActiveAnimation(instance)
    }

    end () {
        this.didComplete()
    }

    step () {
        if (this._tMax === null || this._t < this._tMax) {
            this._t ++
            this.draw()
        }
    }

    draw () {

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

            if (event.getModifierState("Control")) {
                this.setCompositeStyle("or")
            }

            if (event.getModifierState("Alt")) {
                this.setCompositeStyle("xor")
            }

            if (event.getModifierState("Shift")) {
                this.setCompositeStyle("and")
            }


            this.start()
        }

        if (c === this._endKey) {
            this.end()
        }
    }

    onKeyUp (event) {
        const c = String.fromCharCode(event.keyCode)
        if (c === this._endKey) {
            this.end()
        }
    }
}

