/*

*/

class VizApp extends LedApp {
    constructor () {
        super()
        this.setFps(30)

        this.registerForKeyboardInput()

        this._animationClasses = [
            RandomAnimation, 
            LineDownAnimation, 
            LineUpAnimation, 
            LineLeftAnimation, 
            LineRightAnimation, 
            DiagonalAnimation, 
            AltAnimation,
            ChristmasTreeMask,
            ParticlesAnimation
        ]
        this._availableAnimations = []
        this._activeAnimations = []

        this.setupAnimations()

        return this
    }

    animationClasses () {
        return this._animationClasses
    }

    setupAnimations () {
        this.animationClasses().forEach((aClass) => {
            this.addAvailableAnimation(new aClass())
        })
        
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

        this.display().setBrightness(0)

        this.frame().clear()

        this._activeAnimations.forEach((anim) => {
            anim.compositeToFrame(this.frame())
        })
    }

    didCompleteAnimation (anAnimation) {

    }

    onKeyDown (event) {
        const k = event.keyCode
        this.availableAnimations().forEach((a) => { a.onKeyDown(event) })
    }

    onKeyUp (event) {
        const k = event.keyCode
        this.availableAnimations().forEach((a) => { a.onKeyUp(event) })
    }

    // available

    addAvailableAnimation (anAnimation) {
        anAnimation.setOwner(this)
        this.availableAnimations().push(anAnimation)
    }

    // active

    hasAnimation (anAnimation) {
        return this.activeAnimations().indexOf(anAnimation) !== -1
    }

    addActiveAnimation (anAnimation) {
        if (!this.hasAnimation(anAnimation)) {
            anAnimation.setOwner(this)
            this.activeAnimations().push(anAnimation)
        }
    }

    removeActiveAnimation (anAnimation) {
        this.activeAnimations().remove(anAnimation)
    }
}



/*
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