const admin = require("../config/firebase");

const sendPushNotification = async (token, title, body) => {
    if (!token) return;

    const message = {
        notification: {
            title,
            body
        },
        token
    };

    try {
        await admin.messaging().send(message);
        console.log("Push notification sent");
    } catch (err) {
        console.error("FCM Error:", err.message);
    }
};

module.exports = sendPushNotification;