/* eslint-disable */
const entryBuild = require('../entry/entry');
const path = require('path');
const MULTI = '../../multi/';
let entry = {};
entryBuild.map((data) => {
    entry[data.name] = [path.resolve(__dirname, MULTI + data.name + '.js'), data.name];
});
module.exports = entry;
