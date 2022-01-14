"use strict"

ResourceLoader.pushRelativePaths([
    "../../_imports.js",
    "GameOfLifeApp.js",
]);



ResourceLoader.pushDoneCallback( () => {
    getGlobalThis().app = new GameOfLifeApp()
    getGlobalThis().app.run()
})

