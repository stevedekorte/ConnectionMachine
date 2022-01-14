"use strict"

/*

*/

getGlobalThis().ParticlesAnimation = class ParticlesAnimation extends Animation {
    constructor() {
        super()
        this.setTMax(null)
        this.setStartKey("P")
        this.setEndKey("O")
        this.setAllowsMany(false)
        this._particleCount = 1
        this._particles = []
        this._xmax = 32
        this.setup()
        this._newParticlePeriod = 30
        return this
    }

    hasParticleAtPoint (np) {
        return this.frame().getBit(np.x(), np.y()) === 1
        /*
        for (let i = 0; i < this.particles(); i ++) {
            const p = this.particles()[i]
            if (p.intPosition().equals(np)) {
                return true
            }
        }
        return false
        */
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
    }

    newParticle() {
        const p = new Particle()
        p.setAnimation(this)
        this.placeParticle(p)
        this.particles().push(p)
        return p
    }

    placeParticle(p) {
        const x = Math.round(16+Math.random() * 32) % this.xmax()
        p.position().setX(x)
        p.position().setY(Math.round(0 - Math.random() * 6))
        p.velocity().setY(0.1 * (Math.random() * 0.5 + 0.5))
        p._intPosition.copy(p.position())
        //p.updateIntPosition()
    }

    step () {
        super.step()
        if (this._t % this._newParticlePeriod === 0) {
            this.newParticle()
        }
    }

    removeParticle (p) {
        this._particles.remove(p)
        return this
    }

    draw() {
        const xmax = this.frame().width()
        const ymax = this.frame().height()

        this.frame().clear() // so we can use frame for collision detection

        this.particles().forEach((p) => {
            const pos = p.intPosition()
            this.frame().setBit(pos.x(), pos.y(), 1)
        })

        this.particles().slice().forEach((p) => {
            p.step()
        })
    }

    onKeyDown (event) {
        super.onKeyDown(event)

        const c = String.fromCharCode(event.keyCode)
        if (c === "I") {
            this.setup()
        }
    }
}

