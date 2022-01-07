"use strict"

/*
    subclass this class to make custom Led apps
*/

class BtcApp extends LedApp {
    constructor () {
        super();
        this._btcData = new BlockCypherAPI()
        //this._btcData = new BlockChainAPI()

        this._btcData.setDelegate(this)
        this._btcData.connect()

        this.setFps(30)
        this._utxs = []
        this._count = 0
        this._needsRender = true

        return this
    }

    count () {
        //return this._btcData.utxCount()
        return this._count
    }

    step () {
        if (this._needsRender) {
            this.render()
            this._needsRender = false
        }
        // don't use timer - use events from btcData to drive render
    }

    render () {
        //this.frame().clear()
        
        const xmax = this.frame().width()
        const ymax = this.frame().height()

        const blocks = this._btcData.blocks()

        this.display().setBrightness(15)

        for (let i = 0; i < ymax; i++) {
            this.clearXLine(i)
            if (i < blocks.length) {
                const block = blocks[i]
                if (block.total) {
                    let btcTransacted = block.total / 100000000;
                    const v = Math.floor(btcTransacted)
                    const m = Math.floor(Math.log10(v))
                    this.frame().drawFromTo(0, i, m, i)
                } else {
                    const v = block.height
                    this.frame().drawBitsForNumberAt(0, i, v)
                }
            }
        }
    }

    clearXLine (y) {
        const xmax = this.frame().width()
        for (let x = 0; x < xmax; x++) {
            this.frame().setBit(x, y, 0)
        }
    }

    /*
    old_step () {
        const count = this.count()

        const xmax = this.frame().width()
        const ymax = this.frame().height()

        let n = 0
        for (let y = 0; y < ymax; y++) {
            for (let x = 0; x < xmax; x++) {
                    let v = 0
                if (n < count) {
                    v = 1
                }
                this.frame().setBit(x, y, v)
                n ++
            }
        }
    }
    */

    onBlockMessage (json) {
        this._count = 0
        this._needsRender = true
	}

	onUnconfirmedTxMessage (json) {
        //this._count += json.x.inputSum // satoshis
        this._needsRender = true
        //this.frame().clear()
    }

}



