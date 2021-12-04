/*
    subclass this class to make custom Led apps
*/

function reverseString(str) {
    return str.split("").reverse().join("");
}

class BtcApp extends LedApp {
    constructor (self) {
        super();
        this._btcData = new BtcData()
        this._btcData.setDelegate(this)
        this._btcData.connect()

        this.setFps(4)
        this._utxs = []
        this._count = 0
        return this
    }

    count () {
        //return this._btcData.utxCount()
        return this._count
    }

    step () {
        const count = this.count()
        const bin = reverseString(count.toString(2))

        const xmax = this.frame().width()
        const ymax = this.frame().height()

        let n = 0
        for (let y = 0; y < 1; y++) {
            for (let x = 0; x < bin.length; x++) {
                let v = 0
                if (bin[x] === "1") {
                    v = 1
                }
                this.frame().setBit(x, y, v)
                n ++
            }
        }
        //this.frame().clear()
    }

    onBlockMessage (json) {
        const utxDict = this._btcData.utxDict()

		json.x.txIndexes.forEach((txIndex) => {
			delete utxDict[txIndex]
		})
        this._count = 0
	}

	onUnconfirmedTxMessage (json) {
        this._count ++
	}
}



