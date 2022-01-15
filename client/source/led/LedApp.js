"use strict"

/*
    subclass this class to make custom Led apps
*/

class LedApp extends Base {
    constructor () {
        super()
        this.newSlot("fps", 1)
        this.newSlot("frame", new LedFrame())
        this.newSlot("display", new LedDisplay().setDelegate(this))
        this.newSlot("htmlDisplay", new HtmlDisplay().setDelegate(this))
        this.htmlDisplay().setup()

        this.newSlot("alwaysNeedsDisplay", true)
        this.newSlot("needsDisplay", true)
        //this.newSlot("needsRender", true)
        this.newSlot("t", 0)

        this.display().setBrightness(0)

        this.newSlot("startTime", null)
        this.newSlot("endTime", null)

        //this.frame().setAllBitsTo(1)
        //this.frame().randomize()

        return this
    }

    step () {
        this.setNeedsDisplay(true)
        /*
        if (this.needsDisplay() || this.alwaysNeedsDisplay()) {
            this.render()
        }
        */
        this.setT(this.t()+1)
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

    beginFrame () {
        this.setStartTime(new Date().getTime())
    }

    endFrame () {
        if (this.needsDisplay()) {
            if (this.display().isConnected()) {
                this.display().frame().copy(this.frame())
                this.display().render()
            } else {
                console.log("display not connected")
            }

            this.htmlDisplay().frame().copy(this.frame())
            this.htmlDisplay().setBrightness(this.display().brightness())
            this.htmlDisplay().render()
            this.setNeedsDisplay(false)
        }
        
        this.setEndTime(new Date().getTime())
        const diffMs = this.endTime() - this.startTime()
        const delayMs = 1000/this.fps()
        let remainingMs = delayMs - diffMs
        if (remainingMs < 0) {
            remainingMs = 0
            console.log("WARNING: render can't keep up with fps rate")
        }
        setTimeout(() => this.frameStep(), remainingMs) 
    }

    onKey (event) {
        console.log("app onKey")
    }

    run () {
        this.display().connect() // after connect, we'll call frameStep to start running steps
        this.htmlDisplay().onWindowResize()

        // might need to wait for connect if we need to get frame dimensions first?
        
        this.frameStep()
        this.htmlDisplay().layout()
        return this
    }

    onLedDisplayOpen () {
        this.display().clear()
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


