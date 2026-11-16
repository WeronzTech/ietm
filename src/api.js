// src/api.js
// Universal API Client Bridge for IETM Level-4
// Bridges Electron IPC (desktop mode) and REST API (Chrome, Edge, Firefox over LAN)

let activeSessionToken = localStorage.getItem("ietm_session_token") || null;

export function setApiSessionToken(token) {
  activeSessionToken = token;
  if (token) {
    localStorage.setItem("ietm_session_token", token);
  } else {
    localStorage.removeItem("ietm_session_token");
  }
}

export function getApiSessionToken() {
  return activeSessionToken;
}

// REST Client Helper
async function request(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (activeSessionToken) {
    headers["Authorization"] = `Bearer ${activeSessionToken}`;
    headers["X-Session-Token"] = activeSessionToken;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({ message: res.statusText }));
    return { success: false, status: res.status, ...errorBody };
  }

  return res.json().catch(() => ({ success: true }));
}

// Fallback REST Implementation for Browser LAN Mode
const restApi = {
  // Auth
  login: async (data) => {
    const res = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res?.sessionToken) {
      setApiSessionToken(res.sessionToken);
    }
    return res;
  },

  createUser: (data) =>
    request("/api/auth/create-user", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateUser: (data) =>
    request(`/api/auth/users/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteUser: (id) => request(`/api/auth/users/${id}`, { method: "DELETE" }),
  changePassword: (data) => request("/api/auth/change-password", { method: "POST", body: JSON.stringify(data) }),
  unlockUser: (id) => request(`/api/auth/users/unlock/${id}`, { method: "POST" }),
  getUsers: () => request("/api/auth/users"),
  getAudits: () => request("/api/ietm/get-audits"),
  createBackup: () => request("/api/ietm/backup", { method: "POST" }),
  generateCustomerPackage: (data) => request("/api/ietm/generate-customer-package", { method: "POST", body: JSON.stringify(data) }),
  logAudit: (data) =>
    request("/api/ietm/log-audit", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Manuals
  getManuals: (data) => request("/api/ietm/manuals"),
  createManual: (data) =>
    request("/api/ietm/manuals", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteManual: (id) =>
    request(`/api/ietm/manuals/${id}`, { method: "DELETE" }),
  addModule: (data) =>
    request("/api/ietm/modules", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Secure Transfer
  exportManual: (data) =>
    request("/api/ietm/export", { method: "POST", body: JSON.stringify(data) }),
  importManual: (data) =>
    request("/api/ietm/import", { method: "POST", body: JSON.stringify(data) }),

  // Viewer
  getManualTree: (id) => request(`/api/ietm/tree/${id}`),
  getModuleContent: (id) => request(`/api/ietm/content/${id}`),
  toggleBookmark: (data) =>
    request("/api/ietm/bookmarks/toggle", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getBookmarks: (userId) => request(`/api/ietm/bookmarks/${userId || ""}`),

  // Diagnostics & Hotspots
  saveHotspots: (data) =>
    request("/api/ietm/hotspots", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getHotspots: (moduleId) => request(`/api/ietm/hotspots/${moduleId}`),

  // Logistics
  getInventory: () => request("/api/ietm/inventory"),
  addInventory: (data) =>
    request("/api/ietm/inventory", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getModuleParts: (moduleId) => request(`/api/ietm/module-parts/${moduleId}`),
  saveModuleParts: (data) =>
    request("/api/ietm/module-parts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateModule: (data) =>
    request(`/api/ietm/modules/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteModule: (id) =>
    request(`/api/ietm/modules/${id}`, { method: "DELETE" }),
  uploadAsset: async () => null,
  search: (query) =>
    request("/api/ietm/search", {
      method: "POST",
      body: JSON.stringify({ query }),
    }),

  // Glossary
  getGlossary: (manualId) => request(`/api/ietm/glossary/${manualId}`),
  addGlossary: (data) =>
    request("/api/ietm/glossary", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateGlossary: (data) =>
    request(`/api/ietm/glossary/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteGlossary: (id) =>
    request(`/api/ietm/glossary/${id}`, { method: "DELETE" }),

  // Annotations
  getAnnotations: (data) =>
    request(`/api/ietm/annotations?moduleId=${data.moduleId}`),
  getAllAnnotations: () => request("/api/ietm/annotations/all"),
  addAnnotation: (data) =>
    request("/api/ietm/annotations", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  replyAnnotation: (data) =>
    request("/api/ietm/annotations/reply", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  moderateAnnotation: (data) =>
    request("/api/ietm/annotations/moderate", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteAnnotation: (id) =>
    request(`/api/ietm/annotations/${id}`, { method: "DELETE" }),

  // Search History & Suggestions
  getSearchSuggestions: (query) =>
    request(`/api/ietm/suggestions?q=${encodeURIComponent(query || "")}`),
  addSearchSuggestion: (data) =>
    request("/api/ietm/suggestions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteSearchSuggestion: (id) =>
    request(`/api/ietm/suggestions/${id}`, { method: "DELETE" }),
  getSearchHistory: (userId) => request(`/api/ietm/search-history/${userId}`),
  saveSearchHistory: (data) =>
    request("/api/ietm/search-history", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  clearSearchHistory: (userId) =>
    request(`/api/ietm/search-history/${userId}`, { method: "DELETE" }),
  searchAdvanced: (data) =>
    request("/api/ietm/search", { method: "POST", body: JSON.stringify(data) }),
  searchPdfManuals: (data) =>
    request("/api/ietm/search-pdf", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Media & Assets
  getManualAssets: (data) =>
    request(
      `/api/ietm/assets?manualId=${data.manualId}&assetType=${data.assetType || ""}`,
    ),
  addManualAsset: (data) =>
    request("/api/ietm/assets", { method: "POST", body: JSON.stringify(data) }),
  deleteManualAsset: (id) =>
    request(`/api/ietm/assets/${id}`, { method: "DELETE" }),

  // Revisions
  getRevisions: (manualId) => request(`/api/ietm/revisions/${manualId}`),
  addRevision: (data) =>
    request("/api/ietm/revisions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // System Settings
  getSettings: () => request("/api/ietm/settings"),
  saveSettings: (data) =>
    request("/api/ietm/settings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Session & Security
  sessionPing: (data) =>
    request("/api/auth/session-ping", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getSecurityQuestion: (username) =>
    request(`/api/auth/security-question/${encodeURIComponent(username)}`),
  setSecurityQuestion: (data) =>
    request("/api/auth/security-question", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  verifySecurityQuestion: (data) =>
    request("/api/auth/verify-security-question", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Diagnostic Link Checker
  checkLinks: (manualId) => request(`/api/ietm/check-links/${manualId}`),

  // Reports & Backup
  getConsolidatedReport: (filters) =>
    request("/api/ietm/report", {
      method: "POST",
      body: JSON.stringify(filters),
    }),
  restoreBackup: () => request("/api/ietm/restore", { method: "POST" }),
};

// Initialize window.api if not in Electron context
if (typeof window !== "undefined") {
  if (!window.api) {
    window.api = restApi;
  }
}

export default typeof window !== "undefined" && window.api
  ? window.api
  : restApi;
