const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // Auth
  login: (data) => ipcRenderer.invoke("auth:login", data),

  // Admin Features
  createUser: (data) => ipcRenderer.invoke("auth:create-user", data),
  deleteUser: (id) => ipcRenderer.invoke("auth:delete-user", id),
  getUsers: () => ipcRenderer.invoke("auth:get-users"),
  getAudits: () => ipcRenderer.invoke("ietm:get-audits"),
  createBackup: () => ipcRenderer.invoke("ietm:create-backup"),
  logAudit: (data) => ipcRenderer.invoke("ietm:log-audit", data),

  // Manual CRUD
  getManuals: (data) => ipcRenderer.invoke("ietm:get-manuals", data),
  createManual: (data) => ipcRenderer.invoke("ietm:create-manual", data),
  deleteManual: (id) => ipcRenderer.invoke("ietm:delete-manual", id),
  addModule: (data) => ipcRenderer.invoke("ietm:add-module", data),

  // Secure Transfer
  exportManual: (data) => ipcRenderer.invoke("ietm:export-manual", data), // { manualId, passkey }
  importManual: (data) => ipcRenderer.invoke("ietm:import-manual", data), // { passkey }

  // Viewer
  getManualTree: (id) => ipcRenderer.invoke("ietm:get-tree", id),
  getModuleContent: (id) => ipcRenderer.invoke("ietm:get-content", id),
  toggleBookmark: (data) => ipcRenderer.invoke("ietm:toggle-bookmark", data),
  getBookmarks: (userId) => ipcRenderer.invoke("ietm:get-bookmarks", userId),

  // Diagnostics & Hotspots
  saveHotspots: (data) => ipcRenderer.invoke("ietm:save-hotspots", data),
  getHotspots: (moduleId) => ipcRenderer.invoke("ietm:get-hotspots", moduleId),
  saveDiagnostic: (data) => ipcRenderer.invoke("ietm:save-diagnostic", data),
  getDiagnostic: (moduleId) => ipcRenderer.invoke("ietm:get-diagnostic", moduleId),

  // Logistics & Supply
  getInventory: () => ipcRenderer.invoke("ietm:get-inventory"),
  addInventory: (data) => ipcRenderer.invoke("ietm:add-inventory", data),
  getModuleParts: (moduleId) => ipcRenderer.invoke("ietm:get-module-parts", moduleId),
  addModulePart: (data) => ipcRenderer.invoke("ietm:add-module-part", data),
  saveModuleParts: (data) => ipcRenderer.invoke("ietm:save-module-parts", data),

  updateModule: (data) => ipcRenderer.invoke("ietm:update-module", data),
  deleteModule: (id) => ipcRenderer.invoke("ietm:delete-module", id),
  uploadAsset: () => ipcRenderer.invoke("ietm:upload-asset"),
  search: (query) => ipcRenderer.invoke("ietm:search", query),

  // Glossary (V7, O8)
  getGlossary: (manualId) => ipcRenderer.invoke("ietm:get-glossary", manualId),
  addGlossary: (data) => ipcRenderer.invoke("ietm:add-glossary", data),
  updateGlossary: (data) => ipcRenderer.invoke("ietm:update-glossary", data),
  deleteGlossary: (id) => ipcRenderer.invoke("ietm:delete-glossary", id),

  // Annotations & Comments (V25, V26, V27, A10)
  getAnnotations: (data) => ipcRenderer.invoke("ietm:get-annotations", data),
  getAllAnnotations: () => ipcRenderer.invoke("ietm:get-all-annotations"),
  addAnnotation: (data) => ipcRenderer.invoke("ietm:add-annotation", data),
  replyAnnotation: (data) => ipcRenderer.invoke("ietm:reply-annotation", data),
  moderateAnnotation: (data) => ipcRenderer.invoke("ietm:moderate-annotation", data),
  deleteAnnotation: (id) => ipcRenderer.invoke("ietm:delete-annotation", id),

  // Search History & Suggestions (V11, V12, V13, V14, V15, A13, O7)
  getSearchSuggestions: (query) => ipcRenderer.invoke("ietm:get-search-suggestions", query),
  addSearchSuggestion: (data) => ipcRenderer.invoke("ietm:add-search-suggestion", data),
  deleteSearchSuggestion: (id) => ipcRenderer.invoke("ietm:delete-search-suggestion", id),
  getSearchHistory: (userId) => ipcRenderer.invoke("ietm:get-search-history", userId),
  saveSearchHistory: (data) => ipcRenderer.invoke("ietm:save-search-history", data),
  clearSearchHistory: (userId) => ipcRenderer.invoke("ietm:clear-search-history", userId),
  searchAdvanced: (data) => ipcRenderer.invoke("ietm:search-advanced", data),
  searchPdfManuals: (data) => ipcRenderer.invoke("ietm:search-pdf-manuals", data),

  // Media & Assets Gallery (V4, V5, V6, V24, O10)
  getManualAssets: (data) => ipcRenderer.invoke("ietm:get-manual-assets", data),
  addManualAsset: (data) => ipcRenderer.invoke("ietm:add-manual-asset", data),
  deleteManualAsset: (id) => ipcRenderer.invoke("ietm:delete-manual-asset", id),

  // Revisions (V34, A14)
  getRevisions: (manualId) => ipcRenderer.invoke("ietm:get-revisions", manualId),
  addRevision: (data) => ipcRenderer.invoke("ietm:add-revision", data),

  // System Settings (A15, O11)
  getSettings: () => ipcRenderer.invoke("ietm:get-settings"),
  saveSettings: (data) => ipcRenderer.invoke("ietm:save-settings", data),

  // Session & Security (V36, V37, V38)
  sessionPing: (data) => ipcRenderer.invoke("auth:session-ping", data),
  getSecurityQuestion: (username) => ipcRenderer.invoke("auth:get-security-question", username),
  setSecurityQuestion: (data) => ipcRenderer.invoke("auth:set-security-question", data),
  verifySecurityQuestion: (data) => ipcRenderer.invoke("auth:verify-security-question", data),

  // Diagnostic Link Checker (G3)
  checkLinks: (manualId) => ipcRenderer.invoke("ietm:check-links", manualId),

  // Reports & Backup (A8, A9, A11)
  getConsolidatedReport: (filters) => ipcRenderer.invoke("ietm:get-consolidated-report", filters),
  restoreBackup: () => ipcRenderer.invoke("ietm:restore-backup"),
});
