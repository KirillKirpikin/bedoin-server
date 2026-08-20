const axios = require("axios");

const AUTH_URL = "https://api-seller.rozetka.com.ua/sites";
const API_BASE_URL = "https://api-seller.rozetka.com.ua";
const TOKEN_TTL_MS = 20 * 60 * 60 * 1000; // refresh well before Rozetka's 24h token expiry
const SESSION_ERROR_CODES = new Set([1020, 6001]); // incorrect_access_token, session_expired

let cachedToken = null;
let tokenObtainedAt = 0;
let loginPromise = null;

async function login() {
    const { ROZETKA_USERNAME, ROZETKA_PASSWORD } = process.env;
    if (!ROZETKA_USERNAME || !ROZETKA_PASSWORD) {
        throw new Error("ROZETKA_USERNAME / ROZETKA_PASSWORD are not set in .env");
    }

    const password = Buffer.from(ROZETKA_PASSWORD).toString("base64");
    const { data } = await axios.post(
        AUTH_URL,
        { username: ROZETKA_USERNAME, password },
        { headers: { "Content-Type": "application/json" } }
    );

    if (!data.success) {
        throw new Error(`Rozetka login failed: ${data.errors?.message || "unknown error"}`);
    }

    cachedToken = data.content.access_token;
    tokenObtainedAt = Date.now();
    return cachedToken;
}

async function getToken(forceRefresh = false) {
    const isStale = Date.now() - tokenObtainedAt > TOKEN_TTL_MS;
    if (forceRefresh || !cachedToken || isStale) {
        // Coalesce concurrent refreshes into a single login call
        if (!loginPromise) {
            loginPromise = login().finally(() => {
                loginPromise = null;
            });
        }
        await loginPromise;
    }
    return cachedToken;
}

async function rozetkaRequest(method, path, config = {}) {
    const token = await getToken();
    const call = (authToken) =>
        axios.request({
            method,
            url: `${API_BASE_URL}${path}`,
            ...config,
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
                ...(config.headers || {}),
            },
        });

    const response = await call(token);

    if (response.data.success === false && SESSION_ERROR_CODES.has(response.data.errors?.code)) {
        const freshToken = await getToken(true);
        return call(freshToken);
    }

    return response;
}

const rozetkaGet = (path, config) => rozetkaRequest("get", path, config);
const rozetkaPost = (path, data, config = {}) =>
    rozetkaRequest("post", path, { ...config, data });

module.exports = { rozetkaGet, rozetkaPost };
