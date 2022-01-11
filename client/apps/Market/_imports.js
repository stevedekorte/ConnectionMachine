
ResourceLoader.pushRelativePaths([
    "../../_imports.js",
    "CsvTable.js",
    "DataTable.js",
    "AlphaVantageAPI.js",
    "MarketApp.js",
    //"data/bitcoin2013-2021-6.js",
    "data/coincodex_bitcoin_2010-8-16_2022-1-11.js",
    "SparseMarketData.js"
]);

ResourceLoader.pushDoneCallback( () => {
    window.app = new MarketApp()
    window.app.run()
})

