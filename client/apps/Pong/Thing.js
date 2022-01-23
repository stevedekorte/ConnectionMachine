"use strict"

getGlobalThis().Thing = class Thing extends Base {
    constructor () {
        super()
        this.newSlot("bounds", new Rect2d())
        this.newSlot("position", new Point2d())
        this.newSlot("velocity", new Point2d())
        this.newSlot("bitmap", new LedFrame())
    }

    rect () {
        return new Rect2d().setPosition(this.position()).setBounds(this.bounds())
    }

    step () {
        const newPosition = this.position().add(this.velocity())
        const newRect = new Rect2d().setPosition(newPosition).setBounds(this.bounds())
        const collisions = this.world().objectsInRect(newRect)
        if (collisions.length) {
            collisions.forEach((obj) => { if (obj !== this) { this.onCollisionWith(obj) } })
        } else {
            this.setPosition(newPosition)
        }
    }

    onCollisionWith (obj) {

    }

    setupBitmap () {
        const b = this.bounds()
        for (let y = 0; y < b.height(); y ++) {
            for (let x = 0; x < b.width(); x++) {
                this.bitmaps().setBit(x, y, 1)
            }
        }
    }

    render () {
        this.frame().drawBitmapAtPos(this.bitmap(), this.position())
    }
}
