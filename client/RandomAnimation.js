/*

*/

console.log("RandomAnimation")

class RandomAnimation extends Animation {
    constructor(self) {
        super()
        this.setTMax(30)
        this.setStartKey("R")
        return this
    }

    setCompositeStyle(s) {
        super.setCompositeStyle(s)
        return this
    }

    step() {
        if (this._t < this._tMax) {
            if (this._t % 10 === 0) {
                this.frame().randomize()
            }
            this._t++
        } else {
            this.end()
        }
    }
}

// --------------------------------------------

class LineAnimation extends Animation {
    constructor(self) {
        super()
        this.setTMax(this.frame().width())
        this.setStartKey("L")
        this.setAllowsMany(true)
        this.setCompositeStyle("or")
        return this
    }

    step() {
        if (this._t < this._tMax) {
            this._t++
            this.draw()
        } else {
            this.frame().clear()
            this.end()
        }
    }

    draw() {
    }
}

class LineDownAnimation extends LineAnimation {
    constructor(self) {
        super()
        this.setTMax(this.frame().height() - 1)
        this.setStartKey("S")
        this.setAllowsMany(true)
        return this
    }

    draw() {
        const xmax = this.frame().width()
        const ymax = this.frame().height()

        this.frame().clear()
        const y = this._t % ymax
        this.frame().drawFromTo(0, y, xmax, y)
    }
}

class LineUpAnimation extends LineAnimation {
    constructor(self) {
        super()
        this.setTMax(this.frame().height() - 1)
        this.setStartKey("W")
        this.setAllowsMany(true)
        return this
    }

    draw() {
        const xmax = this.frame().width()
        const ymax = this.frame().height()

        this.frame().clear()
        const y = (ymax - this._t) % ymax
        this.frame().drawFromTo(0, y, xmax, y)
    }
}


class LineLeftAnimation extends LineAnimation {
    constructor(self) {
        super()
        this.setTMax(this.frame().width() - 1)
        this.setStartKey("A")
        this.setAllowsMany(true)
        return this
    }

    draw() {
        const xmax = this.frame().width()
        const ymax = this.frame().height()

        this.frame().clear()
        const x = (xmax - this._t) % xmax
        this.frame().drawFromTo(x, 0, x, ymax)
    }
}

class LineRightAnimation extends LineAnimation {
    constructor(self) {
        super()
        this.setTMax(this.frame().width() - 1)
        this.setStartKey("D")
        this.setAllowsMany(true)
        return this
    }

    draw() {
        const xmax = this.frame().width()
        const ymax = this.frame().height()

        this.frame().clear()
        const x = (this._t) % xmax
        this.frame().drawFromTo(x, 0, x, ymax)
    }
}

class DiagonalAnimation extends LineAnimation {
    constructor(self) {
        super()
        this.setTMax(this.frame().width() * 2 - 1)
        this.setStartKey("Q")
        this.setAllowsMany(true)
        return this
    }

    draw() {
        const xmax = this.frame().width()
        const ymax = this.frame().height()

        this.frame().clear()
        const x = (this._t) // % xmax
        this.frame().drawFromTo(x, 0, 0, x)
    }
}

class AltAnimation extends LineAnimation {
    constructor(self) {
        super()
        this.setTMax(10)
        this.setStartKey("E")
        this.setAllowsMany(true)
        this.setCompositeStyle("and")
        return this
    }

    draw() {
        const xmax = this.frame().width()
        const ymax = this.frame().height()

        this.frame().clear()
        const x = (this._t) // % xmax
        for (let x = 0; x < xmax; x++) {
            for (let y = 0; y < ymax; y++) {
                if ((x + (y % 2)) % 2 === 0) {
                    this.frame().setBit(x, y, 1)
                }
            }
        }
    }
}

// -------------------------------------------------------

class ChristmasTreeMask extends Animation {
    constructor(self) {
        super()
        this.setTMax(10)
        this.setStartKey("T")
        this.setEndKey("Y")
        this.setAllowsMany(false)
        this.setCompositeStyle("xor")
        this.setup()
        return this
    }

    start() {
        super.start()
    }

