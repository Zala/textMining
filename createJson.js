let config = require("./config.json");
let qm = require(config.qminer);
let fs = require('fs');

let base = new qm.Base({
    mode: 'openReadOnly'
})

let tsStore = base.store("ts");


fs.writeFile('tsStoreData.json', "[" + "\n", (err)=>{if (err) throw err;});
console.log("writing to tsStoreData.json....")

for (var i=0; i < tsStore.length; i++){
    let recJson = JSON.stringify(tsStore[i].toJSON());
    fs.appendFile('tsStoreData.json', recJson + ",\n");
    debugger
}

fs.appendFile('tsStoreData.json', "]");

console.log("Finished!")

debugger