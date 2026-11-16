import re

# 1. Update electron/main.js
with open('electron/main.js', 'r', encoding='utf-8') as f:
    main_code = f.read()

package_ipc = '''  // Generate Customer Package IPC Handler (Zero-Code UI Distribution)
  ipcMain.handle("ietm:generate-customer-package", async (e, {
    companyName,
    operatorUsername,
    operatorPassword,
    adminUsername,
    adminPassword,
    selectedManualIds,
  }) => {
    try {
      const sanitizedCompany = (companyName || "CUSTOMER").trim().replace(/[^a-zA-Z0-9_-]/g, "_");
      const outDir = path.join(process.cwd(), "release", "customers", sanitizedCompany);
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      const targetDbPath = path.join(outDir, "ietm_core_secure.db");

      // Locate active source database
      const srcDbPath = fs.existsSync(path.join(process.cwd(), "ietm_core_secure.db"))
        ? path.join(process.cwd(), "ietm_core_secure.db")
        : path.join(app.getPath("userData"), "ietm_core_secure.db");

      if (!fs.existsSync(srcDbPath)) {
        return { success: false, message: "Source database not found." };
      }

      fs.copyFileSync(srcDbPath, targetDbPath);

      // Connect to target DB to customize it for this customer
      const custDb = new Database(targetDbPath);
      const DB_KEY = "SECRET-MILITARY-KEY-CHANGE-THIS";
      custDb.pragma("cipher='sqlcipher'");
      custDb.pragma(`key='${DB_KEY}'`);

      // 1. Wipe old internal/test users and sessions
      custDb.prepare("DELETE FROM users").run();
      custDb.prepare("DELETE FROM user_sessions").run();
      custDb.prepare("DELETE FROM audit_logs").run();
      custDb.prepare("DELETE FROM search_history").run();
      custDb.prepare("DELETE FROM annotations").run();
      custDb.prepare("DELETE FROM bookmarks").run();

      // 2. Insert Client Operator
      if (operatorUsername && operatorPassword) {
        const opHash = bcrypt.hashSync(operatorPassword.trim(), 10);
        custDb.prepare(
          "INSERT INTO users (username, password, role, access_level, unit_code) VALUES (?, ?, ?, ?, ?)"
        ).run(operatorUsername.trim(), opHash, "operator", 1, sanitizedCompany);
      }

      // 3. Insert Client Admin (if provided)
      if (adminUsername && adminPassword) {
        const admHash = bcrypt.hashSync(adminPassword.trim(), 10);
        custDb.prepare(
          "INSERT INTO users (username, password, role, access_level, unit_code) VALUES (?, ?, ?, ?, ?)"
        ).run(adminUsername.trim(), admHash, "admin", 3, sanitizedCompany);
      }

      // 4. Filter manuals if specific ones were selected
      if (Array.isArray(selectedManualIds) && selectedManualIds.length > 0) {
        const placeholders = selectedManualIds.map(() => "?").join(",");
        custDb.prepare(`DELETE FROM manuals WHERE id NOT IN (${placeholders})`).run(...selectedManualIds);
        custDb.prepare(`DELETE FROM modules WHERE manual_id NOT IN (${placeholders})`).run(...selectedManualIds);
      }

      custDb.close();

      return {
        success: true,
        path: targetDbPath,
        directory: outDir,
        company: sanitizedCompany,
        message: `Deployment package created at release/customers/${sanitizedCompany}/`,
      };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

'''

if 'ietm:generate-customer-package' not in main_code:
    main_code = main_code.replace('  ipcMain.handle("ietm:create-backup"', package_ipc + '  ipcMain.handle("ietm:create-backup"')
    with open('electron/main.js', 'w', encoding='utf-8') as f:
        f.write(main_code)
    print('[+] electron/main.js patched with ietm:generate-customer-package')

# 2. Update electron/preload.mjs
with open('electron/preload.mjs', 'r', encoding='utf-8') as f:
    preload_code = f.read()

