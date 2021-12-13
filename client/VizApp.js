/*

*/

class VizApp extends LedApp {
    constructor () {
        super()
        this.setFps(60)

        this.registerForKeyboardInput()

        this._availableAnimations = []
        this._activeAnimations = []

        this.setupAnimations()
        return this
    }

    setupAnimations () {
        this.addAvailableAnimation(new RandomAnimation())
    }

    availableAnimations () {
        return this._availableAnimations
    }

    activeAnimations () {
        return this._activeAnimations
    }

    step () {
        super.step()
        
        this._activeAnimations.slice().forEach((anim) => {
            anim.step()
        })

        this.frame().clear()

        this._activeAnimations.forEach((anim) => {
            anim.compositeToFrame(this.frame())
        })
    }

    didCompleteAnimation (anAnimation) {

    }

    onKeyDown (event) {
        const k = event.keyCode
        this._availableAnimations.forEach((a) => { a.onKeyDown(event) })
    }

    onKeyUp (event) {
        const k = event.keyCode
        this._availableAnimations.forEach((a) => { a.onKeyUp(event) })
    }

    // available

    addAvailableAnimation (anAnimation) {
        anAnimation.setOwner(this)
        this.availableAnimations().push(anAnimation)
    }

    // active

    addActiveAnimation (anAnimation) {
        anAnimation.setOwner(this)
        this.activeAnimations().push(anAnimation)
    }

    removeActiveAnimation (anAnimation) {
        this.activeAnimations().remove(anAnimation)
    }
}



/*
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
    */