let config = require("./config.json");
let qm = require(config.qminer);
var loader = require("mt-dataloader");
var glm = require('regression');

let base = new qm.Base({
    mode: 'openReadOnly'
})

let tsStore = base.store("ts");

let stats = qm.statistics;

// ***************************** abortion *****************************
let ts = tsStore.getVector('abortionCount').toArray();
let t = [];
for (let i=0; i<ts.length; i++){
    let tuple = [i, ts[i]];
    t.push(tuple);
}

let result = glm('linear', t);
let test = ttest(result.equation[0], 0, ts, getPredictions(result.points));
let p = stats.studentCdf(test, ts.length-2);
console.log('degrees of freedom: ', ts.length-2);
console.log('');
// let slope = result.equation[0];
// let yIntercept = result.equation[1];
console.log('Linear regression for abortion: ', result.string);
console.log('r2 for abortion: ', result.r2);
console.log('tscore for abortion: ', test);
console.log('p-value: ', p);
console.log('');


// ***************************** mexico *****************************
ts = tsStore.getVector('mexicoCount').toArray();
t = [];
for (let i=0; i<ts.length; i++){
    let tuple = [i, ts[i]];
    t.push(tuple);
}
result = glm('linear', t);
test = ttest(result.equation[0], 0, ts, getPredictions(result.points));
p = stats.studentCdf(test, ts.length-2);

console.log('Linear regression for mexico: ', result.string);
console.log('r2 for mexico: ', result.r2);
console.log('tscore for mexico: ', test);
console.log('p-value: ', p);
console.log('');



// ***************************** privacy *****************************
ts = tsStore.getVector('privacyCount').toArray();
t = [];
for (let i=0; i<ts.length; i++){
    let tuple = [i, ts[i]];
    t.push(tuple);
}
result = glm('linear', t);
test = ttest(result.equation[0], 0, ts, getPredictions(result.points));
p = stats.studentCdf(test, ts.length-2);

console.log('Linear regression for privacy: ', result.string);
console.log('r2 for privacy: ', result.r2);
console.log('tscore for privacy: ', test);
console.log('p-value: ', p);
console.log('');

// ***************************** wall street *****************************
ts = tsStore.getVector('wallStCount').toArray();
t = [];
for (let i=0; i<ts.length; i++){
    let tuple = [i, ts[i]];
    t.push(tuple);
}
result = glm('linear', t);
test = ttest(result.equation[0], 0, ts, getPredictions(result.points));
p = stats.studentCdf(test, ts.length-2);

console.log('Linear regression for wall street: ', result.string);
console.log('r2 for wallStCount: ', result.r2);
console.log('tscore for wallStCount: ', test);
console.log('p-value: ', p);
console.log('');

// ***************************** climate change *****************************
ts = tsStore.getVector('climateChgCount').toArray();
t = [];
for (let i=0; i<ts.length; i++){
    let tuple = [i, ts[i]];
    t.push(tuple);
}
result = glm('linear', t);
test = ttest(result.equation[0], 0, ts, getPredictions(result.points));
p = stats.studentCdf(test, ts.length-2);

console.log('Linear regression for climate change: ', result.string);
console.log('r2 for climateChg: ', result.r2);
console.log('tscore for climate change: ', test);
console.log('p-value: ', p);
console.log('');

// ***************************** wall *****************************
ts = tsStore.getVector('wallCount').toArray();
t = [];
for (let i=0; i<ts.length; i++){
    let tuple = [i, ts[i]];
    t.push(tuple);
}
result = glm('linear', t);
test = ttest(result.equation[0], 0, ts, getPredictions(result.points));
p = stats.studentCdf(test, ts.length-2);

console.log('Linear regression for wall: ', result.string);
console.log('r2 for wall: ', result.r2);
console.log('tscore for wall: ', test);
console.log('p-value: ', p);
console.log('');

// ***************************** gay *****************************
ts = tsStore.getVector('gayCount').toArray();
t = [];
for (let i=0; i<ts.length; i++){
    let tuple = [i, ts[i]];
    t.push(tuple);
}
result = glm('linear', t);
test = ttest(result.equation[0], 0, ts, getPredictions(result.points));
p = stats.studentCdf(test, ts.length-2);

console.log('Linear regression for gay: ', result.string);
console.log('r2 for gay: ', result.r2);
console.log('tscore for gay: ', test);
console.log('p-value: ', p);
console.log('');




function ttest(alpha_1, alpha_0, data, predictions){

    let average = 0;
    for (var i=0; i < data.length; i++){
        average += i;
    }
    average = average / data.length;

    let SSR = 0;
    let ss = 0;
    
    for (var i=0; i < data.length; i++){
        ss = ss + Math.pow((i - average), 2);
        SSR = SSR + Math.pow(data[i] - predictions[i], 2);
    }    

    let tscore = ( alpha_1 - alpha_0) * (Math.sqrt(data.length - 2)) / (Math.sqrt( SSR / ss));  
    return tscore;    
}



function getPredictions(points){
    let predictions = [];
    for (let i in points){
        let p = points[i];
        predictions.push(p[1]);
    }
    return predictions;
}
debugger