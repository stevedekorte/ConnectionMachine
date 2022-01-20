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
    },

    replaceAtIndex: function (i, newValue) {
        if (i > this.length - 1) {
            return this.slice()
        }
        return this.substring(0, i) + newValue + this.substring(i + 1)
    },

    contains: function (s) {
        return this.indexOf(s) !== -1
    }
})

Object.defineSlots(Array.prototype, {
    minValue: function () {
        let minValue = Number.POSITIVE_INFINITY
        this.forEach((v) => { if (v < minValue) { minValue = v } })
        return minValue
    },

    maxValue: function () {
        let maxValue = Number.NEGATIVE_INFINITY
        this.forEach((v) => { if (v > maxValue) { maxValue = v } })
        return maxValue
    },

    normalized: function () {
        const minValue = this.minValue()
        const maxValue = this.maxValue()
        return this.map(v => (v - minValue) / (maxValue - minValue))
    },

    // -----------------

    binarySearch: function (target, comparator) {
        var l = 0,
            h = this.length - 1,
            m, comparison;
        comparator = comparator || function (a, target) {
            return (a < target ? -1 : (a > target ? 1 : 0));
        };
        while (l <= h) {
            m = (l + h) >>> 1;
            comparison = comparator(this[m], target);
            if (comparison < 0) {
                l = m + 1;
            } else if (comparison > 0) {
                h = m - 1;
            } else {
                return m;
            }
        }
        return m; // nearest match?
        //return~l;
    },

    binaryInsert: function (target, duplicate, comparator) {
        var i = this.binarySearch(target, comparator);
        if (i >= 0) {
            if (!duplicate) {
                return i;
            }
        } else {
            i = ~i;
        }
        this.splice(i, 0, target);
        return i;
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
