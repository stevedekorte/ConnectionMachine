
ResourceLoader.pushRelativePaths([
    "../../_imports.js",
    "Thing.js",
    "Ball.js",
    "Paddle.js",
    "PongApp.js",
]);

ResourceLoader.pushDoneCallback( () => {
    getGlobalThis().app = new CellularAutomataApp()
    getGlobalThis().app.run()
})

