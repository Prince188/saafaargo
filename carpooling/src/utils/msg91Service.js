/**
 * MSG91 Web SDK integration (Custom UI, exposeMethods: true).
 * Docs: https://msg91.com/help/sendotp/how-to-integrate-the-new-login-with-otp-widget
 *
 * Contract used here:
 *   initSendOTP({ widgetId, tokenAuth, identifier, exposeMethods, success, failure })
 *   window.sendOtp(identifier, onSuccess, onFailure)      // identifier = country code + number, digits only, no "+"
 *   window.retryOtp(channel, onSuccess, onFailure)         // channel: null (default), '11' (SMS), '4' (Voice), '3' (Email)
 *   window.verifyOtp(otp, onSuccess, onFailure)           // data.message contains the access token
 */

const MSG91_WIDGET_ID = process.env.REACT_APP_MSG91_WIDGET_ID || "3668796e4655373134323237";
const MSG91_TOKEN_AUTH = process.env.REACT_APP_MSG91_TOKEN_AUTH || "564339T7fRIy1e6a8d9cf6P1";

const MSG91_SCRIPT_URLS = [
    'https://verify.msg91.com/otp-provider.js',
    'https://verify.phone91.com/otp-provider.js'
];

const READY_POLL_INTERVAL_MS = 250;
const READY_TIMEOUT_MS = 8000;

let msg91ScriptIndex = 0;
let loadPromise = null;

const maskIdentifier = (identifier) => {
    const str = String(identifier || "");
    if (str.length <= 4) return "***";
    return `${str.slice(0, 2)}****${str.slice(-2)}`;
};

/**
 * Normalises a country code + local mobile number into the identifier format
 * required by MSG91: digits only, country code first, no "+" or spaces.
 * e.g. "+91", "+91 91062-69655" -> "919106269655"
 */
export const buildIdentifier = (countryCode, mobile) => {
    const cc = String(countryCode || "").replace(/\D/g, "");
    let national = String(mobile || "").replace(/\D/g, "");

    // Drop local trunk prefixes like the leading 0 in "098765 43210".
    national = national.replace(/^0+/, "");

    // If the full international number was pasted, avoid duplicating the country code.
    if (cc && national.startsWith(cc) && national.length >= cc.length + 10) {
        national = national.slice(cc.length);
    }

    return `${cc}${national}`;
};

// otp-provider.js only defines initSendOTP on load; sendOtp/verifyOtp are
// attached to window BY initSendOTP() once it runs with exposeMethods: true.
const hasInit = () => typeof window.initSendOTP === "function";

const hasExposedMethods = () =>
    typeof window.sendOtp === "function" &&
    typeof window.retryOtp === "function" &&
    typeof window.verifyOtp === "function";

const injectScript = (src) =>
    new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.dataset.msg91 = "true";
        s.onload = () => setTimeout(resolve, 0);
        s.onerror = () => {
            s.remove();
            reject(new Error(`[MSG91] Failed to load script: ${src}`));
        };
        document.head.appendChild(s);
    });

const loadScript = () => {
    if (loadPromise) return loadPromise;

    loadPromise = (async () => {
        if (hasInit()) return;

        while (msg91ScriptIndex < MSG91_SCRIPT_URLS.length) {
            const url = MSG91_SCRIPT_URLS[msg91ScriptIndex];
            try {
                await injectScript(url);
                if (hasInit()) {
                    console.info(`[MSG91] SDK loaded from ${url}`);
                    return;
                }
                console.warn(`[MSG91] Script loaded but SDK unavailable, trying fallback: ${url}`);
            } catch (err) {
                console.warn(err.message);
            }
            msg91ScriptIndex++;
        }

        loadPromise = null;
        throw new Error("[MSG91] All script sources failed to load");
    })();

    return loadPromise;
};

