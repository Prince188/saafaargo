const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Firebase service account JSON path.
// Override with FCM_SERVICE_ACCOUNT in .env, defaults to ./firebase-service-account.json
const SERVICE_ACCOUNT_PATH =
    process.env.FCM_SERVICE_ACCOUNT || "./firebase-service-account.json";

let serviceAccount = null;
let accessToken = null;
let accessTokenExpiry = 0;

function loadServiceAccount() {
    if (serviceAccount) return serviceAccount;

    // 1) Prefer the raw JSON passed as an env var (best for Render / Vercel,
    //    where files are awkward). Set FCM_SERVICE_ACCOUNT_JSON to the full
    //    contents of the service-account JSON.
    if (process.env.FCM_SERVICE_ACCOUNT_JSON) {
        serviceAccount = JSON.parse(process.env.FCM_SERVICE_ACCOUNT_JSON);
        return serviceAccount;
    }

    // 2) Else read from a file path (FCM_SERVICE_ACCOUNT) or the default path.
    if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
        throw new Error(
            `Firebase service account not found at ${SERVICE_ACCOUNT_PATH} and FCM_SERVICE_ACCOUNT_JSON is not set. ` +
            "Download it from Firebase console > Project settings > Service accounts > Generate new private key. " +
            "Either set FCM_SERVICE_ACCOUNT_JSON (recommended on Render) or place the file in the backend folder."
        );
    }
    serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf8"));
    return serviceAccount;
}

async function getAccessToken() {
    const now = Math.floor(Date.now() / 1000);
    if (accessToken && now < accessTokenExpiry - 60) return accessToken;

    const sa = loadServiceAccount();

    const signedJwt = jwt.sign(
        {
            iss: sa.client_email,
            scope: "https://www.googleapis.com/auth/firebase.messaging",
            aud: "https://oauth2.googleapis.com/token",
            iat: now,
            exp: now + 3600,
        },
        sa.private_key,
        { algorithm: "RS256" }
    );

    const form = new URLSearchParams();
    form.set("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
    form.set("assertion", signedJwt);

    const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
    });

    if (!response.ok) {
        throw new Error(
            `Failed to get OAuth token: ${response.status} ${await response.text()}`
        );
    }

    const data = await response.json();
    accessToken = data.access_token;
    accessTokenExpiry = now + Number(data.expires_in || 3600);
    return accessToken;
}

// Send a single push notification to one device token via FCM HTTP v1 API.
async function sendPush(token, { title, body, data }) {
    if (!token || typeof token !== "string" || !token.trim()) return;

    const sa = loadServiceAccount();
    const auth = await getAccessToken();

    const message = {
        message: {
            token,
            notification: { title, body },
            data: data || {},
        },
    };

    const response = await fetch(
        `https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${auth}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
        }
    );

    if (!response.ok) {
        console.error(`[FCM] Send failed (${response.status}):`, await response.text());
    }
}

// Push a notification to every registered device of a user.
// Callers are responsible for creating the in-app Notification record.
async function notifyUser(userId, { type, title, body, rideId }) {
    if (!userId) return;

    let user;
    try {
        user = await User.findById(userId).select("deviceToken");
    } catch (err) {
        console.error("[notifyUser] Failed to load user:", err.message);
        return;
    }

    const tokens = user?.deviceToken || [];
    const data = {
        type: type || "",
        rideId: rideId ? String(rideId) : "",
    };

    for (const token of tokens) {
        try {
            await sendPush(token, { title, body, data });
        } catch (err) {
            console.error("[FCM] Push error:", err.message);
        }
    }
}

module.exports = { notifyUser, sendPush };
