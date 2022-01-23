
ResourceLoader.pushRelativePaths([
    "../../_imports.js",
    "ClearApp.js",
]);



ResourceLoader.pushDoneCallback( () => {
    getGlobalThis().app = new ClearApp()
    getGlobalThis().app.run()
})

