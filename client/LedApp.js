/*
    subclass this class to make custom Led apps
*/

class LedApp {
    constructor () {
        this._fps = 1
        this._frame = new LedFrame()

        this._display = new LedDisplay()
        this._display.setDelegate(this)

        this._htmlDisplay = new HtmlDisplay()
        this._htmlDisplay.setDelegate(this)
        this._htmlDisplay.setup()

        this._needsDisplay = true
        this._t = 0

        /*
        this.keyboard = Keyboard()
        this.keyboard.setDelegate(self)
        this.keyboard.startListening()
        */

        this.display().setBrightness(0)
        //this.frame().setAllBitsTo(1)
        //this.frame().randomize()

        return this
    }

    display () {
        return this._display
    }

    setNeedsDisplay (aBool) {
        this._needsDisplay = aBool
        return this
    }

    setFps (v) {
        this._fps = v
        return this
    }

    step () {
        this.setNeedsDisplay(true)
        /*
        if (this._t % 200 === 0) {
            for (let i = 0; i < 100; i++) {
                this.frame().addOneRandomOnBit()
            }
        }
        */
        this._t ++
    }

    didCompleteAnimation (anAnimation) {

    }
    
    frameStep () {
        this.beginFrame()
        this.step()
        this.endFrame()
    }

    frame () {
        return this._frame
    }

    beginFrame () {
        this._startTime = new Date().getTime()
    }

    endFrame () {
        if (this._needsDisplay) {
            if (this._display.isConnected()) {
                this._display.frame().copy(this.frame())
                this._display.render()
            }

            this._htmlDisplay.frame().copy(this.frame())
            this._htmlDisplay.setBrightness(this._display.brightness())
            this._htmlDisplay.render()
        }
        
        this._endTime = new Date().getTime()
        const diffMs = this._endTime - this._startTime
        const delayMs = 1000/this._fps
        let remainingMs = delayMs - diffMs
        if (remainingMs < 0) {
            remainingMs = 0
            console.log("WARNING: render can't keep up with fps rate")
        }
        setTimeout(() => this.frameStep(), remainingMs) 
    }

    randomFramesStep () {
        this.beginFrame()
        this._frame.randomize()
        this.endFrame() 
    }

    onKey (event) {
        console.log("app onKey")
    }

    run () {
        this._display.connect() // after connect, we'll call frameStep to start running steps
        this._htmlDisplay.onWindowResize()

        // might need to wait for connect if we need to get frame dimensions first?
        this.frameStep()
        this._htmlDisplay.layout()
    }

    onLedDisplayOpen () {
        this._display.clear()
    }

    registerForKeyboardInput () {
        window.addEventListener('keydown', (event) => { this.onKeyDown(event) }, true);
        window.addEventListener('keyup', (event) => { this.onKeyUp(event) }, true);
    }

    onKeyDown (event) {
    }

    onKeyUp (event) {

    }

    onClickLight (x, y) {
        const v = this.frame().getBit(x, y) ? 0 : 1
        this.frame().setBit(x, y, v)
    }
}


// ----------------------------

class Branch {
    constructor () {
        this._angle = -90
        //this._direction = new Point2d().set(1, 1)
        this._position = new Point2d()
        this._length = 6
        this._parent = null
        this._depth = 0
        this._children = []
        this._maxDepth = 3
        //this._rotationIncrement = 45
        this._seed = Math.random()
    }

    rotationIncrement () {        
        if (this._seed < 0.0) {
            return 45
        }
        return 90
    }

    setSeed (v) {
        this._seed = v
        return this
    }

    rotateClockwise () {
        const d = this.direction()
        this.setAngle(this.angle() + this.rotationIncrement())
    }

    rotateCounterClockwise () {
        const d = this.direction()
        this.setAngle(this.angle() - this.rotationIncrement())
    }

    /*
    direction () {
        return this._direction
    }
    */

    setAngle (v) {
        this._angle = Math.floor(v) % 360
        return this
    }

    angle () {
        return this._angle
    }

