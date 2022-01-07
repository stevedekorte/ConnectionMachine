
ResourceLoader.pushRelativePaths([
    "../../_imports.js",
    "CA.js",
    "CellularAutomataApp.js",
]);

ResourceLoader.pushDoneCallback( () => {
    window.app = new CellularAutomataApp()
    window.app.run()
})

