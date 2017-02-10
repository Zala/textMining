let config = require("./config.json");
let qm = require(config.qminer);

let base = new qm.Base({
    mode: 'openReadOnly'
})

let tsStore = base.store("ts");

debugger