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
        this.newSlot("isListeningToKeyboard", false)
        this.registerForKeyboardInput()

        this.newSlot("isPaused", false)
        this.newSlot("frameStepTimeoutId", null)

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
            this.pushToDisplays()
        }
        
        this.setEndTime(new Date().getTime())

        const delayMs = 1000/this.fps()
        let remainingMs = delayMs
        if (this.startTime()) {
            const diffMs = this.endTime() - this.startTime()
            remainingMs = delayMs - diffMs
            if (remainingMs < 0) {
                remainingMs = 0
                console.log("WARNING: render can't keep up with fps rate")
            }
        }
        
        const tid = setTimeout(() => this.frameStep(), remainingMs) 
        this.setFrameStepTimeoutId(tid)
    }

    cancelFrameStepTimeout () {
        if (this.frameStepTimeoutId()) {
            clearTimeout(this.frameStepTimeoutId())
            this.setFrameStepTimeoutId(null)
        }
    }

    resetFrameStep () {
        this.cancelFrameStepTimeout()
        this.frameStep()
    }

    pushToDisplays () {
        if (this.display().isConnected()) {
            this.display().frame().copy(this.frame())
            this.display().render()
        } else {
            //console.log("display not connected")
        }

        this.htmlDisplay().frame().copy(this.frame())
        this.htmlDisplay().setBrightness(this.display().brightness())
        this.htmlDisplay().render()
        this.setNeedsDisplay(false)
    }

    onKey (event) {
        console.log("app onKey")
    }

    run () {
        this.display().connect()
        this.htmlDisplay().onWindowResize()
        // might need to wait for connect if we need to get frame dimensions first?
        this.frameStep()
        this.htmlDisplay().layout()
        return this
    }

    onLedDisplayOpen () {
        this.display().clear()
        this.pushToDisplays()
    }

    onResizeLedDisplay () {
        // TODO: need to have new frames be same size as display 
    }

    registerForKeyboardInput () {
        if (!this.isListeningToKeyboard()) {
            window.addEventListener('keydown', (event) => { this.onKeyDown(event) }, true);
            window.addEventListener('keyup', (event) => { this.onKeyUp(event) }, true);
            this.setIsListeningToKeyboard(true)
        }
    }

    onKeyDown (event) {
    }

    onKeyUp (event) {
        const k = event.which

        switch (event.key) {
            case "ArrowLeft":
                break;
            case "ArrowRight":
                // Right pressed
                break;
            case "ArrowUp":
                this.setFps(Math.min(200, this.fps() * 1.25))
                this.resetFrameStep()
                break;
            case "ArrowDown":
                this.setFps(Math.max(1/15, this.fps() * 0.75))
                this.resetFrameStep()
                break;
        }

        if (event.which === 32 && event.shiftKey) { // space key
            this.setIsPaused(!this.isPaused())
            if (this.isPaused()) {
                this.cancelFrameStepTimeout()
            } else {
                this.resetFrameStep()
            }
        }
    }

    onClickLight (event, x, y) { // sent by HtmlDisplay
        /*
        const v = this.frame().getBit(x, y) ? 0 : 1
        this.setNeedsDisplay(true)
        this.frame().setBit(x, y, v)
        */
    }
}


