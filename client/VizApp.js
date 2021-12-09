/*

*/

class VizApp extends LedApp {
    constructor () {
        super()
        this.registerForKeyboardInput()
        return this
    }


    step () {
        /*
        this._animations.forEach((animation) => {
            animation.step()
        })
        */
    }

    didCompleteAnimation (anAnimation) {

    }

    onKeyDown (event) {
        const k = event.keyCode
        console.log("k = ", k)
        this.applyXYFunc((x, y) => {
            return (k % (x - y)  === 0) ? 1 : 0
        })
    }

    onKeyUp (event) {
        const k = event.keyCode
        this.frame().setAllBitsTo(0)
        /*
        this.applyXYFunc((x, y) => {
            return (x + y) % keyCode === 0
        })
        */
    }

    applyXYFunc (func) {
        const xmax = this.frame().width()
        const ymax = this.frame().height()
        const frame = this.frame()
        for (let y = 0; y < ymax; y++) {
            for (let x = 0; x < xmax; x++) {
                const b = func(x, y)
                if (b != 0 && b != 1) {
                    throw new Error("invalid value")
                }
                if (b) {
                    frame.setBit(x, y, b)
                }
            }
        }
    }
}



