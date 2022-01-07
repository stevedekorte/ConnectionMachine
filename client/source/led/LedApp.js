"use strict"

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

        this._alwaysNeedsDisplay = true
        this._needsDisplay = true
        //this._needsRender = true
        this._t = 0

        /*
        this.keyboard = Keyboard()
        this.keyboard.setDelegate(this)
        this.keyboard.startListening()
        */

        this.display().setBrightness(0)
        //this.frame().setAllBitsTo(1)
        //this.frame().randomize()

        return this
    }

    setAlwaysNeedsDisplay (b) {
        this._alwaysNeedsDisplay = b
        return this
    }

    alwaysNeedsDisplay () {
        return this._alwaysNeedsDisplay
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
        this._needsDisplay = true
        /*
        if (this.needsDisplay() || this.alwaysNeedsDisplay()) {
            this.render()
        }
        */
        this._t ++
    }

    /*
    render () {

    }
    */

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
            this._needsDisplay = false
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

    onClickLight (event, x, y) {
        /*
        const v = this.frame().getBit(x, y) ? 0 : 1
        this.setNeedsDisplay(true)
        this.frame().setBit(x, y, v)
        */
    }
}


