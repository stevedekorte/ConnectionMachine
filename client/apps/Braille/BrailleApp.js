"use strict"

getGlobalThis().BrailleApp = class BrailleApp extends LedApp {
    constructor () {
        super()
        this.setFps(100)
        this.newSlot("text", "") 
        this.registerForKeyboardInput()
        //this.setAlwaysNeedsDisplay(false)
        this.newSlot("needsRender", false)
        this.newSlot("isAutoWriting", false)
        this.setNeedsRender(true)
        this.newSlot("fullTextIndex", 0)

        this.newSlot("charHeight", 3)
        this.newSlot("charWidth", 2)
        const margin = 0
        this.newSlot("spacing", margin +1)
        this.newSlot("vSpacing", margin +2)
    }

    /*
    isAlphaNumeric (str) {
        var code, i, len;
      
        for (i = 0, len = str.length; i < len; i++) {
          code = str.charCodeAt(i);
          if (!(code > 47 && code < 58) && // numeric (0-9)
              !(code > 64 && code < 91) && // upper alpha (A-Z)
              !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
          }
        }
        return true;
    }
    */

    setText (s) {
        if (this._text !== s) {
            this._text = s
            console.log("setText: '" + this.text() + "'")
            this.setNeedsRender(true)
            //this.setNeedsDisplay(true)
        }
       return this
    }

    onDeleteKey () {
        if (this.text().length) {
            this.setText(this.text().slice(0, this.text().length - 1))
        }
        return this
    }

    onEnterKey () {
        this.appendText("\n")
        return this
    }

    appendText (s) {
        this.setText(this.text() + s)
        return this
    }

    clearText () {
        this.setText("")
        return this
    }

    onKeyDown (event) {
        super.onKeyDown(event)
        let k = String.fromCharCode(event.which)

        if (event.metaKey && k === "K") {
            this.clearText()
            return
        }
        
        console.log("k: '" + String.fromCharCode(event.which) + "' key:", event.key)
        if (event.key === "Delete" || event.key === "Backspace") {
            this.onDeleteKey()
            return
        }
        
        if (event.key === "Enter") {
            this.onEnterKey()
            return
        }
        
        //if (this.isAlphaNumeric(k)) {

        if (event.keyCode === 16 && event.shiftKey) { // just the shift key
            return
        }
        
        if (k === "1" && event.shiftKey) {
            k = "!"
        }

                
        if (k === "a" && event.metaKey) {
            this.setIsAutoWriting(!this.isAutoWriting())
            return
        }

        if (event.key === "Escape") {
            this.setText("")
            return
        }

        if (k.length) {
            if (!this.hasDataForChar(k)) {
                console.log("no bitmap for character '" + k + "'")
                return  
            }
            this.appendText(k)
        }        
    }

    onKeyUp (event) {
        super.onKeyUp(event)
    }

    hasDataForChar (c) {
        return typeof(this.dataForChar(c)) !== "undefined"
    }

    dataForChar (c) {
        c = c.toUpperCase()
        const data = getGlobalThis().brailleData.data
        return data[c]
    }

    drawCharAtXY (c, px, py) {
        // bottom left of character at x, y
        const data = this.dataForChar(c)

        if (typeof(c) === "undefined") {
            throw new Error("undefined character ", c) 
        }

        if (data) {
            for (let y = 0; y < data.length; y++) {
                const row = data[y]
                for (let x = 0; x < row.length; x++) {
                    const xx = px + x
                    const yy = py + y - 3
                    this.frame().setBit(xx, yy, row[x])
                }
            }
        } else {
            throw new Error("no data for character '" + c + "'") 

        }
    }

    /*
    autoWrite () {
        const charsPerScreen = 180

        if (this.text().length < charsPerScreen || this.t() % 20 === 0) {
            //const s = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789            "
            const s = "ATGC"
            //const s = "    0123456789"
            //const s = "BL1G   "
            //const s = "LAB"
            //const s = "CAKMXU"
            const c = s[Math.floor(Math.random() * s.length)]

            if (this.text().length > charsPerScreen) {
                const ri = Math.floor(Math.random() * charsPerScreen)
                let t = this.text().slice()
                t = t.replaceAtIndex(ri, c)
                this.setText(t)
            } else {
                this.appendText(c)
            }
        }
    }
    */

    charsPerScreen () {
        const xmax = this.frame().width()
        const ymax = this.frame().height()

        let charHeight = this.charHeight()
        let charWidth = this.charWidth()
        let spacing = this.spacing()
        let vSpacing = this.vSpacing()

        const charsPerLine =  Math.ceil((xmax+spacing)/(charWidth+spacing))
        const lines = Math.ceil((ymax+vSpacing)/(charHeight+vSpacing))
        return charsPerLine * lines
    }

    autoWrite () {
        const fullText = window.covidGenomeData
        const i = this.fullTextIndex()
        if (i < fullText.length) {
            let newChar = fullText[i]
            const index = "ATGC".indexOf(newChar)
            //newChar = "DFHJ"[index]
            //newChar = "123-"[index]
            newChar = "BCDG"[index]
            this.setText(this.text() + newChar)
            this.setFullTextIndex(this.fullTextIndex()+1)
            if (this.text().length > this.charsPerScreen()) {
                this.setText(newChar)
                /*
                const chars = this.text().split("")
                chars.shift()
                this.setText(chars.join(""))
                */
            }
        } else {
            i = 0
            this.setText("")
        }
    }

    step () {
        super.step()
        
        if (this.isAutoWriting()) {
            this.autoWrite()
        }

        if (this.needsRender()) {
            this.render()
            this.setNeedsRender(false)
        }
    }

    render () {
        this.frame().clear()

        console.log("rendering text: '" + this.text() + "'")

        const xmax = this.frame().width()
        const ymax = this.frame().height()

        let charHeight = this.charHeight()
        let charWidth = this.charWidth()
        let spacing = this.spacing()
        let vSpacing = this.vSpacing()
        let x = 0
        let y = charHeight
        for (let i = 0; i < this.text().length; i++) {
            const c = this.text()[i]

            if (c == "\n") {
                x = 0
                y += charHeight + vSpacing
            } else {
                this.drawCharAtXY(c, x, y)
                x += charWidth + spacing
            }
            if (x > xmax - 2) {
                x = 0
                y += charHeight + vSpacing
            }
        }
        this.setNeedsDisplay(false)
    }
}