if 'generateCustomerPackage' not in preload_code:
    preload_code = preload_code.replace(
        'createBackup: () => ipcRenderer.invoke("ietm:create-backup"),',
        'createBackup: () => ipcRenderer.invoke("ietm:create-backup"),\n  generateCustomerPackage: (data) => ipcRenderer.invoke("ietm:generate-customer-package", data),'
    )
    with open('electron/preload.mjs', 'w', encoding='utf-8') as f:
        f.write(preload_code)
    print('[+] electron/preload.mjs patched with generateCustomerPackage')

# 3. Update src/api.js
with open('src/api.js', 'r', encoding='utf-8') as f:
    api_code = f.read()

if 'generateCustomerPackage:' not in api_code:
    api_code = api_code.replace(
        'createBackup: () => request("/api/ietm/backup", { method: "POST" }),',
        'createBackup: () => request("/api/ietm/backup", { method: "POST" }),\n  generateCustomerPackage: (data) => request("/api/ietm/generate-customer-package", { method: "POST", body: JSON.stringify(data) }),'
    )
    with open('src/api.js', 'w', encoding='utf-8') as f:
        f.write(api_code)
    print('[+] src/api.js patched with generateCustomerPackage')

# 4. Update src/pages/AdminDashboard.jsx
with open('src/pages/AdminDashboard.jsx', 'r', encoding='utf-8') as f:
    admin_code = f.read()

# Add icon import if needed
if 'PackageCheck' not in admin_code:
    admin_code = admin_code.replace('import { PlusCircle,', 'import { PlusCircle, PackageCheck, FolderArchive,')

# Add package modal states and handlers
if 'showCustomerPackageModal' not in admin_code:
    state_injection = '''  // Customer Package Generator Modal State (Zero-Code Distribution)
  const [showCustomerPackageModal, setShowCustomerPackageModal] = useState(false);
  const [packCompanyName, setPackCompanyName] = useState("");
  const [packOpUser, setPackOpUser] = useState("");
  const [packOpPass, setPackOpPass] = useState("");
  const [packAdminUser, setPackAdminUser] = useState("");
  const [packAdminPass, setPackAdminPass] = useState("");
  const [packSelectedManuals, setPackSelectedManuals] = useState([]);
  const [isPackaging, setIsPackaging] = useState(false);

  const handleGenerateCustomerPackage = async (e) => {
    e.preventDefault();
    if (!packCompanyName.trim()) {
      return toast.error("Company / Client Name is required.");
    }
    if (!packOpUser.trim() || !packOpPass.trim()) {
      return toast.error("Operator Username & Password are required.");
    }
    setIsPackaging(true);
    try {
      const res = await window.api.generateCustomerPackage?.({
        companyName: packCompanyName.trim(),
        operatorUsername: packOpUser.trim(),
        operatorPassword: packOpPass.trim(),
        adminUsername: packAdminUser.trim() || null,
        adminPassword: packAdminPass.trim() || null,
        selectedManualIds: packSelectedManuals.length > 0 ? packSelectedManuals : null,
      });

      if (res?.success) {
        toast.success(`Client release generated: ${res.path}`, { duration: 6000 });
        setShowCustomerPackageModal(false);
        setPackCompanyName("");
        setPackOpUser("");
        setPackOpPass("");
        setPackAdminUser("");
        setPackAdminPass("");
        setPackSelectedManuals([]);
      } else {
        toast.error(res?.message || "Package generation failed.");
      }
    } catch (err) {
      toast.error(err.message || "Error generating client package.");
    } finally {
      setIsPackaging(false);
    }
  };

  // Moderation Reply State'''

    admin_code = admin_code.replace('  // Moderation Reply State', state_injection)

# Add Package Client Button in top bar
if 'Export Client Release' not in admin_code:
    target_btn = '''          <button
            onClick={handleBackup}'''
    package_btn = '''          {user?.role === "superadmin" && (
            <button
              onClick={() => {
                setPackSelectedManuals(manuals.map(m => m.id));
                setShowCustomerPackageModal(true);
              }}
              className="rounded-sm bg-emerald-600 px-4 py-2 text-xs font-bold tracking-widest text-black hover:bg-emerald-500 uppercase flex items-center gap-2 transition-colors font-mono shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              title="Generate a clean, customized release database for a specific client company"
            >
              <PackageCheck size={15} /> Export Client Release
            </button>
          )}
          <button
            onClick={handleBackup}'''
    admin_code = admin_code.replace(target_btn, package_btn)

