"use strict";

const axios = require('axios');
const util = require('util');
const {async, await} = require('asyncawait');
const {keys} = require('../config');
const token = keys.actions.weather;

const URL = "http://api.openweathermap.org/data/2.5/weather?q=%s&units=metric&appid=" + token;

const fetch = city => {
  return axios.get( util.format(URL, city) )
    .then( response => {
      const Weather = response.data;
      const temp = Weather.main.temp;
      const condition = Weather.weather[0].main;
      return { error: false, data: `Its ${temp} °C in ${city} and looks ${condition}` };
    })
    .catch( error => {
      return { error: true, message: "Internal Server Error" };
    });
};

const init = async(params => {
  let DATA = await( fetch(params['geo-city']) );
  return DATA;
});

exports = module.exports = init;