    direction () {
        const a = this.angle()
        const radians = (a/360)*2 * Math.PI
        let dx = Math.cos(radians)
        let dy = Math.sin(radians)

        const m = 0.001
        if (dx > m) { dx = 1 } else if (dx < -m) { dx = -1 } else { dx = 0 }
        if (dy > m) { dy = 1 } else if (dy < -m) { dy = -1 } else { dy = 0 }

        //dx = Math.floor(dx)
        //dy = Math.floor(dy)
        return new Point2d().set(dx, dy)
    }

    length () {
        return this._length
    }

    setLength (v) {
        this._length = v
        return this
    }

    chooseLength () {
        if (this.depth() === 0) {
            this.setLength(0)
        } else {
            //const f = Math.sqrt(1 + this.depth()) 
            const f = 1 / (1 + this.depth() * this.depth())
            //const v = Math.floor(this._seed * 8 * f )
            const v = 2+ Math.floor(12*f*this._seed)
            this.setLength(1 + v)
        }
        //this.setLength(1 + /(this.depth()+1))
        //this.setLength(1 +  (this._maxDepth - this.depth())*4)
        return this
    }


    depth () {
        return this._depth
    }

    setDepth (v) {
        this._depth = v
        return this
    }

    position () {
        return this._position
    }

    setParent (aBranch) {
        this._parent = aBranch
        return this
    }

    parent () {
        return this._parent
    }

    frame () {
        return this.parent().frame()
    }

    rotate (d) {
        if (d === 1) {
            this.rotateClockwise()
        } else if (d === -1) {
            this.rotateCounterClockwise() 
        }
    }

    newBranch (d, seed) {
        const b = new Branch()
        b.setParent(this)
        b.setSeed(seed)
        b.position().copy(this.endPosition())
        b.setDepth(this.depth() + 1)
        b.setAngle(this.angle())
        b.rotate(d)
        b.chooseLength()
        this._children.push(b)
        return b
    }
    
    grow () {
        const seed = globalRandomSet.at(this.depth())
        this.newBranch(1, seed)
        this.newBranch(0, seed)
        this.newBranch(-1, seed)

        if (this.depth() < this._maxDepth) {
            this._children.forEach(c => c.grow())
        }
    }

    endPosition () {
        const p = this.position()
        const endPos = this.direction().multipliedByScalar(this.length()).add(p)
        return endPos
    }

    render () {
        const p = this.position()
        const endPos = this.endPosition()
        if (this.depth() < 40) {
            this.frame().drawFromTo(p.x(), p.y(), endPos.x(), endPos.y())
        } else {
            //this.frame().setBit(p.x(), p.y(), 1)
            this.frame().setBit(endPos.x(), endPos.y(), 1)
        }
        this._children.forEach(c => c.render())
    }

    center () {
        this.position().setX(Math.floor(this.frame().width()/2)).setY(Math.floor(this.frame().height()/2))
    }

    firstGen () {
        this.chooseLength()
        this.center()
        this.grow()
        this.render()
    }

}


class SnowflakeApp extends LedApp {
    constructor () {
        super()
        this.display().setBrightness(15)
    }

    step () {
        super.step()
        if (this._t % 10 === 1) {
            this.frame().clear()
            //globalRandomSet.clear()
            globalRandomSet.mutate()

            let a = 180

            for (let i = 0; i < 2; i++) {
                let b = new Branch()
                b.setAngle(a)
                b.setParent(this)
                b.firstGen()

                a += 180
            }

           // this.frame().randomize()
            //this.frame().mirrorLeftToRight()
            //this.frame().mirrorTopToBottom()
            //this.frame().mirrorDiagonal()
        }
    }

}

class RandomSet {
    constructor () {
        this._dict = {}
    }

    clear () {
        this._dict = {}
    }

    at (i) {
        const d = this._dict
        if (d [i] === undefined) {
            d[i] = Math.random() 
        }
        return d[i]
    }

    mutate () {
        const d = this._dict
        const e = Object.entries(d)
        const i = Math.floor(Math.random() * e.length)
        d[i] = Math.random() 
        return this
    }
}

globalRandomSet = new RandomSet()

