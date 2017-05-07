"use strict";

const redis = require("redis");
const Promise = require("bluebird");

const client = Promise.promisifyAll(redis.createClient());

client.on("error", (err) => {
    console.log("Redis Error " + err);
});

module.exports = {
  set: (key, value) => {
    client.set(key, value, err => {
      console.log(err);
    });
  },
  get: key => {
    return client.getAsync(key)
      .then(res => {
        return (res) ? res.toString() : res;
      });
  }
};
