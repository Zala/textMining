
let config = require("./config.json");
let qm = require(config.qminer);

// create schema
let newsSchema = {
    name: "news",
    fields: [
        { name: "text", type: "string" },
        { name: "date", type: "datetime" }
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
    let recJson = {
        text: fields.body,
        date: fields.date + "T" + fields.time
    };
    newsStore.push(recJson);
}
console.timeEnd("import");

// create a feature space containing the text (bag of words) extractor, 
// where the values are normalized,
// weighted with 'tfidf' and the tokenizer is of 'simple' type, 
// it uses english stopwords.
var ftr = new qm.FeatureSpace(base, 
    { type: "text", source: "news", field: "text", normalize: true, 
        weight: "tfidf", tokenizer: { type: "simple", stopwords: "en"}
    }    
);

let news = base.store('news').allRecords;
ftr.updateRecords(news);

let M = ftr.extractSparseMatrix(news);
//first
let first = M.getCol(0);
first.print();
ftr.getFeature(0);
first.at(0); //value at 0 ind


debugger

