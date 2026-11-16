import re

# 1. Update preload.mjs
with open('electron/preload.mjs', 'r', encoding='utf-8') as f:
    preload = f.read()
if 'unlockUser' not in preload:
    preload = preload.replace(
        'deleteUser: (id) => ipcRenderer.invoke("auth:delete-user", id),',
        'deleteUser: (id) => ipcRenderer.invoke("auth:delete-user", id),\n  unlockUser: (id) => ipcRenderer.invoke("auth:unlock-user", id),'
    )
    with open('electron/preload.mjs', 'w', encoding='utf-8') as f:
        f.write(preload)
    print('[+] preload.mjs updated with unlockUser')

# 2. Update src/api.js
with open('src/api.js', 'r', encoding='utf-8') as f:
    api = f.read()
if 'unlockUser' not in api:
    api = api.replace(
        'deleteUser: (id) => request(`/api/auth/users/${id}`, { method: "DELETE" }),',
        'deleteUser: (id) => request(`/api/auth/users/${id}`, { method: "DELETE" }),\n  unlockUser: (id) => request(`/api/auth/users/unlock/${id}`, { method: "POST" }),'
    )
    with open('src/api.js', 'w', encoding='utf-8') as f:
        f.write(api)
    print('[+] src/api.js updated with unlockUser')

# 3. Update electron/server.js
with open('electron/server.js', 'r', encoding='utf-8') as f:
    server = f.read()
if '/api/auth/users/unlock/' not in server:
    target = 'if (pathname.startsWith("/api/auth/users/") && method === "DELETE") {'
    unlock_endpoint = '''      if (pathname.startsWith("/api/auth/users/unlock/") && method === "POST") {
        if (user.role !== "admin" && user.role !== "superadmin") {
          return sendJson(res, 403, {
            success: false,
            message: "Forbidden: Admin role required.",
          });
        }
        const targetId = parseInt(pathname.replace("/api/auth/users/unlock/", ""));
        try {
          db.prepare("UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = ?").run(targetId);
          return sendJson(res, 200, { success: true });
        } catch (err) {
          return sendJson(res, 500, { success: false, message: err.message });
        }
      }

      '''
    server = server.replace(target, unlock_endpoint + target)
    with open('electron/server.js', 'w', encoding='utf-8') as f:
        f.write(server)
    print('[+] electron/server.js updated with unlock endpoint')

# 4. Update src/pages/AdminDashboard.jsx
with open('src/pages/AdminDashboard.jsx', 'r', encoding='utf-8') as f:
    admin = f.read()

# Fix handleUpdateUser to pass accessLevel and unitCode reliably
old_handle_update = '''  const handleUpdateUser = async () => {
    if (!editingUser) return;
    const res = await window.api.updateUser?.(editingUser);'''
new_handle_update = '''  const handleUpdateUser = async () => {
    if (!editingUser) return;
    const res = await window.api.updateUser?.({
      id: editingUser.id,
      username: editingUser.username,
      role: editingUser.role,
      accessLevel: editingUser.accessLevel || editingUser.access_level || 1,
      unitCode: editingUser.unitCode || editingUser.unit_code || "GEN-DEF",
      password: editingUser.password,
    });'''

if old_handle_update in admin:
    admin = admin.replace(old_handle_update, new_handle_update)
    print('[+] AdminDashboard.jsx handleUpdateUser updated')

# Add handleUnlockUser
if 'handleUnlockUser' not in admin:
    marker = '  const handleDeleteUser = async (targetUser) => {'
    unlock_func = '''  const handleUnlockUser = async (targetUser) => {
    const res = await window.api.unlockUser?.(targetUser.id);
    if (res?.success) {
      toast.success(`User "${targetUser.username}" unlocked successfully.`);
      loadData();
    } else {
      toast.error(res?.message || "Failed to unlock user.");
    }
  };

'''
    admin = admin.replace(marker, unlock_func + marker)
    print('[+] AdminDashboard.jsx handleUnlockUser added')

# Add UNLOCK button in actions column if locked
if 'handleUnlockUser(u)' not in admin:
    old_actions = '''                            <button
                              onClick={() => setEditingUser(u)}
                              className="p-1 rounded text-vector-accent hover:bg-gray-700"
                              title="Edit user parameters"
                            >'''
    new_actions = '''                            {isLocked && (
                              <button
                                onClick={() => handleUnlockUser(u)}
                                className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/40"
                                title="Reset failed attempts & unlock account"
                              >
                                UNLOCK
                              </button>
                            )}
                            <button
                              onClick={() => setEditingUser(u)}
                              className="p-1 rounded text-vector-accent hover:bg-gray-700"
                              title="Edit user parameters"
                            >'''
    admin = admin.replace(old_actions, new_actions)
    print('[+] AdminDashboard.jsx UNLOCK button added')

with open('src/pages/AdminDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(admin)

print('[SUCCESS] All user management enhancements patched!')

