"use strict"

getGlobalThis().Ball = class Ball extends Thing {
    constructor () {
        super()
        this._position = new Point2d()
        this._velocity = new Point2d()
    }

    step () {
        const np = this._position.add(this._velocity)
        // check for collision in new position

        // bounce X or bounce Y?
    }
}
