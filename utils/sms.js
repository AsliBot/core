const twilio = require('twilio');
const {keys} = require('../config');

const sms = (to, body, callback) => {
  const client = new twilio.RestClient(keys.twilio.sid, keys.twilio.token);
  client.messages.create({
    body: body,
    to: '+91'+to,
    from: keys.twilio.from
  }, callback);
};
