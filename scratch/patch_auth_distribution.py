import re

# 1. Update electron/main.js
with open('electron/main.js', 'r', encoding='utf-8') as f:
    main_code = f.read()

change_pwd_ipc = '''  // Self-Service Change Password (Any Authenticated User)
  ipcMain.handle("auth:change-password", (e, { userId, oldPassword, newPassword }) => {
    try {
      if (!oldPassword || !newPassword) {
        return { success: false, message: "Current and new passwords are required." };
      }
      if (newPassword.trim().length < 4) {
        return { success: false, message: "New password must be at least 4 characters." };
      }
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
      if (!user) {
        return { success: false, message: "User record not found." };
      }
      if (!bcrypt.compareSync(oldPassword.trim(), user.password)) {
        return { success: false, message: "Incorrect current password." };
      }
      const newHash = bcrypt.hashSync(newPassword.trim(), 10);
      db.prepare("UPDATE users SET password = ? WHERE id = ?").run(newHash, user.id);
      db.prepare("INSERT INTO audit_logs (user_id, action, target) VALUES (?, ?, ?)").run(
        user.id,
        "PASSWORD_CHANGED",
        `User ${user.username} successfully updated their password`
      );
      return { success: true, message: "Password updated successfully." };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

'''

if 'auth:change-password' not in main_code:
    main_code = main_code.replace('// Update User Handler', change_pwd_ipc + '  // Update User Handler')
    with open('electron/main.js', 'w', encoding='utf-8') as f:
        f.write(main_code)
    print('[+] electron/main.js patched with auth:change-password')

# 2. Update electron/preload.mjs
with open('electron/preload.mjs', 'r', encoding='utf-8') as f:
    preload_code = f.read()

if 'changePassword' not in preload_code:
    preload_code = preload_code.replace(
        'login: (data) => ipcRenderer.invoke("auth:login", data),',
        'login: (data) => ipcRenderer.invoke("auth:login", data),\n  changePassword: (data) => ipcRenderer.invoke("auth:change-password", data),'
    )
    with open('electron/preload.mjs', 'w', encoding='utf-8') as f:
        f.write(preload_code)
    print('[+] electron/preload.mjs patched with changePassword')

# 3. Update src/api.js
with open('src/api.js', 'r', encoding='utf-8') as f:
    api_code = f.read()

if 'changePassword:' not in api_code:
    api_code = api_code.replace(
        'deleteUser: (id) => request(`/api/auth/users/${id}`, { method: "DELETE" }),',
        'deleteUser: (id) => request(`/api/auth/users/${id}`, { method: "DELETE" }),\n  changePassword: (data) => request("/api/auth/change-password", { method: "POST", body: JSON.stringify(data) }),'
    )
    with open('src/api.js', 'w', encoding='utf-8') as f:
        f.write(api_code)
    print('[+] src/api.js patched with changePassword')

# 4. Update electron/server.js
with open('electron/server.js', 'r', encoding='utf-8') as f:
    server_code = f.read()

server_change_pwd = '''      // Self-service change password
      if (pathname === "/api/auth/change-password" && method === "POST") {
        const { oldPassword, newPassword } = await parseBody(req);
        if (!oldPassword || !newPassword) {
          return sendJson(res, 400, { success: false, message: "Current and new passwords required." });
        }
        try {
          const userRec = db.prepare("SELECT * FROM users WHERE id = ?").get(user.user_id);
          if (!userRec || !bcrypt.compareSync(oldPassword.trim(), userRec.password)) {
            return sendJson(res, 400, { success: false, message: "Incorrect current password." });
          }
          const hash = bcrypt.hashSync(newPassword.trim(), 10);
          db.prepare("UPDATE users SET password = ? WHERE id = ?").run(hash, userRec.id);
          db.prepare("INSERT INTO audit_logs (user_id, action, target, ip_address) VALUES (?, ?, ?, ?)").run(
            userRec.id,
            "PASSWORD_CHANGED",
            `User ${userRec.username} updated password via Web API`,
            clientIp
          );
          return sendJson(res, 200, { success: true, message: "Password updated successfully." });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

'''

if '/api/auth/change-password' not in server_code:
    target_marker = '      // 3. User Management (Admin / Superadmin only)'
    server_code = server_code.replace(target_marker, server_change_pwd + target_marker)
    with open('electron/server.js', 'w', encoding='utf-8') as f:
        f.write(server_code)
    print('[+] electron/server.js patched with /api/auth/change-password')

# 5. Update AdminDashboard.jsx to lock Content Authoring & Manual Destruction to superadmin only
with open('src/pages/AdminDashboard.jsx', 'r', encoding='utf-8') as f:
    admin_code = f.read()

# Replace Author Content and Delete with role checks
old_buttons = '''                        <button
                          onClick={() => setEditingManualId(m.id)}
                          className="px-2.5 py-1 rounded bg-vector-accent/15 border border-vector-accent text-vector-accent hover:bg-vector-accent hover:text-black transition-colors text-[11px] font-bold uppercase flex items-center gap-1"
                        >
                          <Edit3 size={13} /> Author Content
                        </button>
                        <button
                          onClick={() => {
                            setExportId(m.id);
                            setPasskey("");
                          }}
                          className="p-1.5 rounded bg-gray-800 hover:text-yellow-400 text-gray-400"
                          title="Export encrypted manual"
                        >
                          <Download size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteManual(m.id)}
                          className="p-1.5 rounded bg-gray-800 hover:text-red-400 text-gray-400"
                          title="Expunge record"
                        >
                          <Trash2 size={14} />
                        </button>'''

