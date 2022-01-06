
ResourceLoader.pushRelativePaths([
    "../../_imports.js",
    "RandomSet.js",
    "Branch.js",
    "SnowflakeApp.js",
]);

ResourceLoader.pushDoneCallback( () => {
    window.app = new SnowflakeApp()
    window.app.run()
})

