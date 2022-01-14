"use strict"

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



const byteToHex = [];

for (let n = 0; n <= 0xff; ++n) {
    const hexOctet = n.toString(16).padStart(2, "0");
    byteToHex.push(hexOctet);
}

function hex(buff) {
    //const buff = new Uint8Array(arrayBuffer);
    const hexOctets = []; // new Array(buff.length) is even faster (preallocates necessary array size), then use hexOctets[i] instead of .push()

    /*
    for (let i = 0; i < buff.length; ++i) {
        hexOctets.push(byteToHex[buff[i]]);
    }

    return hexOctets.join("");
    */
    let out = ""
    for (let i = 0; i < buff.length; ++i) {
        out += byteToHex[buff[i]];
    }

    return out;
}


Uint8Array.prototype.binaryToUint8 = function () {
    // convert a byte array where each byte only holds one bit, into a uint8 array
    const outBitsPerByte = 8 // since we're converting to hex?
    const out = new Uint8Array(Math.ceil(this.length/outBitsPerByte))
    let outByteIndex = 0
    let outBitIndex = 0
    let currentByte = 0
    for (let i = 0; i < this.length; i++) {
        let b = this[i]
        if (b) {
            const v = 1 << 7 - outBitIndex
            currentByte = currentByte | v
        }

        outBitIndex ++
        if (outBitIndex == outBitsPerByte) {
            out[outByteIndex] = currentByte
            currentByte = 0
            outBitIndex = 0
            outByteIndex ++
        }
    }
    return out
}



// ----------------

Array.prototype.remove = function(v) {
  const i = this.indexOf(v);
  if (i > -1) {
    this.splice(i, 1);
  }
  return this;
}

String.prototype.hashCode = function() {
    var hash = 0;
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}


class LedFrame extends Base {
    constructor () {
        super()
        this.newSlot("xmax", 32)
        this.newSlot("ymax", 32)
       // this.newSlot("bits", Array(this.ledCount()).fill(0))
        this.newSlot("bits", new Uint8Array(this.ledCount()).fill(0))

    }

    duplicate () {
        const f = new LedFrame()
        f.copy(this)
        return f
    }

    hash () {
        /*
        can't use this digest because they are async and return promises
        return  crypto.subtle.digest('SHA-1', this.bits())
        */
        return this.bits().join("").hashCode()
    }

    equals (frame) {
        const bits = this.bits()
        const otherBits = frame.bits()

        if (bits.length != otherBits.bits().length) {
            return false
        }

        for (let i = 0; i < bits.length; i++) {
            if (bits[i] != otherBits[i]) {
                return false
            }
        }
        return true
    }

    trueBitCount () {
        let count = 0
        this.bits().forEach((b) => { if (b === 1) { count ++ }})
        return count
    }

    width () {
        return this.xmax()
    }

    height () {
        return this.ymax()
    }

    clear () {
        this.setAllBitsTo(0)
        return this
    }

    duplicate () {
        const f = new LedFrame()
        f.copy(this)
        return f
    }

    setAllBitsTo (b) {
        const count = this.ledCount()
        this.bits().fill(b)
        return this
    }

    ledCount () {
        return this.xmax() * this.ymax()
    }

    randomize () {
        const count = this.ledCount()
        for (let i = 0; i < count; i++) {
            const v = Math.round(Math.random())
            this.setBitAtIndex(i, v)
        }
    }

    randomizeBit (x, y) {
        const i = this.index_for_xy(x, y)
        const v = Math.round(Math.random())
        this.setBitAtIndex(i, v)
    }

    addOneRandomOnBit () {
        const i = Math.floor(Math.random() * this.ledCount())
        const v = Math.round(Math.random())
        this.setBitAtIndex(i, v)
    }

    asHexFrame () {
        const uint8 = this.bits().binaryToUint8()
        const out2 = hex(uint8)
        return out2
        /*
        // TODO: this could be much faster
        const bits = this.bits()
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
        console.log("out1: ", out)
        console.log("out2: ", out2)
        //throw "stop"
        return out2
        */
    }

    // --- xy utility methods ---

    circular_index_for_xy (x, y) {
        if (x < 0) {
            x = this._xmax + 1 + x
        }
        if (y < 0) {
            y = this._ymax + 1 + y
        }

        const index = (Math.floor(x) * this._xmax) + Math.floor(y)
        return index
    }

    circularGetBit (x, y) {
        const i = this.circular_index_for_xy(x, y)
        return this._bits[i]
    }


