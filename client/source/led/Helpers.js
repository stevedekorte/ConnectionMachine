"use strict"

Object.defineSlots(String.prototype, {
    hashCode: function () {
        var hash = 0;
        for (var i = 0; i < this.length; i++) {
            var char = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
})



Object.defineSlots(Uint8Array.prototype, {
    byteToHex: function () {
        if (!this._byteToHex) {
            this._byteToHex = []
            for (let n = 0; n <= 0xff; ++n) {
                const hexOctet = n.toString(16).padStart(2, "0");
                this._byteToHex.push(hexOctet);
            }
        }
        return this._byteToHex
    },

    asHex: function () {
        const byteToHex = this.byteToHex()
        let out = ""
        for (let i = 0; i < this.length; ++i) {
            out += byteToHex[this[i]];
        }

        return out
    },

    binaryToUint8: function () {
        // convert a byte array where each byte only holds one bit, into a uint8 array
        const outBitsPerByte = 8 // since we're converting to hex?
        const out = new Uint8Array(Math.ceil(this.length / outBitsPerByte))
        let outByteIndex = 0
        let outBitIndex = 0
        let currentByte = 0
        for (let i = 0; i < this.length; i++) {
            let b = this[i]
            if (b) {
                const v = 1 << 7 - outBitIndex
                currentByte = currentByte | v
            }

            outBitIndex++
            if (outBitIndex == outBitsPerByte) {
                out[outByteIndex] = currentByte
                currentByte = 0
                outBitIndex = 0
                outByteIndex++
            }
        }
        return out
    }

})


Object.defineSlots(Array.prototype, {

    remove: function (v) {
        const i = this.indexOf(v);
        if (i > -1) {
            this.splice(i, 1);
        }
        return this;
    },

})
