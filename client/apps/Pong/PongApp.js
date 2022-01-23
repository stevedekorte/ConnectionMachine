"use strict"

getGlobalThis().PongApp = class PongApp extends LedApp {
    constructor () {
        super()
        this.setFps(3)
        this.newSlot("paddle1", new Paddle())
        this.newSlot("paddle2", new Paddle())
        this.newSlot("ball", new Ball())
        this.newSlot("objects", [])
        this.addObject(this.paddle1())
        this.addObject(this.paddle2())
        this.addObject(this.ball())
    }

    addObject (anObject) {
        anObject.setParentObject(this)
        this.objects().push(anObject)
        return this
    }

    step () {
        super.step()
        this.objects().slice().forEach(obj => obj.step())
        this.render()
    }

    render () {
        this.objects().forEach(obj => obj.render())
    }
}
