const admin = require("firebase-admin");
const config = require("./default");

const serviceAccount = JSON.parse(config.firebase);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

module.exports = admin;