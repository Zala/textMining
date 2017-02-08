
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
let fn = config.pathToData + "Trump.json";
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
        values: ["Gay", "Abortion"] }       // add new concepts if needed
);
// ftr.addFeatureExtractor(
//     { type: "multinomial", source: "news", field: "date",datetime: true }
// );

ftr.updateRecords(news);
console.timeEnd("feature_extr");


// Create store for Time Series 
let tsSchema = {
    name: "ts",
    fields: [
        { name: "Time", type: "datetime" },
        { name: "gayCount", type: "float" },
        { name: "abortionCount", type: "float" } //add new concepts
    ]
}

let tsStore = base.createStore(tsSchema);

console.log("tsStore created");


// Initialise counts
console.time("counts");
var gaycount = 0;
var abortioncount = 0;
for (var i = 0; i < newsStore.length; i++) {
    var rec = newsStore[i];
    let recPrev = newsStore[0];
    if (i > 0)
        recPrev = newsStore[i - 1];
    
    var vec = ftr.extractSparseVector(rec);
    var valVec = vec.valVec();
    var idxVec = vec.idxVec();
   
  
    // increase counts
    let date = rec.date;
    date = date.setHours(0,0,0);
    let prevDate = recPrev.date;
    prevDate = prevDate.setHours(0,0,0);
    if (date != prevDate) { // date changed so we push the value into tsStore
        let weblogdate = recPrev.date.toISOString().replace(/\..+/, '');
        tsStore.push({
            Time: weblogdate, 
            gayCount: gaycount,
            abortionCount: abortioncount
        });
        // reset the counts
        gaycount = 0;
        abortioncount = 0;

        //  report the results
        let newRec = tsStore.last;
        console.log(
            "Date:",
            newRec.Time.toISOString(),
            "Gay:",
            newRec.gayCount,
            "Abortion: ",
            newRec.abortionCount
        );
    }
    
    for (var j = 0; j < idxVec.length; j++) { 
        if (ftr.getFeature(idxVec[j]) == 'Gay')
            gaycount += 1
        if (ftr.getFeature(idxVec[j]) == 'Abortion')
            abortioncount += 1;
    }
}// for allRecords

console.log("tsStore filled");
console.timeEnd("counts");



//let M = ftr.extractSparseMatrix(news);
//first
//let first = M.getCol(0);
//first.print();
//ftr.getFeature(0);
//first.at(0); //value at 0 ind

//var rec = newsStore[1];//3393
//var vec = ftr.extractSparseVector(rec);
//var idxVec = vec.idxVec();
//var valVec = vec.valVec();
//console.log(idxVec.length)
//for (var i = 0; i < idxVec.length; i++) {
//    console.log(ftr.getFeature(idxVec[i]) + " " + valVec[i]);
//}

debugger