    setup() {
        const xmax = this.frame().width()
        const ymax = this.frame().height()

        this.frame().clear()

        //const bitFunc = function(i) { return Math.random() > 0.2 }
        const bitFunc = function (i, x, y) { return y % 3 === 0 } //&& x*y % 2 !== 1}
        const y = ymax - 5
        const inset = 5
        for (let x = inset; x < xmax - inset; x++) {
            this.frame().drawFromTo(x, y, Math.floor(xmax / 2), 0, bitFunc)
        }

        //this.frame().drawFromTo(1, y, Math.floor(xmax/2), 0) 
        //this.frame().drawFromTo(xmax -2, y, Math.floor(xmax/2)-1, 0) 
        //this.frame().drawFromTo(1, y, xmax -2, y) 

        /*
        for (let x = 0; x < xmax/2; x++) {
            this.frame().drawFromTo(x, ymax-1, Math.floor(xmax/2), 0) 
        }

        for (let x = xmax/2; x < xmax -1; x++) {
            this.frame().drawFromTo(x, ymax-1, Math.floor(xmax/2) + 1, 0) 
        }
        */

        const mx = Math.floor(xmax / 2)
        this.frame().drawFromTo(mx - 1, y, mx - 1, ymax)
        this.frame().drawFromTo(mx, y, mx, ymax)
        this.frame().drawFromTo(mx + 1, y, mx + 1, ymax)
        //this.frame().drawFromTo(0, ymax-1, xmax, ymax-1) 

    }

    draw() {
        this.frame()
    }
}

// --------------------------------------------------------------


class Point2d {
    constructor(self) {
        this._x = 0
        this._y = 0
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
}

class Thing {
    constructor(self) {
        return this
    }
}



class Particle extends Thing {
    constructor(self) {
        super()
        this._intPosition = new Point2d()
        this._position = new Point2d()
        this._velocity = new Point2d()
        //this._acceleration = new Point2d()
        this._animation = null
        this._stopped = false
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
        const pos = this.position()
        pos.add(this.velocity())

        if (!pos.rounded().equals(this.intPosition())) {
            this.updateIntPosition()
        }
    }

    updateIntPosition () {
        const pos = this.position()
        const np = pos.rounded()

        const ymax = this.frame().height()
        
        let collision = this.animation().hasParticleAtPoint(np)

        //let collision = this.frame().getBit(np.x(), np.y()) === 1

        //console.log(np.x() + " " + np.y() + " bit " + collision)

        if (collision) {
            console.log("collision")
        }


        if (np.y() === ymax - 1) {
            console.log(np.x() + " " + np.y() + " bit " + collision)
            let c = this.frame().getBit(np.x(), np.y())
            this.animation().hasParticleAtPoint(np)
        }

        if (np.y() === ymax ) {
            collision = true
        }

        /*
            if (Math.random() < 0.1) {
                if (Math.random() < 0.5) {
                    pos.setX(pos.x() + 1)
                } else {
                    pos.setX(pos.x() - 1)
                }
            }
        */

        if (collision) {
            this.velocity().setX(0).setY(0)
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

class ParticlesAnimation extends Animation {
    constructor(self) {
        super()
        this.setTMax(null)
        this.setStartKey("P")
        this.setEndKey("O")
        this.setAllowsMany(true)
        this._particleCount = 1
        this._particles = []
        this._xmax = 32
        this.setup()
        return this
    }

    hasParticleAtPoint (aPoint) {
        for (let i = 0; i < this.particles(); i ++) {
            const p = this.particles()[i]
            if (p.intPosition().equals(aPoint)) {
                return true
            }
        }
        return false
    }

    onKeyDown(e) {
        return super.onKeyDown(e)
    }

    particles() {
        return this._particles
    }

    xmax() {
        return this._xmax
    }

    ymax() {
        return this._xmax
    }

    setup() {
        for (let i = 0; i < this._particleCount; i++) {
            this.newParticle()
        }
        this.particles().forEach(p => this.placeParticle(p))
    }

    newParticle() {
        const p = new Particle()
        p.setAnimation(this)
        this.particles().push(p)
        this.placeParticle(p)
        return p
    }

    placeParticle(p) {
        const x = Math.floor(Math.random() * this.xmax())
        //p.position().setX(x)
        p.position().setY(0 - Math.random() * 3)
        p.velocity().setY(0.1 * (Math.random() * 0.5 + 0.5))
    }

    draw() {
        const xmax = this.frame().width()
        const ymax = this.frame().height()

        this.frame().clear() // so we can use frame for collision detection

        this.particles().forEach((p) => {
            const pos = p.intPosition()
            this.frame().setBit(pos.x(), pos.y(), 1)
            //console.log("bit " + pos.x() + " " + pos.y())
        })
    
        console.log("trueBitCount: ", this.frame().trueBitCount())
        
        if (this.frame().getBit(0, 31)) {
            //console.log("bit 0,31: " + this.frame().getBit(0, 31))
        }

        this.particles().slice().forEach((p) => {
            p.step()
        })
    }
}

