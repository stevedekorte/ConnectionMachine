

class LedFrame {
    constructor () {
        this._xmax = 32
        this._ymax = 32
        this.bits = Array(this.ledCount()).fill(0) 
    }

    width () {
        return this._xmax
    }

    height () {
        return this._ymax
    }

    clear () {
        this.setAllBitsTo(0)
    }

    duplicate () {
        const f = new LedFrame()
        f.copy(this)
        return f
    }

    setAllBitsTo (b) {
        const count = this.ledCount()
        this.bits.fill(b)
    }

    ledCount () {
        return this._xmax * this._ymax
    }

    randomize () {
        const count = this.ledCount()
        for (let i = 0; i < count; i++) {
            this.bits[i] = Math.round(Math.random()) * Math.round(Math.random())* Math.round(Math.random())
        }
    }

    randomizeBit (x, y) {
        const i = this.index_for_xy(x, y)
        this.bits[i] = Math.round(Math.random())
    }

    addOneRandomOnBit () {
        const i = Math.floor(Math.random() * this.ledCount())
        this.bits[i] = Math.round(Math.random())
    }

    asHexFrame () {
        const bits = this.bits
        const hexChunks = []
        const bitChunks = []
        for (let n = 0; n < bits.length / 4; n++) {
            const index = n * 4
            const chunk = bits.slice(index, index + 4)
            const s = chunk.join("")
            const hexChunk = parseInt(s, 2).toString(16);
            hexChunks.push(hexChunk)
        }
        const out = hexChunks.join("")
        //console.log("out: ", out)
        return out
    }

    // --- xy utility methods ---

    index_for_xy (x, y) {
        const index = (Math.floor(x) * this._xmax) + Math.floor(y)
        return index
    }

    getBitAtIndex (i) { // returns 1 or 0
        return this.bits[i]
    }

    setBitAtIndex (i, v) { // v should be 1 or 0
        return this.bits[i]
    }

    getBit (x, y) {
        const i = this.index_for_xy(x, y)
        return this.bits[i]
    }

    flipBit (x, y) {
        const i = this.index_for_xy(x, y)
        if (this.bits[i] === 0) {
            this.bits[i] = 1
        } else {
            this.bits[i] = 0
        }
    }

    setBit (x, y, v) {
        const i = this.index_for_xy(x, y)
        this.bits[i] = v
    }

    setXorBit (x, y, v) {
        const i = this.index_for_xy(x, y)
        const cv = this.bits[i]
        this.bits[i] = v ^ cv
    }

    copy (frame) {
        this.bits = frame.bits.slice()
    }

    // compositing 

    compositeWithStyle (frame, style) {
        if (style === "or") {
            this.compositeOrOpFrame(frame)
        } else if (style === "and") {
            this.compositeAndOpFrame(frame)
        } else if (style === "xor") {
            this.compositeXorOpFrame(frame)
        } else {
            throw new Error("unknown composite style " + style)
        }
    }

    compositeOrOpFrame (frame) {
        const bits1 = this.bits
        const bits2 = frame.bits
        const size = bits1.length
        for (i = 0; i < size; i++) {
            bits1[i] = bits1[i] || bits2[i]
        }
    }

    compositeAndOpFrame (frame) {
        const bits1 = this.bits
        const bits2 = frame.bits
        const size = bits1.length
        for (let i = 0; i < size; i++) {
            bits1[i] = bits1[i] && bits2[i]
        }
    }

    compositeXorOpFrame (frame) {
        const bits1 = this.bits
        const bits2 = frame.bits
        const size = bits1.length
        for (let i = 0; i < size; i++) {
            bits1[i] = bits1[i] ^ bits2[i]
        }
    }

    // line drawing

    drawFromTo (x1, y1, x2, y2) {
        const d = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
        for (let i = 0; i < d; i++) {
            const x = Math.floor(x1 + (x2 - x1) * n / d)
            const y = Math.floor(y1 + (y2 - y1) * n / d)
            this.setBit(x, y, 1)
        }
    }

    // shifting

    shiftRight () {
        this.shiftXY(-1, 0)
        return this
    }

    shiftLeft () {
        this.shiftXY(1, 0)
        return this
    }

    shiftUp () {
        this.shiftXY(0, 1)
        return this
    }

    shiftDown () {
        this.shiftXY(0, -1)
        return this
    }

    shiftXY (dx, dy) {
        const xmax = this._xmax
        const ymax = this._ymax

        const newFrame = new LedFrame()
        for (let y = 0; y < ymax; y++) {
            for (let x = 0; x < xmax; x++) {
                let xx = (x + dx) % xmax
                let yy = (y + dy) % ymax
                if (xx < 0) { xx = (xmax-1) + xx }
                if (yy < 0) { yy = (ymax-1) + yy }
                const v = this.getBit(xx, yy)
                if (v !== 1 && v !== 0) {
                    throw new Error("not a valid bool")
                }
                newFrame.setBit(x, y, v)
            }
        }
        this.bits = newFrame.bits
        return this
    }

}