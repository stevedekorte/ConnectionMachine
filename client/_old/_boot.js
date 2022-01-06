"use strict"


const files = [
    "GlobalThis.js",
    "Base.js",
    "Storage.js",

    "LedFrame.js",
	"LedDisplay.js",
	"LedApp.js",
	"HtmlDisplay.js",
	"Animation.js",
	"RandomAnimation.js",

	"./BlockCypherAPI.js",
	"./BlockChainAPI.js",
	"./BtcApp.js",
	"./VizApp.js",
]

const loadNextFile = function () {
    const nextFile = files.shift()

    const script = document.createElement("script")

    if (nextFile) {
        console.log("loading ", nextFile)

        script.src = nextFile

        script.onload = () => {
            //console.log("loaded script src:'" + script.src + "' type:'" + script.type + "' text:[[[" + script.text + "]]]")
            loadNextFile()
        }

        script.onerror = (error) => {
            throw new Error("missing url " + nextFile)
        }

        const parent = document.getElementsByTagName("head")[0] || document.body
        parent.appendChild(script)
    } else {
        //window.app = App.clone()
        //window.app.run()
    }
}

/*
const loadNextFile = function () {
    const nextFile = files.shift()

    if (nextFile) {
        //const path = "./" + nextFile
        const path = nextFile
        console.log("importing '" + path + "'")

        import(path).then((module) => {
            loadNextFile()
        })
    } else {
        window.app = App.clone()
        window.app.run()
    }
}
*/

window.onload = () => {
    loadNextFile()
}

