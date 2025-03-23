const admin = require("firebase-admin");

const serviceAccount = require("../../config/nykaaclone-a6943-firebase-adminsdk-fbsvc-22c4c624f9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
