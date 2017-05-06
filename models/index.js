"use strict";
const path = require("path");
const fs = require("fs");
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "DEV";
const {DB} = require("../config")[env];
const db = {};

const sequelize = new Sequelize(DB.name, DB.username, DB.password, DB.options);

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    const model = sequelize.import(path.join(__dirname, file));
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
