Object.defineSlot = function(obj, slotName, slotValue) {
    //if (!Object.hasOwnSlot(obj, slotName, slotValue)) {
    const descriptor = {
        configurable: true,
        enumerable: false,
        value: slotValue,
        writable: true,
    }
    Object.defineProperty(obj, slotName, descriptor)
    //}
}

if (!String.prototype.capitalized) {
    Object.defineSlot(String.prototype, "capitalized", 
        function () {
            return this.replace(/\b[a-z]/g, function (match) {
                return match.toUpperCase();
            });
        }
    )
}

// ----------------

Array.prototype.remove = function(v) {
  const i = this.indexOf(v);
  if (i > -1) {
    this.splice(i, 1);
  }
  return this;
}


class LedFrame {
    constructor () {
        this._xmax = 32
        this._ymax = 32
        this._bits = Array(this.ledCount()).fill(0) 
    }

    trueBitCount () {
        let count = 0
        this._bits.forEach((b) => { if (b === 1) { count ++ }})
        return count
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
        this._bits.fill(b)
    }

    ledCount () {
        return this._xmax * this._ymax
    }

    randomize () {
        const count = this.ledCount()
        for (let i = 0; i < count; i++) {
            this._bits[i] = Math.round(Math.random()) * Math.round(Math.random())* Math.round(Math.random())
        }
    }

    randomizeBit (x, y) {
        const i = this.index_for_xy(x, y)
        this._bits[i] = Math.round(Math.random())
    }

    addOneRandomOnBit () {
        const i = Math.floor(Math.random() * this.ledCount())
        this._bits[i] = Math.round(Math.random())
    }

    asHexFrame () {
        const bits = this._bits
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
        return this._bits[i]
    }

    setBitAtIndex (i, v) { // v should be 1 or 0
        return this._bits[i]
    }

    getBit (x, y) {
        const i = this.index_for_xy(x, y)
        return this._bits[i]
    }

    flipBit (x, y) {
        const i = this.index_for_xy(x, y)
        if (this._bits[i] === 0) {
            this._bits[i] = 1
        } else {
            this._bits[i] = 0
        }
    }

    setBit (x, y, v) {
        if (x < 0 || x > this._xmax - 1) {
            return this
        }
        if (y < 0 || y > this._ymax - 1) {
            return this
        }
        const i = this.index_for_xy(x, y)
        this._bits[i] = v
        return this
    }

    setXorBit (x, y, v) {
        const i = this.index_for_xy(x, y)
        const cv = this._bits[i]
        this._bits[i] = v ^ cv
    }

    copy (frame) {
        this._bits = frame._bits.slice()
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
        const bits1 = this._bits
        const bits2 = frame._bits
        const size = bits1.length
        for (let i = 0; i < size; i++) {
            bits1[i] = bits1[i] || bits2[i]
        }
    }

    compositeAndOpFrame (frame) {
        const bits1 = this._bits
        const bits2 = frame._bits
        const size = bits1.length
        for (let i = 0; i < size; i++) {
            bits1[i] = bits1[i] && bits2[i]
        }
    }

    compositeXorOpFrame (frame) {
        const bits1 = this._bits
        const bits2 = frame._bits
        const size = bits1.length
        for (let i = 0; i < size; i++) {
            bits1[i] = bits1[i] ^ bits2[i]
        }
    }

    // line drawing

    drawFromTo (x1, y1, x2, y2, bitFunc) {
        const d = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
        for (let i = 0; i < d; i++) {
            const x = Math.round(x1 + (x2 - x1) * i / d)
            const y = Math.round(y1 + (y2 - y1) * i / d)
            if (bitFunc) {
                this.setBit(x, y, bitFunc(i, x, y) ? 1 : 0)
            } else {
                this.setBit(x, y, 1)
            }
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
        this._bits = newFrame._bits
        return this
    }

    // advanced drawing


    drawBitsForNumberAt (x, y, aNumber) {
        const bitsString = aNumber.toString(2).split('').reverse().join('');

        const xmax = this.width()
        const ymax = this.height()

        if (y >= ymax) {
            return 
        }

        for (let i = 0; i < bitsString.length; i++) {
            const xx = x + i
            if (xx >= xmax) {
                break
            }
            const v = bitsString[i] === "1" ? 1 : 0
            this.setBit(xx, y, v)
        }
    }


}