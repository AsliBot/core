const {async, await} = require('asyncawait');
const redis = require("./redis");
const sms = require("./sms");

const sendOTP = async(mobileNumber => {
  let otp = await(findOrCreateOtp(mobileNumber));
  const message = "Your OTP is " + otp;
  sms.send(mobileNumber, message);
});

const findOrCreateOtp = mobileNumber => {
  const otpKey = `otp_${mobileNumber}`;
  let otp = await(redis.get(otpKey));
  if (!otp) {
    otp = getOtp();
    redis.set(otpKey, otp);
    redis.expire(otpKey, 5*60);
  }
  return otp;
};

const getOtp = () => {
	// random 6 digits
	return Math.floor(100000 + Math.random() * 900000);
}

module.exports = sendOTP;
