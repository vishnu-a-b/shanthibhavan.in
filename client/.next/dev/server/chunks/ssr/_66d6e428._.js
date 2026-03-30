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
"[project]/app/actions/cms/services.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00a05cc030add4ec0ac42c658a9fa963203ac821a4":"getServices","402ba7b0e2d337a811505c5fa93c790559d66b792e":"deleteService","407117bcb3734c32a598a02ff8a1790ca6ae6d48a9":"getService","40bb492b1d9c3a413efa17c442b1ac6a9d0d1f23a3":"createService","609c149344625081037002289206e58362596eeba8":"updateService"},"",""] */ __turbopack_context__.s([
    "createService",
    ()=>createService,
    "deleteService",
    ()=>deleteService,
    "getService",
    ()=>getService,
    "getServices",
    ()=>getServices,
    "updateService",
    ()=>updateService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function getServices() {
    try {
        const url = `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/services/admin`;
        console.log(`[CMS] Fetching services from: ${url}`);
        const response = await fetch(url, {
            cache: 'no-store'
        });
        if (!response.ok) {
            console.error(`[CMS] Failed to fetch services: ${response.status} ${response.statusText}`);
            throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        console.log(`[CMS] Fetched ${data.services?.length} services`);
        return data.services || [];
    } catch (error) {
        console.error('[CMS] Error fetching services:', error);
        return [];
    }
}
async function getService(id) {
    try {
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/services/${id}`, {
            cache: 'no-store'
        });
        if (!response.ok) {
            throw new Error('Failed to fetch service');
        }
        const data = await response.json();
        return data.service;
    } catch (error) {
        console.error('Error fetching service:', error);
        throw error;
    }
}
async function createService(serviceData) {
    try {
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/services`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serviceData)
        });
        if (!response.ok) {
            throw new Error('Failed to create service');
        }
        const data = await response.json();
        return data.service;
    } catch (error) {
        console.error('Error creating service:', error);
        throw error;
    }
}
async function updateService(id, serviceData) {
    try {
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/services/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serviceData)
        });
        if (!response.ok) {
            throw new Error('Failed to update service');
        }
        const data = await response.json();
        return data.service;
    } catch (error) {
        console.error('Error updating service:', error);
        throw error;
    }
}
async function deleteService(id) {
    try {
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/services/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete service');
        }
        return true;
    } catch (error) {
        console.error('Error deleting service:', error);
        throw error;
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getServices,
    getService,
    createService,
    updateService,
    deleteService
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getServices, "00a05cc030add4ec0ac42c658a9fa963203ac821a4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getService, "407117bcb3734c32a598a02ff8a1790ca6ae6d48a9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createService, "40bb492b1d9c3a413efa17c442b1ac6a9d0d1f23a3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateService, "609c149344625081037002289206e58362596eeba8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteService, "402ba7b0e2d337a811505c5fa93c790559d66b792e", null);
}),
"[project]/app/actions/servicesPage.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"003deacf058f65e36070731a08cd40d535b1ea267b":"seedServicesPageContent","00541f274a22786a1b78d247dc1265b31e7ebfecd6":"getServicesPageContent","409aae20ca2958e47ceb20c3ceef1beb05a1d3dc55":"updateServicesPageContent"},"",""] */ __turbopack_context__.s([
    "getServicesPageContent",
    ()=>getServicesPageContent,
    "seedServicesPageContent",
    ()=>seedServicesPageContent,
    "updateServicesPageContent",
    ()=>updateServicesPageContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
// Remove trailing /api if present to avoid double /api/api paths
const rawApiUrl = ("TURBOPACK compile-time value", "http://localhost:5001/api") || 'http://localhost:5002';
const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl.slice(0, -4) : rawApiUrl;
async function getServicesPageContent() {
    try {
        const res = await fetch(`${API_URL}/api/services-page`, {
            cache: 'no-store'
        });
        if (!res.ok) {
            return null;
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch services page content", error);
        return null;
    }
}
async function updateServicesPageContent(data) {
    try {
        const res = await fetch(`${API_URL}/api/services-page`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            throw new Error('Failed to update services page content');
        }
        const result = await res.json();
        return result.data || result;
    } catch (error) {
        console.error("Failed to update services page content", error);
        throw error;
    }
}
async function seedServicesPageContent() {
    try {
        const res = await fetch(`${API_URL}/api/services-page/seed`, {
            method: 'POST'
        });
        if (!res.ok) {
            throw new Error('Failed to seed services page content');
        }
        return await res.json();
    } catch (error) {
        console.error("Failed to seed services page content", error);
        throw error;
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getServicesPageContent,
    updateServicesPageContent,
    seedServicesPageContent
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getServicesPageContent, "00541f274a22786a1b78d247dc1265b31e7ebfecd6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateServicesPageContent, "409aae20ca2958e47ceb20c3ceef1beb05a1d3dc55", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(seedServicesPageContent, "003deacf058f65e36070731a08cd40d535b1ea267b", null);
}),
"[project]/.next-internal/server/app/(admin-panel)/admin/services/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/(admin-panel)/admin/login/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/app/actions/cms/services.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/app/actions/servicesPage.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$2d$panel$292f$admin$2f$login$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(admin-panel)/admin/login/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$services$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/cms/services.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$servicesPage$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/servicesPage.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/(admin-panel)/admin/services/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/(admin-panel)/admin/login/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/app/actions/cms/services.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/app/actions/servicesPage.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "0009164cbee036f745a9b1500bcc47c279ae4b75db",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$2d$panel$292f$admin$2f$login$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logout"],
    "00541f274a22786a1b78d247dc1265b31e7ebfecd6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$servicesPage$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServicesPageContent"],
    "00a05cc030add4ec0ac42c658a9fa963203ac821a4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$services$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServices"],
    "402ba7b0e2d337a811505c5fa93c790559d66b792e",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$services$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteService"],
    "409aae20ca2958e47ceb20c3ceef1beb05a1d3dc55",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$servicesPage$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateServicesPageContent"],
    "40bb492b1d9c3a413efa17c442b1ac6a9d0d1f23a3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$services$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createService"],
    "609c149344625081037002289206e58362596eeba8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$services$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateService"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$admin$2d$panel$292f$admin$2f$services$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f28$admin$2d$panel$292f$admin$2f$login$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$cms$2f$services$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$servicesPage$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(admin-panel)/admin/services/page/actions.js { ACTIONS_MODULE0 => "[project]/app/(admin-panel)/admin/login/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/app/actions/cms/services.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/app/actions/servicesPage.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$admin$2d$panel$292f$admin$2f$login$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(admin-panel)/admin/login/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$services$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/cms/services.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$servicesPage$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/servicesPage.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_66d6e428._.js.map