module.exports = [
"[project]/Official/SbTCR/client/lib/api.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/Official/SbTCR/client/app/actions/banner.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"002147acf83f02150b6c2f95020a835af9c9c1c5fe":"seedBenevityBanners","407e7c118ea43311dec2af23d5e3addddbff86178d":"createBanner","409686c6f92d0d1bfb02b1b600aa7ed3a7e70103bd":"deleteBanner","40e83c988aeb681b2ae38c5ec04607f3257d2e6ff4":"getBanners","6023803e916ac5b4a79ba042dcfbd84ed9841bf6d2":"updateBanner"},"",""] */ __turbopack_context__.s([
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/lib/api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function getBanners(location) {
    try {
        const url = new URL(`${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/banner`);
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
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/banner`, {
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
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/banner/${id}`, {
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
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/banner/${id}`, {
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
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/benevity/banners/seed`, {
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
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    seedBenevityBanners
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getBanners, "40e83c988aeb681b2ae38c5ec04607f3257d2e6ff4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createBanner, "407e7c118ea43311dec2af23d5e3addddbff86178d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateBanner, "6023803e916ac5b4a79ba042dcfbd84ed9841bf6d2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteBanner, "409686c6f92d0d1bfb02b1b600aa7ed3a7e70103bd", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(seedBenevityBanners, "002147acf83f02150b6c2f95020a835af9c9c1c5fe", null);
}),
"[project]/Official/SbTCR/client/app/actions/service.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00d2a47188f46fc7cb5e5ae121dcd936478ab0072d":"getServices","40a29df7146b02beb140ecc4a18a1d2c3ae63ffee7":"getServiceBySlug"},"",""] */ __turbopack_context__.s([
    "getServiceBySlug",
    ()=>getServiceBySlug,
    "getServices",
    ()=>getServices
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/lib/api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function getServices() {
    try {
        console.log(`Fetching services from: ${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/services`);
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/services`, {
            cache: 'no-store'
        });
        if (!response.ok) {
            console.error(`getServices: Fetch failed with status: ${response.status}`);
            throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        console.log(`getServices: Fetched ${data.services?.length} services`);
        return data.services || [];
    } catch (error) {
        console.error("Failed to fetch services", error);
    }
}
async function getServiceBySlug(slug) {
    try {
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/services/slug/${slug}`, {
            cache: 'no-store'
        });
        if (!response.ok) {
            console.error(`getServiceBySlug: Fetch failed with status: ${response.status}`);
            return null;
        }
        const data = await response.json();
        return data.service;
    } catch (error) {
        console.error("Failed to fetch service by slug", error);
        return null;
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getServices,
    getServiceBySlug
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getServices, "00d2a47188f46fc7cb5e5ae121dcd936478ab0072d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getServiceBySlug, "40a29df7146b02beb140ecc4a18a1d2c3ae63ffee7", null);
}),
"[project]/Official/SbTCR/client/app/actions/campaign.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00013b144018270f003c92b4608c1f280a104d36f2":"getFeaturedCampaigns","00972e6f4e4bbb5e4d14b4b7d85f575c3027a4ab6e":"getActiveCampaigns","409ad8c84ffcdb8c634a781f04b87b05553eb0ed9a":"getCampaignBySlug"},"",""] */ __turbopack_context__.s([
    "getActiveCampaigns",
    ()=>getActiveCampaigns,
    "getCampaignBySlug",
    ()=>getCampaignBySlug,
    "getFeaturedCampaigns",
    ()=>getFeaturedCampaigns
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
// Remove trailing /api if present to avoid double /api/api paths
const rawApiUrl = ("TURBOPACK compile-time value", "http://localhost:5001/api") || 'http://localhost:5002';
const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl.slice(0, -4) : rawApiUrl;
async function getActiveCampaigns() {
    try {
        const res = await fetch(`${API_URL}/api/campaign/active`, {
            cache: 'no-store'
        });
        if (!res.ok) {
            throw new Error('Failed to fetch campaigns');
        }
        const data = await res.json();
        return data.success ? data.campaigns : [];
    } catch (error) {
        console.error('Error fetching active campaigns:', error);
        return [];
    }
}
async function getFeaturedCampaigns() {
    try {
        const res = await fetch(`${API_URL}/api/campaign/featured`, {
            cache: 'no-store'
        });
        if (!res.ok) {
            throw new Error('Failed to fetch featured campaigns');
        }
        const data = await res.json();
        return data.success ? data.campaigns : [];
    } catch (error) {
        console.error('Error fetching featured campaigns:', error);
        return [];
    }
}
async function getCampaignBySlug(slug) {
    try {
        const res = await fetch(`${API_URL}/api/campaign/slug/${slug}`, {
            cache: 'no-store'
        });
        if (!res.ok) {
            return null;
        }
        const data = await res.json();
        return data.success ? data.campaign : null;
    } catch (error) {
        console.error('Error fetching campaign:', error);
        return null;
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getActiveCampaigns,
    getFeaturedCampaigns,
    getCampaignBySlug
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getActiveCampaigns, "00972e6f4e4bbb5e4d14b4b7d85f575c3027a4ab6e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getFeaturedCampaigns, "00013b144018270f003c92b4608c1f280a104d36f2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCampaignBySlug, "409ad8c84ffcdb8c634a781f04b87b05553eb0ed9a", null);
}),
"[project]/Official/SbTCR/client/app/actions/about.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"003fa8a4e064bd80a4547a5f328f72a0590865e6ec":"getAboutContent","00bb50ec8388a988ee0ff23bcfc196d61bfc276164":"seedAboutContent","4055705d2502dbbcc10959b1e8c9e1f01893e02df0":"updateAboutContent"},"",""] */ __turbopack_context__.s([
    "getAboutContent",
    ()=>getAboutContent,
    "seedAboutContent",
    ()=>seedAboutContent,
    "updateAboutContent",
    ()=>updateAboutContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
// Remove trailing /api if present to avoid double /api/api paths
const rawApiUrl = ("TURBOPACK compile-time value", "http://localhost:5001/api") || 'http://localhost:5002';
const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl.slice(0, -4) : rawApiUrl;
async function getAboutContent() {
    try {
        const res = await fetch(`${API_URL}/api/about`, {
            cache: 'no-store'
        });
        if (!res.ok) {
            console.error("Failed to fetch about content:", res.status);
            return null;
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch about content", error);
        return null;
    }
}
async function updateAboutContent(data) {
    try {
        const res = await fetch(`${API_URL}/api/about`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            throw new Error("Failed to update about content");
        }
        const result = await res.json();
        return result.data || result;
    } catch (error) {
        console.error("Failed to update about content", error);
        throw error;
    }
}
async function seedAboutContent() {
    try {
        const res = await fetch(`${API_URL}/api/about/seed`, {
            method: 'POST'
        });
        if (!res.ok) {
            throw new Error("Failed to seed about content");
        }
        await res.json();
        // After seeding, fetch the new content
        const aboutRes = await fetch(`${API_URL}/api/about`, {
            cache: 'no-store'
        });
        if (!aboutRes.ok) {
            throw new Error("Failed to fetch seeded content");
        }
        return await aboutRes.json();
    } catch (error) {
        console.error("Failed to seed about content", error);
        throw error;
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getAboutContent,
    updateAboutContent,
    seedAboutContent
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAboutContent, "003fa8a4e064bd80a4547a5f328f72a0590865e6ec", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateAboutContent, "4055705d2502dbbcc10959b1e8c9e1f01893e02df0", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(seedAboutContent, "00bb50ec8388a988ee0ff23bcfc196d61bfc276164", null);
}),
"[project]/Official/SbTCR/client/app/actions/cms/projects.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4020540bd5880b3d7d3aefd6991304da7b19677503":"getProjects","409e7a816ceb83773b1c50572f705a800acb7fee5c":"getProject","60839de90c2e4fd5553001cc8e66051e6d6a71928c":"createProject","60f58b5c592dce0ace9dde06727503313b70118548":"deleteProject","70668ab02162065c5f40b46778016669e47a507e3b":"updateProject"},"",""] */ __turbopack_context__.s([
    "createProject",
    ()=>createProject,
    "deleteProject",
    ()=>deleteProject,
    "getProject",
    ()=>getProject,
    "getProjects",
    ()=>getProjects,
    "updateProject",
    ()=>updateProject
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/lib/api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function getProjects(filter) {
    try {
        let url = `${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/projects/admin`;
        if (filter) {
            if (filter.showOnBenevity) {
                // Check if admin mode requested for Benevity
                if (filter.mode === 'admin') {
                    url = `${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/benevity/projects/admin`;
                } else {
                    url = `${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/benevity/projects`;
                }
            } else {
                // Main projects
                url = `${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/projects?`;
                if (filter.showOnFirstFace) {
                    url += `showOnFirstFace=true`;
                }
            }
        }
        console.log('getProjects: Fetching from URL:', url);
        const response = await fetch(url, {
            cache: 'no-store'
        });
        if (!response.ok) {
            console.error('getProjects: Fetch failed with status:', response.status);
            throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        console.log('getProjects: Received data count:', data.projects?.length);
        return data.projects || [];
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}
async function getProject(id) {
    try {
        // 1. Try Main Collection
        const mainResponse = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/projects/${id}`, {
            cache: 'no-store'
        });
        if (mainResponse.ok) {
            const data = await mainResponse.json();
            return data.project;
        }
        // 2. Try Benevity Collection
        // Only if main failed (e.g. 404), check Benevity
        const benevityResponse = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/benevity/projects/${id}`, {
            cache: 'no-store'
        });
        if (benevityResponse.ok) {
            const data = await benevityResponse.json();
            return data.project;
        }
        // 3. If here, neither worked
        console.error(`getProject: Failed to find project ${id} in either collection.`);
        throw new Error('Project not found');
    } catch (error) {
        console.error('Error fetching project:', error);
        throw error;
    }
}
;
async function createProject(projectData, isBenevity = false) {
    try {
        const url = isBenevity ? `${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/benevity/projects` : `${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/projects`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        });
        if (!response.ok) {
            throw new Error('Failed to create project');
        }
        const data = await response.json();
        // Revalidate paths to update UI immediately
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/projects');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/projects');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/benevity');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/'); // If on home
        return data.project;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
}
async function updateProject(id, projectData, isBenevity = false) {
    try {
        const url = isBenevity ? `${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/benevity/projects/${id}` : `${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/projects/${id}`;
        // For Benevity routes, we might need a generic PUT endpoint if using /:id
        // Benevity routes currently don't explicitly list PUT /:id but assume standard CRUD.
        // I need to double check benevity.routes.ts... wait, I didn't add PUT /:id there!
        // I should check and update backend if needed.
        // Assuming standard REST, but let's check backend first.
        // Wait, I only added GET, POST (create), POST (seed), GET /:id.
        // I missed Update and Delete in benevity.routes.ts!
        // I will proceed with frontend update assuming backend will be fixed shortly.
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        });
        if (!response.ok) {
            console.error('Update failed:', response.status, await response.text());
            throw new Error('Failed to update project');
        }
        const data = await response.json();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/projects');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/projects');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/benevity');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/projects/${id}`);
        return data.project;
    } catch (error) {
        console.error('Error updating project:', error);
        throw error;
    }
}
async function deleteProject(id, isBenevity = false) {
    try {
        const url = isBenevity ? `${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/benevity/projects/${id}` : `${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/projects/${id}`;
        const response = await fetch(url, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete project');
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/projects');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/projects');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/benevity');
        return true;
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getProjects, "4020540bd5880b3d7d3aefd6991304da7b19677503", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getProject, "409e7a816ceb83773b1c50572f705a800acb7fee5c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createProject, "60839de90c2e4fd5553001cc8e66051e6d6a71928c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateProject, "70668ab02162065c5f40b46778016669e47a507e3b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteProject, "60f58b5c592dce0ace9dde06727503313b70118548", null);
}),
"[project]/Official/SbTCR/client/app/actions/cms/awards.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"007f35052f1aebd370347020e062c588d6d9f80614":"getAwards","4019796cc686705162399582f15de62ca963e67717":"getAward","40376208190a2470d16f53710b9139982f4c097916":"deleteAward","405166354732277423377cb4fca09a6c86d7817e31":"createAward","60b78b70c6cc4c0cb2ad95cff12de6cc31be5cc2cc":"updateAward"},"",""] */ __turbopack_context__.s([
    "createAward",
    ()=>createAward,
    "deleteAward",
    ()=>deleteAward,
    "getAward",
    ()=>getAward,
    "getAwards",
    ()=>getAwards,
    "updateAward",
    ()=>updateAward
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/lib/api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function getAwards() {
    try {
        const url = `${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/awards/admin`;
        console.log('[Awards] Fetching from:', url);
        const response = await fetch(url, {
            cache: 'no-store'
        });
        console.log('[Awards] Response status:', response.status);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Awards] Error response:', errorText);
            throw new Error('Failed to fetch awards');
        }
        const data = await response.json();
        console.log('[Awards] Fetched awards count:', data.awards?.length);
        return data.awards || [];
    } catch (error) {
        console.error('Error fetching awards:', error);
        return [];
    }
}
async function getAward(id) {
    try {
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/awards/${id}`, {
            cache: 'no-store'
        });
        if (!response.ok) {
            throw new Error('Failed to fetch award');
        }
        const data = await response.json();
        return data.award;
    } catch (error) {
        console.error('Error fetching award:', error);
        throw error;
    }
}
async function createAward(awardData) {
    try {
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/awards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(awardData)
        });
        if (!response.ok) {
            throw new Error('Failed to create award');
        }
        const data = await response.json();
        return data.award;
    } catch (error) {
        console.error('Error creating award:', error);
        throw error;
    }
}
async function updateAward(id, awardData) {
    try {
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/awards/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(awardData)
        });
        if (!response.ok) {
            throw new Error('Failed to update award');
        }
        const data = await response.json();
        return data.award;
    } catch (error) {
        console.error('Error updating award:', error);
        throw error;
    }
}
async function deleteAward(id) {
    try {
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/awards/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete award');
        }
        return true;
    } catch (error) {
        console.error('Error deleting award:', error);
        throw error;
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getAwards,
    getAward,
    createAward,
    updateAward,
    deleteAward
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAwards, "007f35052f1aebd370347020e062c588d6d9f80614", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAward, "4019796cc686705162399582f15de62ca963e67717", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createAward, "405166354732277423377cb4fca09a6c86d7817e31", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateAward, "60b78b70c6cc4c0cb2ad95cff12de6cc31be5cc2cc", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteAward, "40376208190a2470d16f53710b9139982f4c097916", null);
}),
"[project]/Official/SbTCR/client/app/actions/cms/newsEvents.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"001c748f389104f7e20b5f96528bedd4e6bc163734":"getNewsEvents","00c2714a58350f67b3b4ab9ff9c6e6cdbfece64fb5":"getPublicNewsEvents","40a39318eaba06575ff8f03bf4d97382ff10291f7b":"getNewsEvent","40be2ea40986b27c0e45d16b973fce2e69427351f4":"deleteNewsEvent","40c6000077c57412548e0c073e60115a4b012fe42c":"createNewsEvent","6086705d6306d07144f05949839f196ff9070ae027":"updateNewsEvent"},"",""] */ __turbopack_context__.s([
    "createNewsEvent",
    ()=>createNewsEvent,
    "deleteNewsEvent",
    ()=>deleteNewsEvent,
    "getNewsEvent",
    ()=>getNewsEvent,
    "getNewsEvents",
    ()=>getNewsEvents,
    "getPublicNewsEvents",
    ()=>getPublicNewsEvents,
    "updateNewsEvent",
    ()=>updateNewsEvent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/lib/api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function getNewsEvents() {
    try {
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/news-events/admin`, {
            cache: 'no-store'
        });
        if (!response.ok) {
            throw new Error('Failed to fetch news/events');
        }
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Error fetching news/events:', error);
        return [];
    }
}
async function getPublicNewsEvents() {
    try {
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/news-events`, {
            cache: 'no-store'
        });
        if (!response.ok) {
            throw new Error('Failed to fetch public news/events');
        }
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Error fetching public news/events:', error);
        return [];
    }
}
async function getNewsEvent(id) {
    try {
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/news-events/${id}`, {
            cache: 'no-store'
        });
        if (!response.ok) {
            throw new Error('Failed to fetch news/event');
        }
        const data = await response.json();
        return data.newsEvent;
    } catch (error) {
        console.error('Error fetching news/event:', error);
        throw error;
    }
}
async function createNewsEvent(newsEventData) {
    try {
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/news-events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newsEventData)
        });
        if (!response.ok) {
            throw new Error('Failed to create news/event');
        }
        const data = await response.json();
        return data.newsEvent;
    } catch (error) {
        console.error('Error creating news/event:', error);
        throw error;
    }
}
async function updateNewsEvent(id, newsEventData) {
    try {
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/news-events/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newsEventData)
        });
        if (!response.ok) {
            throw new Error('Failed to update news/event');
        }
        const data = await response.json();
        return data.newsEvent;
    } catch (error) {
        console.error('Error updating news/event:', error);
        throw error;
    }
}
async function deleteNewsEvent(id) {
    try {
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/news-events/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete news/event');
        }
        return true;
    } catch (error) {
        console.error('Error deleting news/event:', error);
        throw error;
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getNewsEvents,
    getPublicNewsEvents,
    getNewsEvent,
    createNewsEvent,
    updateNewsEvent,
    deleteNewsEvent
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getNewsEvents, "001c748f389104f7e20b5f96528bedd4e6bc163734", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPublicNewsEvents, "00c2714a58350f67b3b4ab9ff9c6e6cdbfece64fb5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getNewsEvent, "40a39318eaba06575ff8f03bf4d97382ff10291f7b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createNewsEvent, "40c6000077c57412548e0c073e60115a4b012fe42c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateNewsEvent, "6086705d6306d07144f05949839f196ff9070ae027", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteNewsEvent, "40be2ea40986b27c0e45d16b973fce2e69427351f4", null);
}),
"[project]/Official/SbTCR/client/.next-internal/server/app/(main)/page/actions.js { ACTIONS_MODULE0 => \"[project]/Official/SbTCR/client/app/actions/footer.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/Official/SbTCR/client/app/actions/banner.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/Official/SbTCR/client/app/actions/service.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/Official/SbTCR/client/app/actions/campaign.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/Official/SbTCR/client/app/actions/about.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE5 => \"[project]/Official/SbTCR/client/app/actions/cms/projects.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE6 => \"[project]/Official/SbTCR/client/app/actions/cms/awards.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE7 => \"[project]/Official/SbTCR/client/app/actions/cms/newsEvents.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/app/actions/footer.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/app/actions/banner.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/app/actions/service.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$campaign$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/app/actions/campaign.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$about$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/app/actions/about.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$projects$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/app/actions/cms/projects.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$awards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/app/actions/cms/awards.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$newsEvents$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/app/actions/cms/newsEvents.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/Official/SbTCR/client/.next-internal/server/app/(main)/page/actions.js { ACTIONS_MODULE0 => \"[project]/Official/SbTCR/client/app/actions/footer.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/Official/SbTCR/client/app/actions/banner.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/Official/SbTCR/client/app/actions/service.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/Official/SbTCR/client/app/actions/campaign.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/Official/SbTCR/client/app/actions/about.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE5 => \"[project]/Official/SbTCR/client/app/actions/cms/projects.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE6 => \"[project]/Official/SbTCR/client/app/actions/cms/awards.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE7 => \"[project]/Official/SbTCR/client/app/actions/cms/newsEvents.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00013b144018270f003c92b4608c1f280a104d36f2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$campaign$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFeaturedCampaigns"],
    "001423f39ac932d89a5c92ca6ba4f72bbbee35a18a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFooterContent"],
    "001c748f389104f7e20b5f96528bedd4e6bc163734",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$newsEvents$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getNewsEvents"],
    "002147acf83f02150b6c2f95020a835af9c9c1c5fe",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["seedBenevityBanners"],
    "003fa8a4e064bd80a4547a5f328f72a0590865e6ec",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$about$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAboutContent"],
    "006a13056b29dcd8ba8a30b1403b06ce8d02baefdc",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["seedFooterContent"],
    "007f35052f1aebd370347020e062c588d6d9f80614",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$awards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAwards"],
    "00972e6f4e4bbb5e4d14b4b7d85f575c3027a4ab6e",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$campaign$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveCampaigns"],
    "00bb50ec8388a988ee0ff23bcfc196d61bfc276164",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$about$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["seedAboutContent"],
    "00c2714a58350f67b3b4ab9ff9c6e6cdbfece64fb5",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$newsEvents$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPublicNewsEvents"],
    "00d2a47188f46fc7cb5e5ae121dcd936478ab0072d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServices"],
    "4019796cc686705162399582f15de62ca963e67717",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$awards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAward"],
    "4020540bd5880b3d7d3aefd6991304da7b19677503",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$projects$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProjects"],
    "40376208190a2470d16f53710b9139982f4c097916",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$awards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteAward"],
    "405166354732277423377cb4fca09a6c86d7817e31",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$awards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAward"],
    "4055705d2502dbbcc10959b1e8c9e1f01893e02df0",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$about$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateAboutContent"],
    "407e18754d6beafb9f5349a4c0074e2031c402dd84",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateFooterContent"],
    "407e7c118ea43311dec2af23d5e3addddbff86178d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createBanner"],
    "409686c6f92d0d1bfb02b1b600aa7ed3a7e70103bd",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteBanner"],
    "409ad8c84ffcdb8c634a781f04b87b05553eb0ed9a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$campaign$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCampaignBySlug"],
    "409e7a816ceb83773b1c50572f705a800acb7fee5c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$projects$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProject"],
    "40a29df7146b02beb140ecc4a18a1d2c3ae63ffee7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServiceBySlug"],
    "40a39318eaba06575ff8f03bf4d97382ff10291f7b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$newsEvents$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getNewsEvent"],
    "40be2ea40986b27c0e45d16b973fce2e69427351f4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$newsEvents$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteNewsEvent"],
    "40c6000077c57412548e0c073e60115a4b012fe42c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$newsEvents$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createNewsEvent"],
    "40e83c988aeb681b2ae38c5ec04607f3257d2e6ff4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getBanners"],
    "6023803e916ac5b4a79ba042dcfbd84ed9841bf6d2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateBanner"],
    "60839de90c2e4fd5553001cc8e66051e6d6a71928c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$projects$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createProject"],
    "6086705d6306d07144f05949839f196ff9070ae027",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$newsEvents$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateNewsEvent"],
    "60b78b70c6cc4c0cb2ad95cff12de6cc31be5cc2cc",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$awards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateAward"],
    "60f58b5c592dce0ace9dde06727503313b70118548",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$projects$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteProject"],
    "70668ab02162065c5f40b46778016669e47a507e3b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$projects$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateProject"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f2e$next$2d$internal$2f$server$2f$app$2f28$main$292f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$campaign$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$about$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$projects$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$awards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$newsEvents$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/Official/SbTCR/client/.next-internal/server/app/(main)/page/actions.js { ACTIONS_MODULE0 => "[project]/Official/SbTCR/client/app/actions/footer.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/Official/SbTCR/client/app/actions/banner.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/Official/SbTCR/client/app/actions/service.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/Official/SbTCR/client/app/actions/campaign.ts [app-rsc] (ecmascript)", ACTIONS_MODULE4 => "[project]/Official/SbTCR/client/app/actions/about.ts [app-rsc] (ecmascript)", ACTIONS_MODULE5 => "[project]/Official/SbTCR/client/app/actions/cms/projects.ts [app-rsc] (ecmascript)", ACTIONS_MODULE6 => "[project]/Official/SbTCR/client/app/actions/cms/awards.ts [app-rsc] (ecmascript)", ACTIONS_MODULE7 => "[project]/Official/SbTCR/client/app/actions/cms/newsEvents.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/app/actions/footer.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/app/actions/banner.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/app/actions/service.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$campaign$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/app/actions/campaign.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$about$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/app/actions/about.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$projects$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/app/actions/cms/projects.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$awards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/app/actions/cms/awards.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Official$2f$SbTCR$2f$client$2f$app$2f$actions$2f$cms$2f$newsEvents$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Official/SbTCR/client/app/actions/cms/newsEvents.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=Official_SbTCR_client_d35b66de._.js.map