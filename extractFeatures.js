
let config = require("./config.json");
let qm = require(config.qminer);

// create schema
let newsSchema = {
    name: "news",
    fields: [
        { name: "text", type: "string" },
        { name: "date", type: "datetime" },
        { name: "concepts", type: "string_v" }
    ]
};
'defined schema'

let base = new qm.Base({ mode: "createClean" });
let newsStore = base.createStore(newsSchema);

// import news
let fn = config.pathToData + "Trump(27.12.2015-1.1.2016).json";
let fin = qm.fs.openRead(fn);

console.time("import");
while (!fin.eof) {
    let line = fin.readLine();
    let fields = JSON.parse(line);
    let concepts = [];
    for (let i in fields.concepts){
        concepts.push(fields.concepts[i].label.eng)
    }
    let recJson = {
        text: fields.body,
        date: fields.date + "T" + fields.time,
        concepts: concepts
    };
    newsStore.push(recJson);
}
console.timeEnd("import");

// create a feature space 
console.time("feature_extr");

let news = base.store('news').allRecords;

let ftr = new qm.FeatureSpace(base, 
    { type: "multinomial", source: "news", field: "concepts", 
        values: ["Gay", "Abortion"] }       
);
ftr.addFeatureExtractor(
    { type: "multinomial", source: "news", field: "date", datetime: true }
);

ftr.updateRecords(news);
console.timeEnd("feature_extr");


//let M = ftr.extractSparseMatrix(news);
//first
//let first = M.getCol(0);
//first.print();
//ftr.getFeature(0);
//first.at(0); //value at 0 ind

var rec = newsStore[1];
var vec = ftr.extractSparseVector(rec);
var idxVec = vec.idxVec();
var valVec = vec.valVec();
for (var i = 0; i < idxVec.length; i++) {
    console.log(ftr.getFeature(idxVec[i]) + " " + valVec[i]);
}


debugger

