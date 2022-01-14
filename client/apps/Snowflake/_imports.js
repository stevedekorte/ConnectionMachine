
ResourceLoader.pushRelativePaths([
    "../../_imports.js",
    "RandomSet.js",
    "Branch.js",
    "SnowflakeApp.js",
]);

ResourceLoader.pushDoneCallback( () => {
    getGlobalThis().app = new SnowflakeApp()
    getGlobalThis().app.run()
})

