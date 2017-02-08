
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
        values: ["Gay", "Abortion"] }       // add new concepts if needed
);
ftr.addFeatureExtractor(
    { type: "multinomial", source: "news", field: "date",datetime: true }
);

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
var gaycount = 0;
var abortioncount = 0;

for (var i = 0; i < newsStore.allRecords.length; i++) {
    var rec = newsStore[i];
    let recPrev = newsStore[0];
    if (i > 0)
        recPrev = newsStore[i - 1];
    
    var vec = ftr.extractSparseVector(rec);
    var valVec = vec.valVec();
    var idxVec = vec.idxVec();
   
  
    // increase counts
    if (rec.date.setHours(0, 0, 0) == recPrev.date.setHours(0, 0, 0)) { // condition that we are in the same day
        
        for (var j = 0; j < idxVec.length; j++) { // idxVec.length - 4
            if( ftr.getFeature(idxVec[j]) == 'Gay')
                gaycount += 1
            if( ftr.getFeature(idxVec[j]) == 'Abortion')
                abortioncount += 1;
        }
    }
    else { // date changed so we push the value into tsStore

        tsStore.push({
            Time: new Date(recPrev.date).toISOString(),
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

        // Check the first element of new date
        for (var j = 0; j < idxVec.length; j++) { // idxVec.length - 4
            if (ftr.getFeature(idxVec[j]) == 'Gay')
                gaycount += 1
            if (ftr.getFeature(idxVec[j]) == 'Abortion')
                abortioncount += 1;
        }
    }
}


console.log("tsStore filled");



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

