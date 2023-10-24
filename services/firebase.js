const admin = require("firebase-admin");
const serviceAccount = require("../mindicatorapp-6df6a-firebase-adminsdk-y85rk-334b998653.json");

const firebaseInit = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
};

module.exports = firebaseInit;
