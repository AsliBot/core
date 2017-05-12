"use strict";

const axios = require('axios');
const {async, await} = require('asyncawait');

const URL = "https://api.chucknorris.io/jokes/random?category=dev";

const fetch = () => {
  return axios.get( URL )
    .then( response => ({ error: false, data: response.data.value }) )
    .catch( error => ({ error: true, data: "Oh no, there has been an internal server error" }) );
};

const init = async((user, params) => {
  let DATA = await( fetch() );
  return DATA;
});

module.exports = init;