# Add Modal Markup at bottom of AdminDashboard
if 'Customer Package Generator Modal -->' not in admin_code:
    modal_code = '''
      {/* <!-- Customer Package Generator Modal --> */}
      {showCustomerPackageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-[540px] max-w-full rounded-xl bg-vector-panel border border-emerald-500/40 p-6 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-emerald-400 uppercase flex items-center gap-2">
                <PackageCheck size={18} /> Export Customer Delivery Package
              </h3>
              <span className="text-[10px] text-gray-500">JSG 0852 LEVEL-4</span>
            </div>
            
            <p className="text-[11px] text-gray-400">
              Generate a clean, encrypted database customized for a client company. Internal test accounts and audit logs will be stripped automatically.
            </p>

            <form onSubmit={handleGenerateCustomerPackage} className="space-y-3">
              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">Company / Client Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HAL-NASHIK, TATA-DEFENCE, ARMY-CORPS-IV"
                  value={packCompanyName}
                  onChange={(e) => setPackCompanyName(e.target.value)}
                  className="w-full bg-vector-bg border border-gray-700 rounded p-2 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 bg-vector-bg/60 p-3 rounded border border-gray-800">
                <div>
                  <label className="text-[10px] text-emerald-400 uppercase block mb-1 font-bold">Client Operator Username</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. hal_tech01"
                    value={packOpUser}
                    onChange={(e) => setPackOpUser(e.target.value)}
                    className="w-full bg-vector-bg border border-gray-700 rounded p-2 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-emerald-400 uppercase block mb-1 font-bold">Initial Password</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hal#Pass2026!"
                    value={packOpPass}
                    onChange={(e) => setPackOpPass(e.target.value)}
                    className="w-full bg-vector-bg border border-gray-700 rounded p-2 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-vector-bg/60 p-3 rounded border border-gray-800">
                <div>
                  <label className="text-[10px] text-blue-400 uppercase block mb-1">Client Admin Username (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. hal_admin (optional)"
                    value={packAdminUser}
                    onChange={(e) => setPackAdminUser(e.target.value)}
                    className="w-full bg-vector-bg border border-gray-700 rounded p-2 text-xs text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-blue-400 uppercase block mb-1">Admin Password (Optional)</label>
                  <input
                    type="text"
                    placeholder="Optional admin password"
                    value={packAdminPass}
                    onChange={(e) => setPackAdminPass(e.target.value)}
                    className="w-full bg-vector-bg border border-gray-700 rounded p-2 text-xs text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">Select Manuals to Include</label>
                <div className="max-h-28 overflow-y-auto space-y-1 bg-vector-bg p-2 rounded border border-gray-800 text-xs">
                  {manuals.map((m) => (
                    <label key={m.id} className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={packSelectedManuals.includes(m.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPackSelectedManuals([...packSelectedManuals, m.id]);
                          } else {
                            setPackSelectedManuals(packSelectedManuals.filter(id => id !== m.id));
                          }
                        }}
                        className="rounded border-gray-700 text-emerald-500 focus:ring-0"
                      />
                      <span>#{m.id} - {m.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowCustomerPackageModal(false)}
                  className="px-4 py-2 text-xs text-gray-400 hover:text-white uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPackaging}
                  className="px-5 py-2 bg-emerald-500 text-black font-bold text-xs rounded uppercase hover:bg-emerald-400 disabled:opacity-50 flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                >
                  <PackageCheck size={14} />
                  {isPackaging ? "Generating..." : "Generate Delivery DB"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
'''
    admin_code = admin_code.replace('{/* Edit User Modal */}', modal_code + '\n      {/* Edit User Modal */}')

with open('src/pages/AdminDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(admin_code)
print('[+] AdminDashboard.jsx patched with Customer Package Generator')

print('[SUCCESS] Customer packaging system ready!')

