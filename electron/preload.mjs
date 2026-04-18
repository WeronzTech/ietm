const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // Auth
  login: (data) => ipcRenderer.invoke("auth:login", data),

  // Admin Features
  createUser: (data) => ipcRenderer.invoke("auth:create-user", data),
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
  uploadAsset: () => ipcRenderer.invoke("ietm:upload-asset"),
  search: (query) => ipcRenderer.invoke("ietm:search", query),
});