    index_for_xy (x, y) {
        if (x > this._xmax - 1 || x < 0) {
            throw new Error("x coordinate " + x + " is out of bounds 0 to " + this._xmax)
        }

        if (y > this._ymax - 1 || y < 0) {
            throw new Error("y coordinate " + y + " is out of bounds 0 to " + this._ymax)
        }

        const index = (Math.floor(x) * this._xmax) + Math.floor(y)

        return index
    }

    getBitAtIndex (i) { // returns 1 or 0
        return this._bits[i]
    }

    setBitAtIndex (i, v) { // v should be 1 or 0
        this._bits[i] = v
        return this
    }

    getBit (x, y) {
        const i = this.index_for_xy(x, y)
        return this._bits[i]
    }

    flipBit (x, y) {
        const i = this.index_for_xy(x, y)
        if (this.bits()[i] === 0) {
            this.setBitAtIndex(i, 1)
        } else {
            this.setBitAtIndex(i, 0)
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
        this._bits[i] = v ^ cv ? 1 : 0
    }

    setOrBit (x, y, v) {
        const i = this.index_for_xy(x, y)
        const cv = this._bits[i]
        this._bits[i] = v || cv ? 1 : 0
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
        const bits1 = this.bits()
        const bits2 = frame.bits()
        const size = bits1.length
        for (let i = 0; i < size; i++) {
            bits1[i] = bits1[i] || bits2[i]
        }
    }

    compositeAndOpFrame (frame) {
        const bits1 = this.bits()
        const bits2 = frame.bits()
        const size = bits1.length
        for (let i = 0; i < size; i++) {
            bits1[i] = bits1[i] && bits2[i]
        }
    }

    compositeXorOpFrame (frame) {
        const bits1 = this.bits()
        const bits2 = frame.bits()
        const size = bits1.length
        for (let i = 0; i < size; i++) {
            bits1[i] = bits1[i] ^ bits2[i]
        }
    }

    // line drawing

    drawFromTo (x1, y1, x2, y2, bitFunc) {
        const d = Math.round( Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)) )
        for (let i = 0; i < d; i++) {
            const x = Math.round(x1 + (x2 - x1) * i / d)
            const y = Math.round(y1 + (y2 - y1) * i / d)
            if (bitFunc) {
                this.setBit(x, y, bitFunc(i, x, y, d) ? 1 : 0)
            } else {
                this.setBit(x, y, 1)
            }
        }

        // make sure we get the end point in
        if (bitFunc) {
            this.setBit(x2, y2, bitFunc(d, x2, y2, d) ? 1 : 0)
        } else {
            this.setBit(x2, y2, 1)
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
        const xmax = this.width()
        const ymax = this.height()

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
        this._bits = newFrame.bits()
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


    mirrorLeftToRight () {
        const xmax = this.width()
        const ymax = this.height()

        const newFrame = new LedFrame()
        for (let y = 0; y < ymax; y++) {
            for (let x = 0; x < xmax/2 + 1; x++) {
                let xx = xmax - 1- x
                const v = this.getBit(x, y)
                newFrame.setBit(x, y, v)
                newFrame.setBit(xx, y, v)
            }
        }
        this._bits = newFrame._bits
        return this
    }


    mirrorTopToBottom () {
        const xmax = this.width()
        const ymax = this.height()

        const newFrame = new LedFrame()
        for (let y = 0; y < ymax/2 +1; y++) {
            for (let x = 0; x < xmax; x++) {
                let yy = ymax - 1- y
                const v = this.getBit(x, y)
                newFrame.setBit(x, y, v)
                newFrame.setBit(x, yy, v)
            }
        }
        this._bits = newFrame._bits
        return this
    }

    mirrorDiagonal () {
        const xmax = this.width()
        const ymax = this.height()

        const newFrame = new LedFrame()
        for (let y = 0; y < ymax/2 + 1; y++) {
            for (let x = 0; x < xmax/2 +1; x++) {
                const v = this.getBit(x, y)
                newFrame.setBit(x, y, v)
                newFrame.setBit(xmax -1 -x, y, v)
                newFrame.setBit(x, ymax - 1 - y, v)
                newFrame.setBit(xmax -1 -x, ymax - 1 - y, v)
                //newFrame.setOrBit(x, y, v)
                //newFrame.setBit(xmax -1 - y, x, v)
                //newFrame.setBit(y, ymax -1 - x, v)
            }
        }
        this._bits = newFrame._bits
        return this
    }
}

