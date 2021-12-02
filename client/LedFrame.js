

class LedFrame {
    constructor() {
        this.xmax = 32
        this.ymax = 32
        this.bits = Array(this.ledCount()).fill(0) 
    }

    clear() {
        this.setAllBitsTo(0)
    }

    setAllBitsTo(b) {
        const count = this.ledCount()
        this.bits.fill(b)
    }

    ledCount() {
        return this.xmax * this.ymax
    }

    randomize() {
        const count = this.ledCount()
        for (let i = 0; i < count; i++) {
            this.bits[i] = Math.round(Math.random()) //* Math.round(Math.random())
        }
    }

    randomizeBit(x, y) {
        const i = this.index_for_xy(x, y)
        this.bits[i] = Math.round(Math.random())
    }

    addOneRandomOnBit() {
        const i = Math.floor(Math.random() * this.ledCount())
        this.bits[i] = Math.round(Math.random())
    }

    asHexFrame() {
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

    index_for_xy(x, y) {
        const index = (Math.floor(x) * this.xmax) + Math.floor(y)
        return index
    }

    getBitAtIndex(i) { // returns 1 or 0
        return this.bits[i]
    }

    setBitAtIndex(i, v) { // v should be 1 or 0
        return this.bits[i]
    }

    getBit(x, y) {
        const i = this.index_for_xy(x, y)
        return this.bits[i]
    }

    flipBit(x, y) {
        const i = this.index_for_xy(x, y)
        if (this.bits[i] === 0) {
            this.bits[i] = 1
        } else {
            this.bits[i] = 0
        }
    }

    setBit(x, y, v) {
        const i = this.index_for_xy(x, y)
        this.bits[i] = v
    }

    setXorBit(x, y, v) {
        const i = this.index_for_xy(x, y)
        const cv = this.bits[i]
        this.bits[i] = v ^ cv
    }

    copy(frame) {
        this.bits = frame.bits.slice()
    }

    compositeAndOpFrame(frame) {
        const bits1 = this.bits
        const bits2 = frame.bits
        const size = bits1.length
        for (let i = 0; i < size; i++) {
            bits1[i] = bits1[i] && bits2[i]
        }
    }

    compositeOrOpFrame(frame) {
        const bits1 = this.bits
        const bits2 = frame.bits
        const size = len(bits1)
        for (i = 0; i < size; i++) {
            bits1[i] = bits1[i] || bits2[i]
        }
    }

    compositeXorOpFrame(frame) {
        const bits1 = this.bits
        const bits2 = frame.bits
        const size = len(bits1)
        for (let i = 0; i < size; i++) {
            bits1[i] = bits1[i] ^ bits2[i]
        }
    }

    drawFromTo(x1, y1, x2, y2) {
        const d = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
        for (let i = 0; i < d; i++) {
            const x = Math.floor(x1 + (x2 - x1) * n / d)
            const y = Math.floor(y1 + (y2 - y1) * n / d)
            this.setBit(x, y, 1)
        }
    }

}