"use strict"

getGlobalThis().RandomSet = class RandomSet {
    constructor () {
        this._dict = {}
    }

    clear () {
        this._dict = {}
    }

    at (i) {
        const d = this._dict
        if (d [i] === undefined) {
            d[i] = Math.random() 
        }
        return d[i]
    }

    mutate () {
        const d = this._dict
        const e = Object.entries(d)
        const i = Math.floor(Math.random() * e.length)
        d[i] = Math.random() 
        return this
    }
}

getGlobalThis().globalRandomSet = new RandomSet()
