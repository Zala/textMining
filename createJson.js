let config = require("./config.json");
let qm = require(config.qminer);
let fs = require('fs');

let base = new qm.Base({
    mode: 'openReadOnly'
})

let tsStore = base.store("ts");


fs.writeFile('tsStoreData.json', "", (err)=>{if (err) throw err;});
console.log("writing to tsStoreData.json....")

for (var i=0; i < tsStore.length; i++){
    let recJson = tsStore[i].toJSON();
    recJson = { //leave out record id
        Time: recJson.Time,
        gayCount: recJson.gayCount,
        abortionCount: recJson.abortionCount,
        wallCount: recJson.wallCount,
        climateChgCount: recJson.climateChgCount,
        wallStCount: recJson.wallStCount,
        privacyCount: recJson.privacyCount,
        mexicoCount: recJson.mexicoCount
    }
    let recString = JSON.stringify(recJson); 
    fs.appendFile('tsStoreData.json', recString + "\n");
    debugger
}

console.log("Finished!")

debugger