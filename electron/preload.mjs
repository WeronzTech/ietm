const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // Auth
  login: (data) => ipcRenderer.invoke("auth:login", data),

  // Admin Features
  createUser: (data) => ipcRenderer.invoke("auth:create-user", data),
  getUsers: () => ipcRenderer.invoke("auth:get-users"),

  // Manual CRUD
  getManuals: () => ipcRenderer.invoke("ietm:get-manuals"),
  createManual: (data) => ipcRenderer.invoke("ietm:create-manual", data),
  deleteManual: (id) => ipcRenderer.invoke("ietm:delete-manual", id),
  addModule: (data) => ipcRenderer.invoke("ietm:add-module", data),

  // Secure Transfer
  exportManual: (data) => ipcRenderer.invoke("ietm:export-manual", data), // { manualId, passkey }
  importManual: (data) => ipcRenderer.invoke("ietm:import-manual", data), // { passkey }

  // Viewer
  getManualTree: (id) => ipcRenderer.invoke("ietm:get-tree", id),
  getModuleContent: (id) => ipcRenderer.invoke("ietm:get-content", id),

  updateModule: (data) => ipcRenderer.invoke("ietm:update-module", data),
  uploadAsset: () => ipcRenderer.invoke("ietm:upload-asset"),
});
