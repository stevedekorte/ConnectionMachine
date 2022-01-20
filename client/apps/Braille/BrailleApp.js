"use strict"

getGlobalThis().BrailleApp = class BrailleApp extends LedApp {
    constructor () {
        super()
        this.setFps(120)
        this.newSlot("text", "") 
        this.registerForKeyboardInput()
        //this.setAlwaysNeedsDisplay(false)
        this.newSlot("needsRender", false)
        this.newSlot("isAutoWriting", true)
        this.setNeedsRender(true)
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
        if (this._text != s) {
            this._text = s
            this.setNeedsRender(true)
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
        
        //console.log("k: '" + String.fromCharCode(event.which) + "' key:", event.key)
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
            this.appendText(k)
        }        
    }

    onKeyUp (event) {
        super.onKeyUp(event)
    }

    dataForChar (c) {
        c = c.toUpperCase()
        const data = getGlobalThis().brailleData.data
        return data[c]
    }

    drawCharAtXY (c, px, py) {
        // bottom left of character at x, y
        const data = this.dataForChar(c)

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
            console.log("no data for character '" + c + "'")
        }
    }

    autoWrite () {
        const charsPerScreen = 180
        
        if (this.t() % 200 === 0) {
            //this.clearText()
        }

        if (this.text().length < charsPerScreen || this.t() % 20 === 0) {
            //const s = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789            "
            const s = "    0123456789"
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

        const xmax = this.frame().width()
        const ymax = this.frame().height()

        let charHeight = 3
        let charWidth = 2
        let spacing = 0
        let vSpacing = 4
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

        this.setNeedsDisplay(true)
    }

}

