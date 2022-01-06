"use strict"

ResourceLoader.pushRelativePaths([
    "../../_imports.js",
    "GameOfLifeApp.js",
]);



ResourceLoader.pushDoneCallback( () => {
    window.app = new GameOfLifeApp()
    window.app.run()
})

