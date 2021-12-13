/*
    subclass this class to make custom Led apps
*/

class BtcApp extends LedApp {
    constructor (self) {
        super();
        this._btcData = new BlockCypherAPI()
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

        for (let i = 0; i < ymax; i++) {
            this.clearXLine(i)
            if (i < blocks.length) {
                const block = blocks[i]
                const btcTransacted = block.total / 100000000;
                const v = Math.floor(btcTransacted)
                this.drawBitsForNumberAt(0, i, v)
            }
        }

    }

    clearXLine (y) {
        const xmax = this.frame().width()
        for (let x = 0; x < xmax; x++) {
            this.frame().setBit(x, y, 0)
        }
    }

    drawBitsForNumberAt (x, y, aNumber) {
        const bitsString = aNumber.toString(2).split('').reverse().join('');

        const xmax = this.frame().width()
        const ymax = this.frame().height()

        if (y >= ymax) {
            return 
        }

        for (let i = 0; i < bitsString.length; i++) {
            const xx = x + i
            if (xx >= xmax) {
                break
            }
            const v = bitsString[i] === "1" ? 1 : 0
            this.frame().setBit(xx, y, v)
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