const waitFor = (predicate, label) =>
    new Promise((resolve, reject) => {
        if (predicate()) return resolve();

        const startedAt = Date.now();
        const timer = setInterval(() => {
            if (predicate()) {
                clearInterval(timer);
                resolve();
            } else if (Date.now() - startedAt > READY_TIMEOUT_MS) {
                clearInterval(timer);
                reject(new Error(`[MSG91] ${label} did not become available in time`));
            }
        }, READY_POLL_INTERVAL_MS);
    });

const startSession = (identifier) =>
    new Promise((resolve, reject) => {
        window.configuration = {
            widgetId: MSG91_WIDGET_ID,
            tokenAuth: MSG91_TOKEN_AUTH,
            identifier,
            exposeMethods: true,
            // Per MSG91 docs, when listening to verifyOtp()'s own callbacks these
            // config callbacks would fire duplicates — so they only log.
            success: (data) => {
                console.info(`[MSG91] Widget success for ${maskIdentifier(identifier)}:`, data);
            },
            failure: (error) => {
                console.error(`[MSG91] Widget failure for ${maskIdentifier(identifier)}:`, error);
            }
        };

        try {
            window.initSendOTP(window.configuration);
            console.info(`[MSG91] Session initialised for ${maskIdentifier(identifier)}`);
            resolve();
        } catch (err) {
            console.error("[MSG91] initSendOTP threw an exception:", err);
            reject(err);
        }
    });

/**
 * Loads the SDK (with fallback URLs) if needed and (re)initialises the widget
 * session for the given identifier. Safe to call repeatedly and on any route —
 * this is what makes send/resend/verify survive a page refresh.
 */
export const ensureSession = async (identifier) => {
    if (!identifier || !/^\d{8,15}$/.test(String(identifier))) {
        throw new Error(`[MSG91] Invalid identifier: "${maskIdentifier(identifier)}"`);
    }

    // 1) Load the script — it only defines initSendOTP.
    await loadScript();
    await waitFor(hasInit, "initSendOTP");

    // 2) sendOtp/verifyOtp don't exist yet? Run the widget session — calling
    //    initSendOTP with exposeMethods: true attaches them to window.
    if (!hasExposedMethods()) {
        await startSession(identifier);
    }

    // 3) Confirm the exposed methods are ready before callers use them.
    await waitFor(
        hasExposedMethods,
        "sendOtp/verifyOtp (check widgetId/tokenAuth and that exposeMethods is enabled for this widget)"
    );

    return identifier;
};

export const sendOtp = (identifier, { onSuccess, onError } = {}) => {
    console.info(`[MSG91] Sending OTP to ${maskIdentifier(identifier)}`);
    window.sendOtp(
        identifier,
        (data) => {
            console.info(`[MSG91] OTP sent successfully to ${maskIdentifier(identifier)}`, data);
            if (onSuccess) onSuccess(data);
        },
        (error) => {
            console.error(`[MSG91] Failed to send OTP to ${maskIdentifier(identifier)}:`, error);
            if (onError) onError(error);
        }
    );
};

export const retryOtp = ({ channel = "12", onSuccess, onError } = {}) => {
    console.info(`[MSG91] Retrying OTP via WhatsApp (channel: ${channel})`);
    window.retryOtp(
        channel,
        (data) => {
            console.info("[MSG91] OTP resent successfully", data);
            if (onSuccess) onSuccess(data);
        },
        (error) => {
            console.error("[MSG91] Failed to retry OTP:", error);
            if (onError) onError(error);
        }
    );
};

export const verifyOtp = (otp, { onSuccess, onError } = {}) => {
    console.info("[MSG91] Verifying OTP...");
    window.verifyOtp(
        otp,
        (data) => {
            console.info("[MSG91] OTP verified successfully");
            if (onSuccess) onSuccess(data);
        },
        (error) => {
            console.error("[MSG91] OTP verification failed:", error);
            if (onError) onError(error);
        }
    );
};
