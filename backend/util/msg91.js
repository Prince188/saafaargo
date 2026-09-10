// MSG91 OTP Widget verification.
// The frontend opens the MSG91 widget popup; after the user completes the
// OTP flow the widget returns a short-lived access token (JWT). We verify
// that token server-side and get back the verified mobile number, so we
// never have to trust a mobile number coming from the client.

const VERIFY_URL = "https://control.msg91.com/api/v5/widget/verifyAccessToken";

async function verifyWidgetAccessToken(accessToken) {
    const authKey = process.env.MSG91_AUTH_KEY;

    if (!authKey) {
        throw new Error("MSG91_AUTH_KEY is not configured");
    }

    if (!accessToken || typeof accessToken !== "string") {
        return { success: false, message: "Access token is required" };
    }

    let response;

    try {
        response = await fetch(VERIFY_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                authkey: authKey,
                "access-token": accessToken
            })
        });
    } catch (err) {
        console.error("MSG91 verifyAccessToken request failed:", err.message);
        return { success: false, message: "OTP verification service unavailable" };
    }

    let data;

    try {
        data = await response.json();
    } catch (err) {
        console.error("MSG91 verifyAccessToken returned non-JSON response");
        return { success: false, message: "OTP verification service error" };
    }

    if (!response.ok || (data.type && data.type !== "success")) {
        return {
            success: false,
            message: data.message || "Mobile verification failed"
        };
    }

    // MSG91 responds with the verified number (with country code), e.g. 919876543210
    const phone =
        data.phone ||
        data.mobile ||
        (data.data && (data.data.phone || data.data.mobile));

    if (!phone) {
        return { success: false, message: "Verified mobile number not found in response" };
    }

    // Keep only digits for safe storage/comparison
    const normalizedPhone = String(phone).replace(/\D/g, "");

    if (!normalizedPhone) {
        return { success: false, message: "Invalid verified mobile number" };
    }

    return { success: true, phone: normalizedPhone };
}

module.exports = { verifyWidgetAccessToken };
