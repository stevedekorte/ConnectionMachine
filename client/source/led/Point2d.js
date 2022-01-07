"use strict"

window.Point2d = class Point2d {
    constructor() {
        this._x = 0
        this._y = 0
        return this
    }

    set (x, y) {
        this.setX(x)
        this.setY(y)
        return this
    }

    x() {
        return this._x
    }

    y() {
        return this._y
    }

    setX(v) {
        this._x = v
        //this._x = Math.round(v)
        return this
    }

    setY(v) {
        this._y = v
        //this._y = Math.round(v)
        return this
    }

    add(p) {
        this.setX(this.x() + p.x())
        this.setY(this.y() + p.y())
        return this
    }

    subtract(p) {
        this.setX(this.x() - p.x())
        this.setY(this.y() - p.y())
        return this
    }

    multiplyScalar(v) {
        this.setX(this.x() * v)
        this.setY(this.y() * v)
        return this
    }

    round() {
        this.setX(Math.round(this.x()))
        this.setY(Math.round(this.y()))
        return this
    }

    equals(p) {
        return this.x() === p.x() && this.y() === p.y()
    }

    copy(p) {
        this.setX(p.x())
        this.setY(p.y())
        return this
    }

    clone() {
        const p = new Point2d()
        p.copy(this)
        return p
    }

    rounded() {
        return this.clone().round()
    }

    multipliedByScalar(v) {
        const p = this.clone().multiplyScalar(v)
        return p
    }

    zero () {
        this.setX(0)
        this.setY(0)
        return this
    }
}
