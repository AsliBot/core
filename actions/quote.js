"use strict";

const request = require('request');
const {async, await} = require('asyncawait');

const URL = "http://api.forismatic.com/api/1.0/";
const POST_DATA = { method: 'getQuote', lang: 'en', format: 'json' };

function fetch () {
  const options = {
    method: 'POST',
    url: URL,
    form: POST_DATA
  };
  return new Promise(function (resolve, reject) {
    request(options, (error, res, body) => {
      if (!error && res.statusCode == 200) {
        resolve(JSON.parse(body.replace("\'", "'")));
      } else {
        reject(error);
      }
    });
  });
}

const init = async((user, params) => {
  let DATA = await( fetch() );
  if (DATA) {
    return { error: false, data: `${DATA.quoteText} \n - ${DATA.quoteAuthor}` };
  }
  return { error: true, data: "Oh no, there has been an internal server error" };
});

module.exports = init;
