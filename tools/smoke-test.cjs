"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const root = path.join(__dirname, "..");
const sources = {
  words: fs.readFileSync(path.join(root, "vocabulary-data.js"), "utf8"),
  app: fs.readFileSync(path.join(root, "app.js"), "utf8"),
  html: fs.readFileSync(path.join(root, "index.html"), "utf8"),
};
assert.match(sources.html, /vocabulary-data\.js/);
assert.match(sources.html, /app\.js/);
const harness = {};
const events = {};
const store = {};
const app = {innerHTML: "", addEventListener(event, fn) {events[event] = fn;}};
const document = {
  getElementById(id) {return id === "app" ? app : null;},
  querySelector() {return {focus() {}};},
  addEventListener(event, fn) {events["document:" + event] = fn;},
};
const localStorage = {
  getItem(key) {return store[key] || null;},
  setItem(key, value) {store[key] = value;},
};
const context = vm.createContext({
  document, localStorage, window: {scrollTo() {}},
  confirm() {return true;}, alert() {},
  Date, Math, String, Object, Number, Array, JSON, Intl,
});
vm.runInContext(sources.words, context, {filename: "vocabulary-data.js"});
const bank = vm.runInContext("VOCAB_BANK", context);
assert.equal(bank.length, 200, "Vocabulary database should contain 200 words");
assert.equal(new Set(bank.map(w => w.word)).size, 200, "Words should be unique");
for (let level=1; level<=5; level++) assert.equal(bank.filter(w => w.level === level).length, 40);
for (const w of bank) {
  assert.ok(w.word && w.definition && w.example && w.synonym && w.antonym, "Incomplete word entry");
}
function initialize() {vm.runInContext(sources.app, context, {filename:"app.js"});}
function click(action, fields = {}) {
  assert.ok(events.click, "Missing app click handler");
  events.click({target:{closest() {return {dataset:{action, ...fields}};}}});
}
function state() {return JSON.parse(store["lexicon-vocab-v1"]);}
initialize();
assert.match(app.innerHTML, /Expand your vocabulary/);
click("quick");
let cur=state();
assert.equal(cur.activeSession.questions.length, 5);
assert.equal(new Set(cur.activeSession.questions.map(q=>q.word)).size, 5);
let q=cur.activeSession.questions[0];
assert.equal(q.options.length, 4);
assert.equal(new Set(q.options).size, 4);
click("select",{index:String((q.correct + 1) % 4)});
click("check");
cur=state();
assert.equal(cur.activeSession.answers[0].correct, false);
assert.equal(cur.wordHistory[q.word].wrong, 1);
assert.equal(cur.wordHistory[q.word].successfulReviews, 0);
click("leave");
assert.match(app.innerHTML, /Resume Session/);
click("resume");
assert.match(app.innerHTML, /Question 1 of 5/);
click("next");
for(let i=1;i<5;i++) {
  cur=state();
  q=cur.activeSession.questions[i];
  click("select",{index:String(q.correct)});
  click("check");
  assert.equal(state().activeSession.answers.length,i+1);
  click("next");
}
cur=state();
assert.equal(cur.activeSession,null);
assert.equal(cur.sessions.length,1);
assert.equal(cur.sessions[0].correct,4);
assert.equal(cur.sessions[0].count,5);
assert.equal(cur.sessions[0].xp,40);
assert.equal(cur.xp,40);
assert.ok(cur.attempts.length === 5);
initialize();
assert.equal(state().sessions.length,1,"Refresh should retain completed sessions");
assert.match(app.innerHTML,/Expand your vocabulary/);
click("standard");
cur=state();
assert.equal(cur.activeSession.questions.length,10);
assert.equal(new Set(cur.activeSession.questions.map(q=>q.word)).size,10);
console.log("PASS: 200 words across 5 tiers; 5- and 10-question sessions; answer validation; review scheduling; saved sessions; XP; resume and persistence.");
