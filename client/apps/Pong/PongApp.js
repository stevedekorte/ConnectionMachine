"use strict"

getGlobalThis().PongApp = class PongApp extends LedApp {
    constructor () {
        super()
        this.setFps(3)
        this._paddle1 = new Paddle()
        this._paddle2 = new Paddle()
        this._ball = new Ball()
        this._objects = [this._paddle1, this._paddle2, this._ball]
    }

    step () {
        super.step()
        
        this._objects.foreach(obj => obj.step())

        this.render()
    }

    render () {
        this._objects.foreach(obj => obj.render())

    }
}