new_buttons = '''                        {user?.role === "superadmin" ? (
                          <>
                            <button
                              onClick={() => setEditingManualId(m.id)}
                              className="px-2.5 py-1 rounded bg-vector-accent/15 border border-vector-accent text-vector-accent hover:bg-vector-accent hover:text-black transition-colors text-[11px] font-bold uppercase flex items-center gap-1"
                            >
                              <Edit3 size={13} /> Author Content
                            </button>
                            <button
                              onClick={() => {
                                setExportId(m.id);
                                setPasskey("");
                              }}
                              className="p-1.5 rounded bg-gray-800 hover:text-yellow-400 text-gray-400"
                              title="Export encrypted manual"
                            >
                              <Download size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteManual(m.id)}
                              className="p-1.5 rounded bg-gray-800 hover:text-red-400 text-gray-400"
                              title="Expunge record"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700 text-[10px] font-mono">
                              🔒 OEM VERIFIED (READ-ONLY)
                            </span>
                            <button
                              onClick={() => {
                                setExportId(m.id);
                                setPasskey("");
                              }}
                              className="p-1.5 rounded bg-gray-800 hover:text-yellow-400 text-gray-400"
                              title="Export encrypted manual backup"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        )}'''

if old_buttons in admin_code:
    admin_code = admin_code.replace(old_buttons, new_buttons)
    with open('src/pages/AdminDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(admin_code)
    print('[+] AdminDashboard.jsx patched with OEM authoring lock')

# 6. Update src/components/Layout.jsx to include Change Password modal
with open('src/components/Layout.jsx', 'r', encoding='utf-8') as f:
    layout_code = f.read()

# Add Key icon import if not present
if 'Key,' not in layout_code and 'Key ' not in layout_code:
    layout_code = layout_code.replace('import { LogOut,', 'import { LogOut, Key, Lock,')

# Add modal state and handler
if 'showChangePassword' not in layout_code:
    state_injection = '''  // Change Password Modal State
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      return toast.error("Current and new passwords are required.");
    }
    if (newPassword.length < 4) {
      return toast.error("New password must be at least 4 characters.");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match.");
    }
    setIsUpdatingPassword(true);
    try {
      const res = await window.api.changePassword({
        userId: user?.id,
        oldPassword,
        newPassword,
      });
      if (res?.success) {
        toast.success("Password updated successfully!");
        setShowChangePassword(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res?.message || "Failed to update password.");
      }
    } catch (err) {
      toast.error(err.message || "Error updating password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleClearHistory = () => {'''

    layout_code = layout_code.replace('  const handleClearHistory = () => {', state_injection)

    # Add button next to logout
    old_logout_block = '''          <button
            onClick={logout}
            className="flex items-center gap-1.5 bg-transparent border border-gray-700 hover:border-red-500 hover:text-red-400 px-3 py-1.5 rounded-sm text-xs font-bold transition-colors text-vector-text-muted uppercase"
          >
            <LogOut size={13} /> LOGOUT
          </button>'''

    new_logout_block = '''          <button
            onClick={() => setShowChangePassword(true)}
            className="flex items-center gap-1.5 bg-transparent border border-gray-700 hover:border-vector-accent hover:text-vector-accent px-3 py-1.5 rounded-sm text-xs font-bold transition-colors text-vector-text-muted uppercase font-mono"
            title="Change personal account password"
          >
            <Key size={13} /> CHANGE PASSWORD
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 bg-transparent border border-gray-700 hover:border-red-500 hover:text-red-400 px-3 py-1.5 rounded-sm text-xs font-bold transition-colors text-vector-text-muted uppercase"
          >
            <LogOut size={13} /> LOGOUT
          </button>'''

    layout_code = layout_code.replace(old_logout_block, new_logout_block)

    # Add Modal Markup before closing </header> or end of component
    modal_markup = '''
      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-[400px] max-w-full rounded-xl bg-vector-panel border border-gray-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-vector-accent uppercase font-mono flex items-center gap-2">
              <Lock size={16} /> Update Account Password
            </h3>
            <p className="text-[11px] text-gray-400 font-mono">
              User: <span className="text-white font-bold">{user?.username}</span> | Unit: <span className="text-vector-accent">{user?.unit_code || "DEF-CORP"}</span>
            </p>
            <form onSubmit={handleChangePasswordSubmit} className="space-y-3 font-mono">
              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-vector-bg border border-gray-700 rounded p-2 text-xs text-white outline-none focus:border-vector-accent"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 4 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-vector-bg border border-gray-700 rounded p-2 text-xs text-white outline-none focus:border-vector-accent"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-vector-bg border border-gray-700 rounded p-2 text-xs text-white outline-none focus:border-vector-accent"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="px-4 py-2 text-xs text-gray-400 hover:text-white uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-4 py-2 bg-vector-accent text-black font-bold text-xs rounded uppercase hover:brightness-110 disabled:opacity-50"
                >
                  {isUpdatingPassword ? "Updating..." : "Save Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
'''
    layout_code = layout_code.replace('{/* 2. MAIN APPLICATION CONTENT */}', modal_markup + '      {/* 2. MAIN APPLICATION CONTENT */}')

    with open('src/components/Layout.jsx', 'w', encoding='utf-8') as f:
        f.write(layout_code)
    print('[+] Layout.jsx patched with Change Password modal')

print('[SUCCESS] All distribution & password security enhancements applied!')

