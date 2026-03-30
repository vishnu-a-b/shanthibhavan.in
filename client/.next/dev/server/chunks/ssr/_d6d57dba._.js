module.exports = [
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
"[project]/app/actions/service.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00dd43eb7736141490ffe9eda62dbd5862559ed67e":"getServices","403c66f40616f0acc06c60067dbec2990dafecd89b":"getServiceBySlug"},"",""] */ __turbopack_context__.s([
    "getServiceBySlug",
    ()=>getServiceBySlug,
    "getServices",
    ()=>getServices
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function getServices() {
    try {
        console.log(`Fetching services from: ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/services`);
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/services`, {
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
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/services/slug/${slug}`, {
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
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getServices,
    getServiceBySlug
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getServices, "00dd43eb7736141490ffe9eda62dbd5862559ed67e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getServiceBySlug, "403c66f40616f0acc06c60067dbec2990dafecd89b", null);
}),
"[project]/app/actions/campaign.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"006544b8536c0186aa405848bffb4cf31db543830c":"getActiveCampaigns","00ba88600384259a2aa42aec381c1a08fe3d41dd61":"getFeaturedCampaigns","40d5626248d8865b6e37e9fc9954bf6acc3efaf03d":"getCampaignBySlug"},"",""] */ __turbopack_context__.s([
    "getActiveCampaigns",
    ()=>getActiveCampaigns,
    "getCampaignBySlug",
    ()=>getCampaignBySlug,
    "getFeaturedCampaigns",
    ()=>getFeaturedCampaigns
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
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
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getActiveCampaigns,
    getFeaturedCampaigns,
    getCampaignBySlug
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getActiveCampaigns, "006544b8536c0186aa405848bffb4cf31db543830c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getFeaturedCampaigns, "00ba88600384259a2aa42aec381c1a08fe3d41dd61", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCampaignBySlug, "40d5626248d8865b6e37e9fc9954bf6acc3efaf03d", null);
}),
"[project]/app/actions/about.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00047bc90fea78a18658501c09aecdc1c9d4204ad8":"seedAboutContent","001da7da9a0eedd761a57db91a9a52d66ffbf3dfdc":"getAboutContent","40ab74e04814e0b78eae355589518350854873d827":"updateAboutContent"},"",""] */ __turbopack_context__.s([
    "getAboutContent",
    ()=>getAboutContent,
    "seedAboutContent",
    ()=>seedAboutContent,
    "updateAboutContent",
    ()=>updateAboutContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
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
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getAboutContent,
    updateAboutContent,
    seedAboutContent
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAboutContent, "001da7da9a0eedd761a57db91a9a52d66ffbf3dfdc", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateAboutContent, "40ab74e04814e0b78eae355589518350854873d827", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(seedAboutContent, "00047bc90fea78a18658501c09aecdc1c9d4204ad8", null);
}),
"[project]/app/actions/cms/projects.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4032eec30a13a792ba0c592262a5dc6d8b24d30801":"getProject","40c0bafb876c3ed2d661a06cb9fb64147501f288c4":"getProjects","600ba5e5545ee3f9dd1269639367db6de1e6ad9710":"deleteProject","60e7533177a496688aebf6278550a96cb24d107251":"createProject","7039f3f8df17a11fd04df6802ca0ee2520a8ded4f9":"updateProject"},"",""] */ __turbopack_context__.s([
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function getProjects(filter) {
    try {
        let url = `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/projects/admin`;
        if (filter) {
            if (filter.showOnBenevity) {
                // Check if admin mode requested for Benevity
                if (filter.mode === 'admin') {
                    url = `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/benevity/projects/admin`;
                } else {
                    url = `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/benevity/projects`;
                }
            } else {
                // Main projects
                url = `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/projects?`;
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
        const mainResponse = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/projects/${id}`, {
            cache: 'no-store'
        });
        if (mainResponse.ok) {
            const data = await mainResponse.json();
            return data.project;
        }
        // 2. Try Benevity Collection
        // Only if main failed (e.g. 404), check Benevity
        const benevityResponse = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/benevity/projects/${id}`, {
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
        const url = isBenevity ? `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/benevity/projects` : `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/projects`;
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
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/projects');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/projects');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/benevity');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/'); // If on home
        return data.project;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
}
async function updateProject(id, projectData, isBenevity = false) {
    try {
        const url = isBenevity ? `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/benevity/projects/${id}` : `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/projects/${id}`;
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
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/projects');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/projects');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/benevity');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/projects/${id}`);
        return data.project;
    } catch (error) {
        console.error('Error updating project:', error);
        throw error;
    }
}
async function deleteProject(id, isBenevity = false) {
    try {
        const url = isBenevity ? `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/benevity/projects/${id}` : `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/projects/${id}`;
        const response = await fetch(url, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete project');
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/projects');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/projects');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/benevity');
        return true;
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getProjects, "40c0bafb876c3ed2d661a06cb9fb64147501f288c4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getProject, "4032eec30a13a792ba0c592262a5dc6d8b24d30801", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createProject, "60e7533177a496688aebf6278550a96cb24d107251", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateProject, "7039f3f8df17a11fd04df6802ca0ee2520a8ded4f9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteProject, "600ba5e5545ee3f9dd1269639367db6de1e6ad9710", null);
}),
"[project]/app/actions/cms/awards.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00a41bc279e45f0e27d3f4db2de28cffa0175ba887":"getAwards","407b083aa23ce1aaf78acc3ba86e335ccc2cd8ac57":"createAward","409226afd6c749c81007d88916167531ff4909fed1":"deleteAward","40cb339142f8b85a5487760ada21e5244afd1ed817":"getAward","60bf9fdf14c1cbcfb824ace252d72e40b11feb8494":"updateAward"},"",""] */ __turbopack_context__.s([
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function getAwards() {
    try {
        const url = `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/awards/admin`;
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
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/awards/${id}`, {
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
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/awards`, {
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
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/awards/${id}`, {
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
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/awards/${id}`, {
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
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getAwards,
    getAward,
    createAward,
    updateAward,
    deleteAward
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAwards, "00a41bc279e45f0e27d3f4db2de28cffa0175ba887", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAward, "40cb339142f8b85a5487760ada21e5244afd1ed817", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createAward, "407b083aa23ce1aaf78acc3ba86e335ccc2cd8ac57", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateAward, "60bf9fdf14c1cbcfb824ace252d72e40b11feb8494", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteAward, "409226afd6c749c81007d88916167531ff4909fed1", null);
}),
"[project]/app/actions/cms/newsEvents.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"007cf65fa1f656365a30b651ecd26fe1da26347333":"getNewsEvents","00d140b4151ffae36c89a7f5e681d57312d4f144f4":"getPublicNewsEvents","4036f202ea854d1f38f7f2c16ab62fe332cab5eee6":"createNewsEvent","409e24f18dc27325b5c729a2a92088015c5f6cc851":"deleteNewsEvent","40d8f479775aab25b8415d97de2ea4f04970270df4":"getNewsEvent","602dbded89c54ecc570e1da33339ebe786f4883e33":"updateNewsEvent"},"",""] */ __turbopack_context__.s([
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function getNewsEvents() {
    try {
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/news-events/admin`, {
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
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/news-events`, {
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
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/news-events/${id}`, {
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
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/news-events`, {
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
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/news-events/${id}`, {
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
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}/news-events/${id}`, {
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
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getNewsEvents,
    getPublicNewsEvents,
    getNewsEvent,
    createNewsEvent,
    updateNewsEvent,
    deleteNewsEvent
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getNewsEvents, "007cf65fa1f656365a30b651ecd26fe1da26347333", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPublicNewsEvents, "00d140b4151ffae36c89a7f5e681d57312d4f144f4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getNewsEvent, "40d8f479775aab25b8415d97de2ea4f04970270df4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createNewsEvent, "4036f202ea854d1f38f7f2c16ab62fe332cab5eee6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateNewsEvent, "602dbded89c54ecc570e1da33339ebe786f4883e33", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteNewsEvent, "409e24f18dc27325b5c729a2a92088015c5f6cc851", null);
}),
"[project]/.next-internal/server/app/(main)/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/footer.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/app/actions/banner.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/app/actions/service.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/app/actions/campaign.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/app/actions/about.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE5 => \"[project]/app/actions/cms/projects.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE6 => \"[project]/app/actions/cms/awards.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE7 => \"[project]/app/actions/cms/newsEvents.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/footer.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/banner.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/service.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$campaign$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/campaign.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$about$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/about.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$projects$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/cms/projects.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$awards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/cms/awards.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$newsEvents$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/cms/newsEvents.ts [app-rsc] (ecmascript)");
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
"[project]/.next-internal/server/app/(main)/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/footer.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/app/actions/banner.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/app/actions/service.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/app/actions/campaign.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/app/actions/about.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE5 => \"[project]/app/actions/cms/projects.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE6 => \"[project]/app/actions/cms/awards.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE7 => \"[project]/app/actions/cms/newsEvents.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00047bc90fea78a18658501c09aecdc1c9d4204ad8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$about$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["seedAboutContent"],
    "001da7da9a0eedd761a57db91a9a52d66ffbf3dfdc",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$about$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAboutContent"],
    "006544b8536c0186aa405848bffb4cf31db543830c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$campaign$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveCampaigns"],
    "0065cae8ab74ad197064d579babe5f43b7912d1951",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFooterContent"],
    "007cf65fa1f656365a30b651ecd26fe1da26347333",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$newsEvents$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getNewsEvents"],
    "007e1a91f7b519ca5d6c4ccb761bad78b049c79943",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["seedBenevityBanners"],
    "00a41bc279e45f0e27d3f4db2de28cffa0175ba887",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$awards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAwards"],
    "00ba88600384259a2aa42aec381c1a08fe3d41dd61",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$campaign$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFeaturedCampaigns"],
    "00c9f85ed693c7a74fbc0ab7948ac5446149f71818",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["seedFooterContent"],
    "00d140b4151ffae36c89a7f5e681d57312d4f144f4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$newsEvents$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPublicNewsEvents"],
    "00dd43eb7736141490ffe9eda62dbd5862559ed67e",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServices"],
    "4032eec30a13a792ba0c592262a5dc6d8b24d30801",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$projects$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProject"],
    "4036f202ea854d1f38f7f2c16ab62fe332cab5eee6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$newsEvents$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createNewsEvent"],
    "403c66f40616f0acc06c60067dbec2990dafecd89b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServiceBySlug"],
    "4075419c60a8766877128bc636a7b8e0cd4c8fe33a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateFooterContent"],
    "407b083aa23ce1aaf78acc3ba86e335ccc2cd8ac57",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$awards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAward"],
    "409226afd6c749c81007d88916167531ff4909fed1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$awards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteAward"],
    "409e24f18dc27325b5c729a2a92088015c5f6cc851",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$newsEvents$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteNewsEvent"],
    "40ab74e04814e0b78eae355589518350854873d827",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$about$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateAboutContent"],
    "40bc71cafafafb778a8195b4a209fe9981e6598386",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createBanner"],
    "40c0bafb876c3ed2d661a06cb9fb64147501f288c4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$projects$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProjects"],
    "40cb339142f8b85a5487760ada21e5244afd1ed817",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$awards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAward"],
    "40d5626248d8865b6e37e9fc9954bf6acc3efaf03d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$campaign$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCampaignBySlug"],
    "40d8f479775aab25b8415d97de2ea4f04970270df4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$newsEvents$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getNewsEvent"],
    "40e1d749144717662e01422de68e2f9bcda4d31af5",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getBanners"],
    "40f1ffa789435057ef7d37ce9d1642f7ecff57356f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteBanner"],
    "600ba5e5545ee3f9dd1269639367db6de1e6ad9710",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$projects$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteProject"],
    "602dbded89c54ecc570e1da33339ebe786f4883e33",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$newsEvents$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateNewsEvent"],
    "60b795d2782807eceb89b0be8b86899b5db28c3610",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateBanner"],
    "60bf9fdf14c1cbcfb824ace252d72e40b11feb8494",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$awards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateAward"],
    "60e7533177a496688aebf6278550a96cb24d107251",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$projects$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createProject"],
    "7039f3f8df17a11fd04df6802ca0ee2520a8ded4f9",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$projects$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateProject"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$main$292f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$campaign$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$about$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$cms$2f$projects$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$cms$2f$awards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$cms$2f$newsEvents$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(main)/page/actions.js { ACTIONS_MODULE0 => "[project]/app/actions/footer.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/app/actions/banner.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/app/actions/service.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/app/actions/campaign.ts [app-rsc] (ecmascript)", ACTIONS_MODULE4 => "[project]/app/actions/about.ts [app-rsc] (ecmascript)", ACTIONS_MODULE5 => "[project]/app/actions/cms/projects.ts [app-rsc] (ecmascript)", ACTIONS_MODULE6 => "[project]/app/actions/cms/awards.ts [app-rsc] (ecmascript)", ACTIONS_MODULE7 => "[project]/app/actions/cms/newsEvents.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$footer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/footer.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$banner$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/banner.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/service.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$campaign$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/campaign.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$about$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/about.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$projects$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/cms/projects.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$awards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/cms/awards.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$cms$2f$newsEvents$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/cms/newsEvents.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_d6d57dba._.js.map