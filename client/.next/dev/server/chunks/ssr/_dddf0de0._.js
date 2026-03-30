module.exports = [
"[project]/app/(admin-panel)/admin/login/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00025f0bbcd9c0d37dcc1b35924b3ff65f378329c3":"refreshAccessToken","0009164cbee036f745a9b1500bcc47c279ae4b75db":"logout","0018570bb1c6202f704d29999ee9a88c299adb7299":"isAuthenticated","0025ad682e654f82c1f87ebe1bfb0225c765a17ed5":"getValidAccessToken","0035dafe985929bfb36fe3bc053d20331bb68c2e90":"getAccessToken","00839ec1f172a57cc1e166163dfca9d95eaac1f0f9":"getAdminInfo","4062f9731f1c31117ad64059214d2b83c9dfa03dfc":"login"},"",""] */ __turbopack_context__.s([
    "getAccessToken",
    ()=>getAccessToken,
    "getAdminInfo",
    ()=>getAdminInfo,
    "getValidAccessToken",
    ()=>getValidAccessToken,
    "isAuthenticated",
    ()=>isAuthenticated,
    "login",
    ()=>login,
    "logout",
    ()=>logout,
    "refreshAccessToken",
    ()=>refreshAccessToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
// Remove trailing /api if present to avoid double /api/api paths
const rawApiUrl = ("TURBOPACK compile-time value", "http://localhost:5001/api") || 'http://localhost:5002';
const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl.slice(0, -4) : rawApiUrl;
async function login(formData) {
    const username = formData.get('username');
    const password = formData.get('password');
    if (!username || !password) {
        return {
            error: 'Username and password are required'
        };
    }
    let shouldRedirect = false;
    try {
        const response = await fetch(`${API_URL}/api/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        const data = await response.json();
        if (data.success && data.accessToken && data.refreshToken && data.admin) {
            const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
            // Store access token (short-lived, httpOnly)
            cookieStore.set('admin_access_token', data.accessToken, {
                httpOnly: true,
                secure: ("TURBOPACK compile-time value", "development") === 'production',
                sameSite: 'lax',
                maxAge: 60 * 15,
                path: '/'
            });
            // Store refresh token (long-lived, httpOnly)
            cookieStore.set('admin_refresh_token', data.refreshToken, {
                httpOnly: true,
                secure: ("TURBOPACK compile-time value", "development") === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7,
                path: '/'
            });
            // Store token accessible to client-side JS for API calls
            cookieStore.set('admin_token', data.accessToken, {
                httpOnly: false,
                secure: ("TURBOPACK compile-time value", "development") === 'production',
                sameSite: 'lax',
                maxAge: 60 * 15,
                path: '/'
            });
            // Store admin info (non-sensitive, for UI)
            cookieStore.set('admin_info', JSON.stringify({
                id: data.admin.id,
                username: data.admin.username,
                role: data.admin.role
            }), {
                httpOnly: false,
                secure: ("TURBOPACK compile-time value", "development") === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7,
                path: '/'
            });
            shouldRedirect = true;
        } else {
            return {
                error: data.error || 'Login failed'
            };
        }
    } catch (error) {
        console.error('Login error:', error);
        return {
            error: 'Unable to connect to server'
        };
    }
    // Redirect outside try-catch to avoid catching redirect "error"
    if (shouldRedirect) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/admin');
    }
    return {
        error: 'Login failed'
    };
}
async function logout() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete('admin_access_token');
    cookieStore.delete('admin_token');
    cookieStore.delete('admin_refresh_token');
    cookieStore.delete('admin_info');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/admin/login');
}
async function refreshAccessToken() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const refreshToken = cookieStore.get('admin_refresh_token');
    if (!refreshToken) {
        return null;
    }
    try {
        const response = await fetch(`${API_URL}/api/admin/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refreshToken: refreshToken.value
            })
        });
        const data = await response.json();
        if (data.success && data.accessToken && data.refreshToken) {
            // Update tokens
            cookieStore.set('admin_access_token', data.accessToken, {
                httpOnly: true,
                secure: ("TURBOPACK compile-time value", "development") === 'production',
                sameSite: 'lax',
                maxAge: 60 * 15,
                path: '/'
            });
            cookieStore.set('admin_token', data.accessToken, {
                httpOnly: false,
                secure: ("TURBOPACK compile-time value", "development") === 'production',
                sameSite: 'lax',
                maxAge: 60 * 15,
                path: '/'
            });
            cookieStore.set('admin_refresh_token', data.refreshToken, {
                httpOnly: true,
                secure: ("TURBOPACK compile-time value", "development") === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7,
                path: '/'
            });
            return data.accessToken;
        }
    } catch (error) {
        console.error('Refresh token error:', error);
    }
    return null;
}
async function getAdminInfo() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const adminInfo = cookieStore.get('admin_info');
    if (adminInfo) {
        try {
            return JSON.parse(adminInfo.value);
        } catch  {
            return null;
        }
    }
    return null;
}
async function getAccessToken() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get('admin_access_token');
    return token?.value || null;
}
async function getValidAccessToken() {
    let accessToken = await getAccessToken();
    // If no access token, try to refresh
    if (!accessToken) {
        accessToken = await refreshAccessToken();
    }
    return accessToken;
}
async function isAuthenticated() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const accessToken = cookieStore.get('admin_access_token');
    const refreshToken = cookieStore.get('admin_refresh_token');
    // Authenticated if we have either token (refresh can get new access token)
    return !!(accessToken || refreshToken);
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    login,
    logout,
    refreshAccessToken,
    getAdminInfo,
    getAccessToken,
    getValidAccessToken,
    isAuthenticated
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(login, "4062f9731f1c31117ad64059214d2b83c9dfa03dfc", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(logout, "0009164cbee036f745a9b1500bcc47c279ae4b75db", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(refreshAccessToken, "00025f0bbcd9c0d37dcc1b35924b3ff65f378329c3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAdminInfo, "00839ec1f172a57cc1e166163dfca9d95eaac1f0f9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAccessToken, "0035dafe985929bfb36fe3bc053d20331bb68c2e90", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getValidAccessToken, "0025ad682e654f82c1f87ebe1bfb0225c765a17ed5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(isAuthenticated, "0018570bb1c6202f704d29999ee9a88c299adb7299", null);
}),
"[project]/lib/api.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_ENDPOINTS",
    ()=>API_ENDPOINTS,
    "default",
    ()=>__TURBOPACK__default__export__
]);
// API Configuration for Express Backend
const rawUrl = ("TURBOPACK compile-time value", "http://localhost:5001/api") || 'http://localhost:5002/api';
const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;
const API_ENDPOINTS = {
    banner: `${API_BASE_URL}/banner`,
    payment: `${API_BASE_URL}/payment`,
    contact: `${API_BASE_URL}/contact`,
    volunteer: `${API_BASE_URL}/volunteer`,
    stats: `${API_BASE_URL}/stats`,
    service: `${API_BASE_URL}/service`,
    aboutImage: `${API_BASE_URL}/about-image`,
    health: `${API_BASE_URL}/health`
};
const __TURBOPACK__default__export__ = API_BASE_URL;
}),
"[project]/app/actions/banner.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"007e1a91f7b519ca5d6c4ccb761bad78b049c79943":"seedBenevityBanners","40bc71cafafafb778a8195b4a209fe9981e6598386":"createBanner","40e1d749144717662e01422de68e2f9bcda4d31af5":"getBanners","40f1ffa789435057ef7d37ce9d1642f7ecff57356f":"deleteBanner","60b795d2782807eceb89b0be8b86899b5db28c3610":"updateBanner"},"",""] */ __turbopack_context__.s([
    "createBanner",
    ()=>createBanner,
    "deleteBanner",
    ()=>deleteBanner,
    "getBanners",
    ()=>getBanners,
    "seedBenevityBanners",
    ()=>seedBenevityBanners,
    "updateBanner",
    ()=>updateBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function getBanners(location) {
    try {
        const url = new URL(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/banner`);
        if (location) {
            url.searchParams.append('location', location);
        }
        const response = await fetch(url.toString(), {
            cache: 'no-store'
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch banners: ${response.status}`);
        }
        const data = await response.json();
        return data.banners || [];
    } catch (error) {
        console.error("Failed to fetch banners", error);
        return [];
    }
}
async function createBanner(data) {
    try {
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/banner`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`Failed to create banner: ${response.status}`);
        }
        const result = await response.json();
        return result.banner;
    } catch (error) {
        console.error("Failed to create banner", error);
        throw error;
    }
}
async function updateBanner(id, data) {
    try {
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/banner/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`Failed to update banner: ${response.status}`);
        }
        const result = await response.json();
        return result.banner;
    } catch (error) {
        console.error("Failed to update banner", error);
        throw error;
    }
}
async function deleteBanner(id) {
    try {
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/banner/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Failed to delete banner: ${response.status}`);
        }
        return {
            success: true
        };
    } catch (error) {
        console.error("Failed to delete banner", error);
        throw error;
    }
}
async function seedBenevityBanners() {
    try {
        // Use API_BASE_URL directly, it already handles the backend location
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/benevity/banners/seed`, {
            method: 'POST',
            cache: 'no-store'
        });
        if (!response.ok) {
            const text = await response.text();
            console.error('Seed Error Response:', response.status, text, response.headers);
            return {
                success: false,
                error: `Backend returned ${response.status}: ${text}`
            };
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error seeding banners:', error);
        return {
            success: false,
            error: 'Failed to connect to backend'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    seedBenevityBanners
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getBanners, "40e1d749144717662e01422de68e2f9bcda4d31af5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createBanner, "40bc71cafafafb778a8195b4a209fe9981e6598386", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateBanner, "60b795d2782807eceb89b0be8b86899b5db28c3610", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteBanner, "40f1ffa789435057ef7d37ce9d1642f7ecff57356f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(seedBenevityBanners, "007e1a91f7b519ca5d6c4ccb761bad78b049c79943", null);
}),
"[project]/.next-internal/server/app/(admin-panel)/admin/banners/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/(admin-panel)/admin/login/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/app/actions/banner.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$2d$panel$292f$admin$2f$login$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(admin-panel)/admin/login/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/banner.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/(admin-panel)/admin/banners/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/(admin-panel)/admin/login/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/app/actions/banner.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "0009164cbee036f745a9b1500bcc47c279ae4b75db",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$2d$panel$292f$admin$2f$login$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logout"],
    "007e1a91f7b519ca5d6c4ccb761bad78b049c79943",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["seedBenevityBanners"],
    "40bc71cafafafb778a8195b4a209fe9981e6598386",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createBanner"],
    "40e1d749144717662e01422de68e2f9bcda4d31af5",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getBanners"],
    "40f1ffa789435057ef7d37ce9d1642f7ecff57356f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteBanner"],
    "60b795d2782807eceb89b0be8b86899b5db28c3610",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateBanner"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$admin$2d$panel$292f$admin$2f$banners$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f28$admin$2d$panel$292f$admin$2f$login$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(admin-panel)/admin/banners/page/actions.js { ACTIONS_MODULE0 => "[project]/app/(admin-panel)/admin/login/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/app/actions/banner.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$2d$panel$292f$admin$2f$login$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(admin-panel)/admin/login/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/banner.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_dddf0de0._.js.map