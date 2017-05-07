"use strict";

const fs = require("fs");
const path = require("path");

fs
  .readdirSync(__dirname)
  .forEach( file => {
    if (file === 'index.js') return;
    module.exports[path.basename(file, '.js')] = require(path.join(__dirname, file));
  });
