"use strict";
const path = require("path");
var fs = require("fs");
var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "DEV";
var {DB} = require("../config")[env];
var db = {};

var sequelize = new Sequelize(DB.name, DB.username, DB.password, DB.options);

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
