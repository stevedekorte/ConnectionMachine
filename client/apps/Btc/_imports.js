
ResourceLoader.pushRelativePaths([
    "../../_imports.js",
    //"BlockChainAPI.js",
    "BlockCypherAPI.js",
    //"BitcoinExplorerAPI.js",
    "BtcApp.js"
]);



ResourceLoader.pushDoneCallback( () => {
    getGlobalThis().app = new BtcApp()
    getGlobalThis().app.run()
})

