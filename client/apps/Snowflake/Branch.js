"use strict"

getGlobalThis().Branch = class Branch {
    constructor () {
        this._angle = -90
        //this._direction = new Point2d().set(1, 1)
        this._position = new Point2d()
        this._length = 6
        this._parent = null
        this._depth = 0
        this._children = []
        this._maxDepth = 3
        //this._rotationIncrement = 45
        this._seed = Math.random()
    }

    rotationIncrement () {        
        if (this._seed < 0.0) {
            return 45
        }
        return 90
    }

    setSeed (v) {
        this._seed = v
        return this
    }

    rotateClockwise () {
        const d = this.direction()
        this.setAngle(this.angle() + this.rotationIncrement())
    }

    rotateCounterClockwise () {
        const d = this.direction()
        this.setAngle(this.angle() - this.rotationIncrement())
    }


    setAngle (v) {
        this._angle = Math.floor(v) % 360
        return this
    }

    angle () {
        return this._angle
    }

    direction () {
        const a = this.angle()
        const radians = (a/360)*2 * Math.PI
        let dx = Math.cos(radians)
        let dy = Math.sin(radians)

        const m = 0.001
        if (dx > m) { dx = 1 } else if (dx < -m) { dx = -1 } else { dx = 0 }
        if (dy > m) { dy = 1 } else if (dy < -m) { dy = -1 } else { dy = 0 }

        //dx = Math.floor(dx)
        //dy = Math.floor(dy)
        return new Point2d().set(dx, dy)
    }

    length () {
        return this._length
    }

    setLength (v) {
        this._length = v
        return this
    }

    chooseLength () {
        if (this.depth() === 0) {
            this.setLength(0)
        } else {
            //const f = Math.sqrt(1 + this.depth()) 
            const f = 1 / (1 + this.depth() * this.depth())
            //const v = Math.floor(this._seed * 8 * f )
            const v = 2+ Math.floor(12*f*this._seed)
            this.setLength(1 + v)
        }
        //this.setLength(1 + /(this.depth()+1))
        //this.setLength(1 +  (this._maxDepth - this.depth())*4)
        return this
    }


    depth () {
        return this._depth
    }

    setDepth (v) {
        this._depth = v
        return this
    }

    position () {
        return this._position
    }

    setParent (aBranch) {
        this._parent = aBranch
        return this
    }

    parent () {
        return this._parent
    }

    frame () {
        return this.parent().frame()
    }

    rotate (d) {
        if (d === 1) {
            this.rotateClockwise()
        } else if (d === -1) {
            this.rotateCounterClockwise() 
        }
    }

    newBranch (d, seed) {
        const b = new Branch()
        b.setParent(this)
        b.setSeed(seed)
        b.position().copy(this.endPosition())
        b.setDepth(this.depth() + 1)
        b.setAngle(this.angle())
        b.rotate(d)
        b.chooseLength()
        this._children.push(b)
        return b
    }
    
    grow () {
        const seed = globalRandomSet.at(this.depth())
        this.newBranch(1, seed)
        this.newBranch(0, seed)
        this.newBranch(-1, seed)

        if (this.depth() < this._maxDepth) {
            this._children.forEach(c => c.grow())
        }
    }

    endPosition () {
        const p = this.position()
        const endPos = this.direction().multipliedByScalar(this.length()).add(p)
        return endPos
    }

    render () {
        const p = this.position()
        const endPos = this.endPosition()
        if (this.depth() < 40) {
            this.frame().drawFromTo(p.x(), p.y(), endPos.x(), endPos.y())
        } else {
            //this.frame().setBit(p.x(), p.y(), 1)
            this.frame().setBit(endPos.x(), endPos.y(), 1)
        }
        this._children.forEach(c => c.render())
    }

    center () {
        this.position().setX(Math.floor(this.frame().width()/2)).setY(Math.floor(this.frame().height()/2))
    }

    firstGen () {
        this.chooseLength()
        this.center()
        this.grow()
        this.render()
    }

}
