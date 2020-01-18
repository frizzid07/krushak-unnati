// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'AC60a73ba734edfe8f62b3e82ea3da4467';
const authToken = '82b0adef9db385d97eef3edd5e622741';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'Welcome to Krushak Unnati',
     from: '+12563914462',
     to: '+918652859451'
   })
  .then(message => console.log(message.sid));