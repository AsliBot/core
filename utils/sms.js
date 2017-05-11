const twilio = require('twilio');
const ENV = process.env.NODE_ENV || "development";
const {keys} = require('../config')[ENV];

const send = (to, body, callback) => {
  const client = new twilio.RestClient(keys.twilio.sid, keys.twilio.token);
  client.messages.create({
    body: body,
    to: '+91'+to,
    from: keys.twilio.from
  }, callback);
};

module.exports = {
  send
};
