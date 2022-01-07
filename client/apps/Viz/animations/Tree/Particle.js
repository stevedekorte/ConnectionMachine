"use strict"


window.Thing = class Thing {
    constructor() {
        return this
    }
}

window.Particle = class Particle extends Thing {
    constructor() {
        super()
        this._intPosition = new Point2d()
        this._position = new Point2d()
        this._velocity = new Point2d().zero()
        //this._acceleration = new Point2d()
        this._animation = null
        this._stopped = false
        this._t = 0
        this._tMax = 2000
        return this
    }

    frame () {
        return this._animation.frame()
    }

    setAnimation (a) {
        this._animation = a
        return this
    }

    animation () {
        return this._animation
    }

    intPosition () {
        return this._intPosition
    }

    position () {
        return this._position
    }

    velocity () {
        return this._velocity
    }

    start () {
        super.start()
    }

    step () {
        this._t ++
        if (this._t > this._tMax) {
            this.animation().removeParticle(this)
            return
        }

        const pos = this.position()
        pos.add(this.velocity())

        if (pos.y() < this.animation().frame().height() - 2) {
            this.drift()
        }

        if (!pos.rounded().equals(this.intPosition())) {
            this.updateIntPosition()
        }
    }

    drift () {
        const pos = this.position()
        if (Math.random() < 0.01) {
            if (Math.random() < 0.5) {
                pos.setX(pos.x() + 1)
            } else {
                pos.setX(pos.x() - 1)
            }
        }
    }

    updateIntPosition () {
        const pos = this.position()
        const np = pos.rounded()

        const ymax = this.frame().height()
        
        let collision = this.animation().hasParticleAtPoint(np)

        if (np.y() === ymax ) {
            collision = true
        }


        if (collision) {
            //this.velocity().setX(0).setY(0)
            pos.copy(this.intPosition())
        } else {
            this.intPosition().copy(np)
        }
        return this
    }

    draw () {
        this.frame()
    }
}
