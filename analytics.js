let config = require("./config.json");
let qm = require(config.qminer);
// var loader = require("mt-dataloader");
var glm = require('regression');

let base = new qm.Base({
    mode: 'openReadOnly'
})

let tsStore = base.store("ts");


// ***************************** abortion *****************************
let ts = tsStore.getVector('abortionCount').toArray();

let t = [];
for (let i=0; i<ts.length; i++){
    let tuple = [i, ts[i]];
    t.push(tuple);
}

let result = glm('linear', t);
// let slope = result.equation[0];
// let yIntercept = result.equation[1];
console.log('Linear regression for abortion: ', result.string);
console.log('r2 for abortion: ', result.r2);


// ***************************** mexico *****************************
ts = tsStore.getVector('mexicoCount').toArray();
t = [];
for (let i=0; i<ts.length; i++){
    let tuple = [i, ts[i]];
    t.push(tuple);
}
result = glm('linear', t);
console.log('Linear regression for mexico: ', result.string);
console.log('r2 for mexico: ', result.r2);


// ***************************** privacy *****************************
ts = tsStore.getVector('privacyCount').toArray();
t = [];
for (let i=0; i<ts.length; i++){
    let tuple = [i, ts[i]];
    t.push(tuple);
}
result = glm('linear', t);
console.log('Linear regression for privacy: ', result.string);
console.log('r2 for privacy: ', result.r2);

// ***************************** wall street *****************************
ts = tsStore.getVector('wallStCount').toArray();
t = [];
for (let i=0; i<ts.length; i++){
    let tuple = [i, ts[i]];
    t.push(tuple);
}
result = glm('linear', t);
console.log('Linear regression for wall street: ', result.string);
console.log('r2 for wallStCount: ', result.r2);

// ***************************** climate change *****************************
ts = tsStore.getVector('climateChgCount').toArray();
t = [];
for (let i=0; i<ts.length; i++){
    let tuple = [i, ts[i]];
    t.push(tuple);
}
result = glm('linear', t);
console.log('Linear regression for climate change: ', result.string);
console.log('r2 for climateChg: ', result.r2);

// ***************************** wall *****************************
ts = tsStore.getVector('wallCount').toArray();
t = [];
for (let i=0; i<ts.length; i++){
    let tuple = [i, ts[i]];
    t.push(tuple);
}
result = glm('linear', t);
console.log('Linear regression for wall: ', result.string);
console.log('r2 for wall: ', result.r2);

// ***************************** gay *****************************
ts = tsStore.getVector('gayCount').toArray();
t = [];
for (let i=0; i<ts.length; i++){
    let tuple = [i, ts[i]];
    t.push(tuple);
}
result = glm('linear', t);
console.log('Linear regression for gay: ', result.string);
console.log('r2 for gay: ', result.r2);


debugger