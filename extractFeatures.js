
let config = require("./config.json");
let qm = require(config.qminer);
let fs = require('fs');

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
let fn = config.pathToData + config.fileName ; //  config.testData
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
        values: ["Gay", "Abortion", "Illegal immigration", "Climate change", 
        "Wall Street", "Privacy", "Mexico" ] }       
        // Illegal immigration as proxy for Trump's Wall, add new concepts if needed
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
        { name: "abortionCount", type: "float" },
        { name: "wallCount", type: "float" }, 
        { name: "climateChgCount", type: "float" }, 
        { name: "wallStCount", type: "float" }, 
        { name: "privacyCount", type: "float" },
        { name: "mexicoCount", type: "float" },
        { name: "dailyCount", type: "float" } 
         //add new concepts
    ]
}

let tsStore = base.createStore(tsSchema);

console.log("tsStore created");


// Initialise counts
console.time("counts");
var gaycount = 0;
var abortioncount = 0;
var wallcount = 0;
var climatechgcount =0;
var wallstcount =0;
var privacycount =0;
var mexicocount =0;
var dailycount = 0;

 // Create output file and first line
 fs.writeFile('tsData.csv', ["Date","Gay","Abortion","Wall","Climate Change", 
 "Wall St.", "Privacy", "Mexico"]+"\n", (err)=> {if (err) throw err;});

for (var i = 0; i < newsStore.length; i++) {
    
    var rec = newsStore[i];
    if(tsStore.length > 0  && rec.date <= tsStore.last.Time){
        continue;
    }
    
    let recPrev = newsStore[0];
    if (i > 0)
        recPrev = newsStore[i - 1];
    //recPrev.Time = recPrev.date;
    // let recPrev = {};
    // if (tsStore.length > 0)
    //     recPrev = tsStore.last;
    // else if (i==0){
    //      recPrev = newsStore[0];   
    //      recPrev.Time = recPrev.date;     
    // }
    // else{
    //      recPrev = newsStore[i-1];
    //      recPrev.Time = recPrev.date;
    // }

       // recPrev = newsStore[i - 1];
    
    var vec = ftr.extractSparseVector(rec);
    var valVec = vec.valVec();
    var idxVec = vec.idxVec();
   
  
    // increase counts
    let date = rec.date;
   // date = date.getUTCDate();
    let prevDate = recPrev.date;
   // prevDate = prevDate.getUTCDate();
   // console.log("date: " ,date, "prev date: ", prevDate);

    if (date.getUTCDate() > prevDate.getUTCDate() || 
        (date.getUTCDate() < prevDate.getUTCDate() && 
        date.getUTCMonth() > prevDate.getUTCMonth())
        ) { // date changed so we push the value into tsStore
        
        let weblogdate = recPrev.date.toISOString().replace(/\..+/, '');
        tsStore.push({
            Time: weblogdate, 
            gayCount: gaycount,
            abortionCount: abortioncount,
            wallCount: wallcount,
            climateChgCount: climatechgcount,
            wallStCount: wallstcount,
            privacyCount: privacycount,
            mexicoCount: mexicocount,
            dailyCount: dailycount
        });
        // reset the counts
        gaycount = 0;
        abortioncount = 0;
        wallcount = 0;
        climatechgcount = 0;
        wallstcount = 0;
        privacycount = 0;
        mexicocount = 0;
        dailycount = 0;

        //  report the results
        let newRec = tsStore.last;
        console.log(
            "Date:",
            newRec.Time.toISOString(),
            "Gay:",
            newRec.gayCount,
            "Abortion: ",
            newRec.abortionCount,
            "Wall: ",
            newRec.wallCount,
            "Climate_Change: ",
            newRec.climateChgCount,
            "Wall_St.: ",
            newRec.wallStCount,
            "Privacy: ",
            newRec.privacyCount,
            "Mexico: ",
            newRec.mexicoCount,
            "Daily: ",
            newRec.dailyCount
        );
       
        // Save output to CSV file
        fs.appendFile('tsData.csv', [newRec.Time.toISOString(),newRec.gayCount,newRec.abortionCount, newRec.wallCount, newRec.climateChgCount,newRec.wallStCount, newRec.privacyCount, newRec.mexicoCount, newRec.dailyCount]+"\n", (err) => {
                if (err) throw err;
                //console.log('It\'s saved!');
            });
    }
    
    for (var j = 0; j < idxVec.length; j++) { 
        dailycount += 1;
        if (ftr.getFeature(idxVec[j]) == 'Gay')
            gaycount += 1
        if (ftr.getFeature(idxVec[j]) == 'Abortion')
            abortioncount += 1;
        if (ftr.getFeature(idxVec[j]) == 'Illegal immigration') // proxy for Trump's Wall
            wallcount += 1;
        if (ftr.getFeature(idxVec[j]) == 'Climate change')
            climatechgcount += 1;
        if (ftr.getFeature(idxVec[j]) == 'Wall Street')
            wallstcount += 1;    
        if (ftr.getFeature(idxVec[j]) == 'Privacy')
            privacycount += 1;
        if (ftr.getFeature(idxVec[j]) == 'Mexico')
            mexicocount += 1;
    }
}// for allRecords

console.log("tsStore filled");
console.timeEnd("counts");
console.log(tsStore.length);
base.close();

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

