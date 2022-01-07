
ResourceLoader.pushRelativePaths([
    "../../_imports.js",
    "PongApp.js",
]);

ResourceLoader.pushDoneCallback( () => {
    window.app = new CellularAutomataApp()
    window.app.run()
})

