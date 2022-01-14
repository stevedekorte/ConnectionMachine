"use strict"

/*

    TODO: 

    - drag mouse down to draw

*/

getGlobalThis().LightBrightApp = class LightBrightApp extends LedApp {
    constructor () {
        super()
        this.setFps(30)
        this._lastClickPoint = new Point2d()
        this._frameHistory = []
        this.registerForKeyboardInput()
        this.setAlwaysNeedsDisplay(false)
    }

    onKeyDown (event) {
        super.onKeyDown(event)
        const k = String.fromCharCode(event.which)
        if (event.metaKey && k === "Z") {
            this.undo()
        }
    }

    onKeyUp (event) {
        super.onKeyUp(event)
    }

    snapshot () {
        this._frameHistory.push(this.frame().duplicate())
    }

    undo () {
        const f = this._frameHistory.pop()
        if (f) {
            this.frame().copy(f)
            this.setNeedsDisplay(true)
        }
    }

    
    onClickLight (event, x, y) {
        const lastPoint =  this._lastClickPoint
        this.snapshot()
        if (event.shiftKey) {
            this.frame().drawFromTo(lastPoint.x(), lastPoint.y(), x, y)
        } else {
            // draw dot
            const v = this.frame().getBit(x, y) ? 0 : 1
            this.setNeedsDisplay(true)
            this.frame().setBit(x, y, v)
        }
        lastPoint.set(x, y)
    }

}
