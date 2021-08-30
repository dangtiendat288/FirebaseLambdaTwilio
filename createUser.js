const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");
const { _200, _400 } = require("./response");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://one-time-password-98aa8-default-rtdb.asia-southeast1.firebasedatabase.app",
});

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { phone } = JSON.parse(event.body);
  //   if (!event.phone) {
  if (!phone) {
    callback(null, _400({ error: "Bad input" }));
    // return res.status(422).send({ error: "Bad input" });
  }
  // format the phone number to remove dashes and parens
  //   const phone = String(event.phone).replace(/[^\d]/g, "");
  const phoneNumber = String(phone).replace(/[^\d]/g, "");

  //create a new user account using that phone number
  admin
    .auth()
    .createUser({ uid: phoneNumber })
    .then((user) => {
      callback(null, _200({ user }));
    })
    .catch((err) => {
      callback(null, _400({ err }));
    });
};
