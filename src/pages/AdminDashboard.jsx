import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Editor from "./Editor";
import InventoryManager from "./InventoryManager";
import toast from "react-hot-toast";
import {
  Users,
  ShieldAlert,
  Lock,
  Edit3,
  Download,
  PlusCircle,
  Trash2,
  Database,
  Activity,
  Box,
  Eye,
  MessageSquare,
  FileText,
  Printer,
  Settings,
  Sparkles,
  CheckCircle,
  XCircle,
  RefreshCw,
  Clock,
  Filter,
  PackageCheck,
} from "lucide-react";

export default function AdminDashboard({ onSwitchToViewer }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users"); // 'users', 'manuals', 'audits', 'moderation', 'reports', 'backup', 'settings', 'suggestions'

  // Master Data
  const [users, setUsers] = useState([]);
  const [manuals, setManuals] = useState([]);
  const [audits, setAudits] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [settings, setSettings] = useState({});

  // Navigation states
  const [editingManualId, setEditingManualId] = useState(null);
  const [viewLogistics, setViewLogistics] = useState(false);

  // User State
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "operator",
    accessLevel: 1,
    unitCode: "HQ-01",
  });
  const [editingUser, setEditingUser] = useState(null);

  // Manual State
  const [newManual, setNewManual] = useState({
    title: "",
    weapon_system_id: "",
    version: "1.0",
    security_classification: "UNCLASSIFIED",
    description: "",
  });

  // Export & Passkey
  const [exportId, setExportId] = useState(null);
  const [passkey, setPasskey] = useState("");

  // Audit Filters
  const [auditUserFilter, setAuditUserFilter] = useState("ALL");
  const [auditActionFilter, setAuditActionFilter] = useState("ALL");
  const [auditFromDate, setAuditFromDate] = useState("");
  const [auditToDate, setAuditToDate] = useState("");

  // Reports Generator State
  const [reportUser, setReportUser] = useState("ALL");
  const [reportFromDate, setReportFromDate] = useState("");
  const [reportToDate, setReportToDate] = useState("");
  const [generatedReport, setGeneratedReport] = useState(null);

  // Customer Package Generator Modal State (Zero-Code Distribution)
  const [showCustomerPackageModal, setShowCustomerPackageModal] =
    useState(false);
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
        selectedManualIds:
          packSelectedManuals.length > 0 ? packSelectedManuals : null,
      });

      if (res?.success) {
        toast.success(`Client release generated: ${res.path}`, {
          duration: 6000,
        });
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

  // Moderation Reply State
  const [replyAnnotationId, setReplyAnnotationId] = useState(null);
  const [replyText, setReplyText] = useState("");

  // New Suggestion State
  const [newKeyword, setNewKeyword] = useState("");
  const [newKeywordCategory, setNewKeywordCategory] = useState("General");

  const loadData = async () => {
    try {
      const u = (await window.api.getUsers?.()) || [];
      const m =
        (await window.api.getManuals?.({
          userId: user?.id,
          role: user?.role,
        })) || [];
      const a = (await window.api.getAudits?.()) || [];
      const annot = (await window.api.getAllAnnotations?.()) || [];
      const sugg = (await window.api.getSearchSuggestions?.("")) || [];
      const sett = (await window.api.getSettings?.()) || {};

      setUsers(u);
      setManuals(m);
      setAudits(a);
      setAnnotations(annot);
      setSuggestions(sugg);
      setSettings(sett);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 1. User Handlers
  const handleCreateUser = async () => {
    const trimmedUsername = newUser.username?.trim();
    const trimmedPassword = newUser.password?.trim();

    if (!trimmedUsername || !trimmedPassword) {
      return toast.error("Username and password are required.");
    }
    if (trimmedUsername.length < 3) {
      return toast.error("Username must be at least 3 characters.");
    }
    if (trimmedPassword.length < 4) {
      return toast.error("Password must be at least 4 characters.");
    }

    const res = await window.api.createUser({
      username: trimmedUsername,
      password: trimmedPassword,
      role: newUser.role || "operator",
      accessLevel: parseInt(newUser.accessLevel) || 1,
      unitCode: newUser.unitCode || "FIELD-UNIT",
    });

    if (res?.success) {
      toast.success(`User "${trimmedUsername}" created.`);
      loadData();
      setNewUser({
        username: "",
        password: "",
        role: "operator",
        accessLevel: 1,
        unitCode: "HQ-01",
      });
    } else {
      toast.error(res?.message || "Failed to create user.");
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    const res = await window.api.updateUser?.({
      id: editingUser.id,
      username: editingUser.username,
      role: editingUser.role,
      accessLevel: editingUser.accessLevel || editingUser.access_level || 1,
      unitCode: editingUser.unitCode || editingUser.unit_code || "GEN-DEF",
      password: editingUser.password,
    });
    if (res?.success) {
      toast.success("User updated successfully");
      setEditingUser(null);
      loadData();
    } else {
      toast.error(res?.message || "Update failed");
    }
  };

  const handleUnlockUser = async (targetUser) => {
    const res = await window.api.unlockUser?.(targetUser.id);
    if (res?.success) {
      toast.success(`User "${targetUser.username}" unlocked successfully.`);
      loadData();
    } else {
      toast.error(res?.message || "Failed to unlock user.");
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (targetUser.id === user?.id) {
      return toast.error(
        "You cannot delete your own active administrator account.",
      );
    }
    if (
      window.confirm(
        `Permanently delete operator account "${targetUser.username}"?`,
      )
    ) {
      const res = await window.api.deleteUser?.(targetUser.id);
      if (res?.success) {
        toast.success(`User "${targetUser.username}" deleted.`);
        loadData();
      } else {
        toast.error("Delete failed: " + (res?.message || "Unknown error"));
      }
    }
  };

  // 2. Manual Handlers
  const handleCreateManual = async () => {
    if (!newManual.title || !newManual.weapon_system_id) {
      return toast.error("Title and Weapon System ID are required.");
    }

    const res = await window.api.createManual({
      ...newManual,
      userId: user?.id,
    });
    if (res?.success) {
      loadData();
      setNewManual({
        title: "",
        weapon_system_id: "",
        version: "1.0",
        security_classification: "UNCLASSIFIED",
        description: "",
      });
      toast.success("Weapon System Module Registered");
    } else {
      toast.error("Error: " + (res?.message || "Creation failed"));
    }
  };

  const submitExport = async () => {
    if (!passkey) return toast.error("Passkey required for AES-256 encryption");
    const res = await window.api.exportManual({ manualId: exportId, passkey });
    setExportId(null);
    if (res?.success) toast.success("Encrypted export archive: " + res.path);
    else toast.error("Failed: " + (res?.message || "Export error"));
  };

  const handleDeleteManual = async (id) => {
    if (
      window.confirm(
        "CRITICAL: Destroy weapon system manual and all associated data modules?",
      )
    ) {
      await window.api.deleteManual(id);
      loadData();
      toast.success("Manual expunged.");
    }
  };

  // 3. Backup & Restore Handlers
  const handleBackup = async () => {
    const res = await window.api.createBackup?.();
    if (res?.success)
      toast.success("Encrypted system snapshot created: " + res.path);
    else toast.error("Backup failed: " + (res?.message || "Error"));
  };

  const handleRestore = async () => {
    if (
      window.confirm(
        "CRITICAL WARNING: Restoring the system database will overwrite existing records. Proceed?",
      )
    ) {
      const res = await window.api.restoreBackup?.();
      if (res?.success) {
        toast.success("Database restored successfully! Reloading data...");
        loadData();
      } else {
        toast.error(res?.message || "Restore cancelled or failed.");
      }
    }
  };

  // 4. Annotation Moderation & Replies
  const handleModerateAnnotation = async (id, status) => {
    const res = await window.api.moderateAnnotation?.({ id, status });
    if (res?.success) {
      toast.success(`Annotation marked as ${status.toUpperCase()}`);
      loadData();
    }
  };

  const handleSendReply = async (annotationId) => {
    if (!replyText.trim()) return;
    const res = await window.api.replyAnnotation?.({
      annotationId,
      userId: user?.id,
      replyText: replyText.trim(),
    });
    if (res?.success) {
      toast.success("Official reply dispatched to operator");
      setReplyText("");
      setReplyAnnotationId(null);
      loadData();
    }
  };

  // 5. Consolidated Reports Generator
  const handleGenerateReport = async () => {
    const res = await window.api.getConsolidatedReport?.({
      userId: reportUser,
      fromDate: reportFromDate,
      toDate: reportToDate,
    });
    if (res?.success) {
      setGeneratedReport(res);
      toast.success("Consolidated report generated");
    }
  };

  const handleExportAuditCsv = () => {
    if (!filteredAudits || filteredAudits.length === 0) {
      return toast.error("No audit logs available to export");
    }
    const headers = [
      "ID",
      "Timestamp",
      "User ID",
      "Username",
      "Role",
      "Action",
      "Target Details",
      "IP Address",
    ];
    const rows = filteredAudits.map((a) => [
      a.id,
      '"' + (a.timestamp || a.created_at || "") + '"',
      a.user_id,
      '"' + (a.username || "System") + '"',
      '"' + (a.role || "N/A") + '"',
      '"' + (a.action || "") + '"',
      '"' + (a.target || "").replace(/"/g, '""') + '"',
      '"' + (a.ip_address || "127.0.0.1") + '"',
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      "IETM_AUDIT_LOGS_" + new Date().toISOString().slice(0, 10) + ".csv",
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(
      "Exported " + filteredAudits.length + " audit records to CSV",
    );
  };

  // 6. Settings Handler
  const handleSaveSettings = async () => {
    const res = await window.api.saveSettings?.(settings);
    if (res?.success) {
      toast.success("OEM System Configuration Committed");
      loadData();
    } else {
      toast.error("Save failed");
    }
  };

  // 7. Search Suggestions Handler
  const handleAddSuggestion = async () => {
    if (!newKeyword.trim()) return;
    const res = await window.api.addSearchSuggestion?.({
      keyword: newKeyword.trim(),
      category: newKeywordCategory,
    });
    if (res?.success) {
      toast.success("Suggestion index updated");
      setNewKeyword("");
      loadData();
    }
  };

  const handleDeleteSuggestion = async (id) => {
    await window.api.deleteSearchSuggestion?.(id);
    toast.success("Suggestion removed");
    loadData();
  };

  // Routing to Authoring Editor or Logistics
  if (editingManualId) {
    return (
      <Editor
        manualId={editingManualId}
        onBack={() => setEditingManualId(null)}
      />
    );
  }

  if (viewLogistics) {
    return <InventoryManager onBack={() => setViewLogistics(false)} />;
  }

  // Filtered audits
  const filteredAudits = audits.filter((a) => {
    const matchesUser =
      auditUserFilter === "ALL" ||
      String(a.user_id) === String(auditUserFilter);
    const matchesAction =
      auditActionFilter === "ALL" || a.action === auditActionFilter;
    const timestamp = a.timestamp || "";
    const matchesFrom =
      !auditFromDate || timestamp >= auditFromDate + " 00:00:00";
    const matchesTo = !auditToDate || timestamp <= auditToDate + " 23:59:59";
    return matchesUser && matchesAction && matchesFrom && matchesTo;
  });

  return (
    <div className="min-h-full bg-vector-bg p-8 text-vector-text space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-lg text-sky-400">
              <ShieldAlert size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  JSG 0852 Level-4
                </span>
                <span className="text-xs text-slate-400">OEM Command Portal</span>
              </div>
              <h1 className="text-xl font-bold tracking-wide text-white mt-0.5">
                Admin &amp; Mission Engineering Control Center
              </h1>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onSwitchToViewer && (
            <button
              onClick={onSwitchToViewer}
              className="rounded-lg bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 text-xs font-semibold tracking-wide transition-all flex items-center gap-2 shadow-sm"
            >
              <Eye size={15} /> View Technical Manuals
            </button>
          )}
          <button
            onClick={() => setViewLogistics(true)}
            className="rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 px-4 py-2 text-xs font-semibold tracking-wide text-slate-200 hover:text-white flex items-center gap-2 transition-colors"
          >
            <Box size={15} /> Global Logistics
          </button>
          {user?.role === "superadmin" && (
            <button
              onClick={() => {
                setPackSelectedManuals(manuals.map((m) => m.id));
                setShowCustomerPackageModal(true);
              }}
              className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold tracking-wide text-white flex items-center gap-2 transition-all shadow-sm"
              title="Generate a clean, customized release database for a specific client company"
            >
              <PackageCheck size={15} /> Export Client Release
            </button>
          )}
          <button
            onClick={handleBackup}
            className="rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-sky-500/40 px-4 py-2 text-xs font-semibold tracking-wide text-sky-300 flex items-center gap-2 transition-colors"
          >
            <Database size={15} /> AES-256 Backup
          </button>
          <button
            onClick={handleRestore}
            className="rounded-lg bg-amber-600/15 hover:bg-amber-600/25 border border-amber-500/40 px-4 py-2 text-xs font-semibold tracking-wide text-amber-300 flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={15} /> Restore System
          </button>
        </div>
      </div>

      {/* Navigation Tab Strip */}
      <div className="flex border border-slate-800/80 bg-slate-900/90 p-1.5 rounded-xl overflow-x-auto gap-1.5 shadow-inner">
        {[
          {
            id: "users",
            label: "User Administration",
            icon: <Users size={14} />,
          },
          {
            id: "manuals",
            label: "Weapon Systems (OEM)",
            icon: <ShieldAlert size={14} />,
          },
          {
            id: "audits",
            label: "Forensic Audit Trail",
            icon: <Activity size={14} />,
          },
          {
            id: "moderation",
            label: `Annotation Moderation (${annotations.filter((a) => a.status === "pending").length})`,
            icon: <MessageSquare size={14} />,
          },
          {
            id: "reports",
            label: "Consolidated Reports",
            icon: <FileText size={14} />,
          },
          {
            id: "settings",
            label: "OEM System Configuration",
            icon: <Settings size={14} />,
          },
          {
            id: "suggestions",
            label: "Search Suggestions Index",
            icon: <Sparkles size={14} />,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-sky-600 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* --- TAB 1: USER MANAGEMENT --- */}
      {activeTab === "users" && (
        <div className="space-y-6">
          {/* Add User Card */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-md backdrop-blur-sm">
            <h3 className="mb-4 text-sm font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <Users size={16} /> Register New Operator / Maintainer Account
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <input
                placeholder="Username (e.g. operator2)"
                className="md:col-span-3 rounded-lg bg-slate-950/70 border border-slate-700/80 p-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono transition-colors"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
              />
              <input
                placeholder="Password"
                type="password"
                className="md:col-span-3 rounded-lg bg-slate-950/70 border border-slate-700/80 p-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono transition-colors"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />
              <select
                className="md:col-span-2 rounded-lg bg-slate-950/70 border border-slate-700/80 p-2.5 text-xs text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 uppercase transition-colors"
                value={newUser.role}
                onChange={(e) => {
                  const role = e.target.value;
                  const level =
                    role === "superadmin" || role === "admin"
                      ? 3
                      : role === "maintainer"
                        ? 2
                        : 1;
                  setNewUser({ ...newUser, role, accessLevel: level });
                }}
              >
                <option value="operator">Operator (L1)</option>
                <option value="maintainer">Maintainer (L2)</option>
                <option value="admin">Administrator (L3)</option>
                <option value="superadmin">Super Admin (OEM)</option>
              </select>
              <input
                placeholder="Unit Code (e.g. FIELD-BRIGADE)"
                className="md:col-span-2 rounded-lg bg-slate-950/70 border border-slate-700/80 p-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono transition-colors"
                value={newUser.unitCode}
                onChange={(e) =>
                  setNewUser({ ...newUser, unitCode: e.target.value })
                }
              />
              <button
                onClick={handleCreateUser}
                className="md:col-span-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <PlusCircle size={15} /> Create User
              </button>
            </div>
          </div>

          {/* User Accounts Table */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-md backdrop-blur-sm">
            <h3 className="mb-4 text-sm font-semibold text-slate-200 uppercase tracking-wider flex justify-between items-center">
              <span>Authorized Defense User Registry</span>
              <span className="text-xs text-sky-400 font-mono">
                {users.length} Users Enrolled
              </span>
            </h3>

            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-[11px] tracking-wider uppercase text-slate-400 font-medium">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Username</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Access Level</th>
                    <th className="px-4 py-3">Unit Code</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {users.map((u) => {
                    const isLocked =
                      u.locked_until && new Date(u.locked_until) > new Date();
                    return (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="px-4 py-3 font-mono text-slate-500">
                          #{u.id}
                        </td>
                        <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                          <span className="font-mono">{u.username}</span>
                          {u.id === user?.id && (
                            <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 border border-sky-500/30 px-1.5 py-0.2 rounded-full">
                              YOU
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] uppercase font-mono font-medium border ${
                              u.role === "superadmin"
                                ? "bg-purple-900/30 text-purple-300 border-purple-500/40"
                                : u.role === "admin"
                                  ? "bg-sky-900/30 text-sky-300 border-sky-500/40"
                                  : u.role === "maintainer"
                                    ? "bg-amber-900/30 text-amber-300 border-amber-500/40"
                                    : "bg-slate-800 text-slate-300 border-slate-700"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-300">
                          Level {u.access_level} (
                          {u.access_level === 3
                            ? "Secret"
                            : u.access_level === 2
                              ? "Restricted"
                              : "Unclassified"}
                          )
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-400">
                          {u.unit_code || "GEN-DEF"}
                        </td>
                        <td className="px-4 py-3">
                          {isLocked ? (
                            <span className="inline-flex items-center gap-1 text-rose-400 font-medium px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-[11px]">
                              🔒 Locked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            {isLocked && (
                              <button
                                onClick={() => handleUnlockUser(u)}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/40 hover:bg-amber-500/25 transition-colors"
                                title="Reset failed attempts & unlock account"
                              >
                                Unlock
                              </button>
                            )}
                            <button
                              onClick={() => setEditingUser(u)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-colors"
                              title="Edit user parameters"
                            >
                              <Edit3 size={15} />
                            </button>
                            {u.id !== user?.id && (
                              <button
                                onClick={() => handleDeleteUser(u)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                title="Delete user"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: WEAPON SYSTEMS (MODULES) --- */}
      {activeTab === "manuals" && (
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-800 bg-vector-panel p-6 shadow-md">
            <h3 className="mb-4 text-sm font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert size={16} /> Register New Weapon System / Technical Manual
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Manual Title
                </label>
                <input
                  placeholder="e.g. SSS DEFENCE G72-SMG Technical Manual"
                  className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                  value={newManual.title}
                  onChange={(e) =>
                    setNewManual({ ...newManual, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Weapon System Code
                </label>
                <input
                  placeholder="e.g. G72-SMG"
                  className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2.5 text-xs font-mono text-slate-100 placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                  value={newManual.weapon_system_id}
                  onChange={(e) =>
                    setNewManual({
                      ...newManual,
                      weapon_system_id: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Security Classification
                </label>
                <select
                  className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2.5 text-xs text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                  value={newManual.security_classification}
                  onChange={(e) =>
                    setNewManual({
                      ...newManual,
                      security_classification: e.target.value,
                    })
                  }
                >
                  <option value="UNCLASSIFIED">UNCLASSIFIED</option>
                  <option value="RESTRICTED">RESTRICTED</option>
                  <option value="SECRET">SECRET</option>
                </select>
              </div>
              <div className="md:col-span-4 flex justify-end">
                <button
                  onClick={handleCreateManual}
                  className="rounded-lg bg-sky-600 hover:bg-sky-500 py-2.5 px-6 text-xs font-semibold text-white flex items-center gap-2 transition-all shadow-sm"
                >
                  <PlusCircle size={15} /> Create System Manual
                </button>
              </div>
            </div>
          </div>

          {/* List of Manuals */}
          <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/60 shadow-md">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-[11px] tracking-wider uppercase text-slate-400 font-medium">
                <tr>
                  <th className="px-4 py-3">System ID</th>
                  <th className="px-4 py-3">Weapon System Code</th>
                  <th className="px-4 py-3">Manual Title</th>
                  <th className="px-4 py-3">Security Level</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {manuals.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-xs">
                      No technical manuals registered. Register a manual above or import an encrypted package from the Mission Dashboard.
                    </td>
                  </tr>
                )}
                {manuals.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-slate-500">
                      #{m.id}
                    </td>
                    <td className="px-4 py-3 font-mono text-sky-400 font-bold">
                      {m.weapon_system_id}
                    </td>
                    <td className="px-4 py-3 font-medium text-white">
                      {m.title}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border ${
                        m.security_classification === "SECRET"
                          ? "bg-rose-900/30 text-rose-300 border-rose-500/40"
                          : m.security_classification === "RESTRICTED"
                            ? "bg-amber-900/30 text-amber-300 border-amber-500/40"
                            : "bg-slate-800 text-slate-300 border-slate-700"
                      }`}>
                        {m.security_classification}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {user?.role === "superadmin" ? (
                          <>
                            <button
                              onClick={() => setEditingManualId(m.id)}
                              className="px-3 py-1.5 rounded-lg bg-sky-500/15 border border-sky-500/40 text-sky-300 hover:bg-sky-500 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
                            >
                              <Edit3 size={13} /> Author Content
                            </button>
                            <button
                              onClick={() => {
                                setExportId(m.id);
                                setPasskey("");
                              }}
                              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
                              title="Export encrypted manual"
                            >
                              <Download size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteManual(m.id)}
                              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/15 text-slate-300 hover:text-rose-400 transition-colors"
                              title="Expunge record"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[11px] font-mono">
                              🔒 OEM Verified (Read-Only)
                            </span>
                            <button
                              onClick={() => {
                                setExportId(m.id);
                                setPasskey("");
                              }}
                              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
                              title="Export encrypted manual backup"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 3: FORENSIC AUDIT TRAIL --- */}
      {activeTab === "audits" && (
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-md space-y-5 backdrop-blur-sm">
          <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">
                <Activity size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
                  Forensic Compliance Audit Trail (C1-C8)
                </h3>
                <p className="text-xs text-slate-400">
                  Cryptographically verified system and operator events
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">
                Showing {filteredAudits.length} of {audits.length} Events
              </span>
              <button
                onClick={handleExportAuditCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 rounded-lg text-xs font-medium transition-colors"
                title="Export Filtered Audit Trail to CSV"
              >
                <Download size={13} /> Export CSV
              </button>
            </div>
          </div>

          {/* Audit Filters Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Filter by User
              </label>
              <select
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-100 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                value={auditUserFilter}
                onChange={(e) => setAuditUserFilter(e.target.value)}
              >
                <option value="ALL">All Operators</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username} ({u.role})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Filter by Action
              </label>
              <select
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-100 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                value={auditActionFilter}
                onChange={(e) => setAuditActionFilter(e.target.value)}
              >
                <option value="ALL">All Actions</option>
                <option value="SESSION_START">SESSION_START</option>
                <option value="VIEW_MODULE">VIEW_MODULE</option>
                <option value="PRINT_PROCEDURE">PRINT_PROCEDURE</option>
                <option value="CREATE_ANNOTATION">CREATE_ANNOTATION</option>
                <option value="PIN_BOOKMARK">PIN_BOOKMARK</option>
                <option value="SECURITY_LOCKOUT">SECURITY_LOCKOUT</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                From Date
              </label>
              <input
                type="date"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-100 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono transition-colors"
                value={auditFromDate}
                onChange={(e) => setAuditFromDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                To Date
              </label>
              <input
                type="date"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-100 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono transition-colors"
                value={auditToDate}
                onChange={(e) => setAuditToDate(e.target.value)}
              />
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800/80 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/90 sticky top-0 text-[11px] tracking-wider uppercase text-slate-400 font-medium z-10">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Operator</th>
                  <th className="px-4 py-3">Action Event</th>
                  <th className="px-4 py-3">Target Detail</th>
                  <th className="px-4 py-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {filteredAudits.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs font-mono text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-mono text-sky-400 font-medium">
                      {log.username || `User #${log.user_id}`}
                    </td>
                    <td className="px-4 py-3 text-[11px] font-mono font-medium tracking-wide text-purple-300 uppercase">
                      {log.action}
                    </td>
                    <td className="px-4 py-3 text-slate-200 truncate max-w-md">
                      {log.target}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                      {log.ip_address || "127.0.0.1"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 4: ANNOTATION MODERATION & REPLIES (A10) --- */}
      {activeTab === "moderation" && (
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-md space-y-5 backdrop-blur-sm">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-lg text-sky-400">
                <MessageSquare size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wider">
                  Field Observation &amp; Annotation Moderation (A10)
                </h3>
                <p className="text-xs text-slate-400">
                  Review and approve operator feedback notes from active mission units
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {annotations.length} Field Submissions Recorded
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800/80">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-[11px] tracking-wider uppercase text-slate-400 font-medium">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Operator</th>
                  <th className="px-4 py-3">Module Context</th>
                  <th className="px-4 py-3">Observation Note</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {annotations.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs font-mono text-slate-400 whitespace-nowrap">
                      {new Date(a.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-white">
                      {a.username}
                    </td>
                    <td className="px-4 py-3 text-sky-300 font-medium">
                      {a.module_title || `Module #${a.module_id}`}
                    </td>
                    <td className="px-4 py-3 text-slate-200 max-w-sm truncate">
                      {a.text}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-mono bg-slate-800 border border-slate-700 text-slate-300">
                        {a.is_private ? "Self / Private" : "To Admin"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase border ${
                          a.status === "approved"
                            ? "bg-emerald-900/30 text-emerald-300 border-emerald-500/40"
                            : a.status === "rejected"
                              ? "bg-rose-900/30 text-rose-300 border-rose-500/40"
                              : "bg-amber-900/30 text-amber-300 border-amber-500/40"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() =>
                            handleModerateAnnotation(a.id, "approved")
                          }
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-xs font-medium transition-colors"
                          title="Approve note for inclusion"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleModerateAnnotation(a.id, "rejected")
                          }
                          className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/30 text-xs font-medium transition-colors"
                          title="Reject note"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            setReplyAnnotationId(a.id);
                            setReplyText("");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-300 hover:bg-sky-500 hover:text-white border border-sky-500/30 text-xs font-medium transition-colors"
                          title="Dispatch reply"
                        >
                          Reply
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {annotations.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="p-8 text-center italic text-slate-500"
                    >
                      No field annotations submitted for review.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Reply Modal */}
          {replyAnnotationId && (
            <div className="p-5 bg-slate-950/80 border border-sky-500/40 rounded-xl space-y-3">
              <h4 className="text-xs font-semibold text-sky-300 uppercase tracking-wider">
                Dispatch Engineering Reply to Operator Note #{replyAnnotationId}
              </h4>
              <textarea
                rows="3"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type official reply instructions..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
              />
              <div className="flex justify-end gap-2.5">
                <button
                  onClick={() => setReplyAnnotationId(null)}
                  className="px-4 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSendReply(replyAnnotationId)}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
                >
                  Dispatch Reply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* --- TAB 5: CONSOLIDATED REPORTS (A8, A9) --- */}
      {activeTab === "reports" && (
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-md space-y-6 backdrop-blur-sm">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-lg text-sky-400">
                <FileText size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wider">
                  Consolidated Activity &amp; Forensics Report Generator (A8, A9)
                </h3>
                <p className="text-xs text-slate-400">
                  Generate formal compliance reports with audit logs and field notes
                </p>
              </div>
            </div>
            {generatedReport && (
              <button
                onClick={() => window.print()}
                className="rounded-lg bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 text-xs font-semibold tracking-wide flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Printer size={14} /> Print Report
              </button>
            )}
          </div>

          {/* Report Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Select Operator
              </label>
              <select
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                value={reportUser}
                onChange={(e) => setReportUser(e.target.value)}
              >
                <option value="ALL">All Users Combined</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username} ({u.role})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                From Date
              </label>
              <input
                type="date"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 font-mono outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                value={reportFromDate}
                onChange={(e) => setReportFromDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                To Date
              </label>
              <input
                type="date"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 font-mono outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                value={reportToDate}
                onChange={(e) => setReportToDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleGenerateReport}
                className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold p-2.5 text-xs tracking-wide rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <FileText size={14} /> Generate Report
              </button>
            </div>
          </div>

          {/* Generated Printable Report View */}
          {generatedReport && (
            <div className="border border-slate-700/80 rounded-xl p-8 bg-slate-950/90 print:bg-white print:text-black print:p-0 print:border-none space-y-6 shadow-xl">
              {/* Report Header */}
              <div className="border-b-2 border-sky-500 print:border-black pb-4 text-center">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-rose-400 font-bold block mb-1">
                  CONFIDENTIAL DEFENCE TECHNICAL DOCUMENT
                </span>
                <h2 className="text-xl font-bold uppercase tracking-wider text-white print:text-black">
                  CONSOLIDATED IETM LEVEL-4 AUDIT &amp; OBSERVATION REPORT
                </h2>
                <div className="flex justify-between items-center text-xs font-mono text-slate-400 print:text-black mt-3">
                  <span>SYSTEM: SSS DEFENCE IETM v4.2.0</span>
                  <span>GENERATED: {new Date().toLocaleString()}</span>
                  <span>
                    OPERATOR: {user?.username} ({user?.role?.toUpperCase()})
                  </span>
                </div>
              </div>

              {/* Summary Metrics */}
              <div className="grid grid-cols-3 gap-4 font-mono">
                <div className="p-4 bg-slate-900/80 print:border print:border-black rounded-xl border border-slate-800 text-center">
                  <div className="text-2xl font-bold text-sky-400 print:text-black">
                    {generatedReport.audits?.length || 0}
                  </div>
                  <div className="text-[11px] text-slate-400 uppercase mt-1">
                    Total Activity Events
                  </div>
                </div>
                <div className="p-4 bg-slate-900/80 print:border print:border-black rounded-xl border border-slate-800 text-center">
                  <div className="text-2xl font-bold text-purple-400 print:text-black">
                    {generatedReport.annotations?.length || 0}
                  </div>
                  <div className="text-[11px] text-slate-400 uppercase mt-1">
                    Field Annotations Logged
                  </div>
                </div>
                <div className="p-4 bg-slate-900/80 print:border print:border-black rounded-xl border border-slate-800 text-center">
                  <div className="text-2xl font-bold text-emerald-400 print:text-black">
                    {generatedReport.audits?.filter(
                      (a) => a.action === "PRINT_PROCEDURE",
                    ).length || 0}
                  </div>
                  <div className="text-[11px] text-slate-400 uppercase mt-1">
                    Procedures Printed
                  </div>
                </div>
              </div>

              {/* Activity Table */}
              <div>
                <h4 className="font-mono text-xs uppercase font-bold text-sky-400 print:text-black mb-2">
                  1. Activity Logs Breakdown
                </h4>
                <table className="w-full text-left text-xs text-slate-300 print:text-black border border-slate-800 print:border-black rounded-lg overflow-hidden">
                  <thead className="bg-slate-800 print:bg-gray-200 text-[10px] font-mono uppercase text-slate-400">
                    <tr>
                      <th className="p-2.5">Timestamp</th>
                      <th className="p-2.5">Operator</th>
                      <th className="p-2.5">Event Action</th>
                      <th className="p-2.5">Target / Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 print:divide-black">
                    {generatedReport.audits?.slice(0, 50).map((a) => (
                      <tr key={a.id}>
                        <td className="p-2.5 font-mono text-[11px] text-slate-400">
                          {new Date(a.timestamp).toLocaleString()}
                        </td>
                        <td className="p-2.5 font-mono font-medium text-white">
                          {a.username || a.user_id}
                        </td>
                        <td className="p-2.5 font-mono text-[10px] uppercase text-purple-300 print:text-black">
                          {a.action}
                        </td>
                        <td className="p-2.5 truncate max-w-md text-slate-200">{a.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Annotations Section */}
              <div>
                <h4 className="font-mono text-xs uppercase font-bold text-sky-400 print:text-black mb-2">
                  2. Technical Notes &amp; Engineering Feedback
                </h4>
                <table className="w-full text-left text-xs text-slate-300 print:text-black border border-slate-800 print:border-black rounded-lg overflow-hidden">
                  <thead className="bg-slate-800 print:bg-gray-200 text-[10px] font-mono uppercase text-slate-400">
                    <tr>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Operator</th>
                      <th className="p-2.5">Module Title</th>
                      <th className="p-2.5">Note Content</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 print:divide-black">
                    {generatedReport.annotations?.map((a) => (
                      <tr key={a.id}>
                        <td className="p-2.5 font-mono text-[11px] text-slate-400">
                          {new Date(a.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-2.5 font-mono font-medium text-white">
                          {a.username}
                        </td>
                        <td className="p-2.5 text-sky-300">{a.module_title}</td>
                        <td className="p-2.5 text-slate-200">{a.text}</td>
                        <td className="p-2.5 uppercase font-mono font-semibold text-[10px]">
                          {a.status}
                        </td>
                      </tr>
                    ))}
                    {generatedReport.annotations?.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-4 text-center italic text-slate-500"
                        >
                          No notes in selected window.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Report Footer */}
              <div className="border-t border-slate-800 print:border-black pt-4 flex justify-between text-xs font-mono text-slate-400 print:text-black">
                <span>OFFICIAL QA CERTIFICATION COMPLIANT WITH JSG 0852</span>
                <span>
                  AUTHENTICATED STAMP: {user?.unit_code || "HQ-DEFENCE"}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 6: OEM SYSTEM CONFIGURATION (A15, O11) --- */}
      {activeTab === "settings" && (
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-md space-y-6 backdrop-blur-sm">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-lg text-sky-400">
                <Settings size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wider">
                  Dynamic OEM Branding &amp; System Configuration (A15, O11)
                </h3>
                <p className="text-xs text-slate-400">
                  Global parameters, timeout limits, and defense security profiles
                </p>
              </div>
            </div>
            <button
              onClick={handleSaveSettings}
              className="rounded-lg bg-sky-600 hover:bg-sky-500 text-white px-5 py-2 text-xs font-semibold tracking-wide transition-all shadow-sm"
            >
              Commit Configuration
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/60 p-6 rounded-xl border border-slate-800 font-sans">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Application Title
              </label>
              <input
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2.5 text-xs text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                value={settings.app_title || ""}
                onChange={(e) =>
                  setSettings({ ...settings, app_title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Client / OEM Logo URL
              </label>
              <input
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2.5 text-xs text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                value={settings.client_logo || ""}
                onChange={(e) =>
                  setSettings({ ...settings, client_logo: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Inactivity Idle Timeout (Minutes)
              </label>
              <input
                type="number"
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2.5 text-xs text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors font-mono"
                value={settings.idle_timeout_minutes || "15"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    idle_timeout_minutes: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Multi-User Concurrent Login Eviction
              </label>
              <select
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2.5 text-xs text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors uppercase"
                value={settings.multi_user_detect || "true"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    multi_user_detect: e.target.value,
                  })
                }
              >
                <option value="true">
                  Enabled (Auto Evict Alternate Logins)
                </option>
                <option value="false">
                  Disabled (Allow Concurrent Sessions)
                </option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Default Application Theme
              </label>
              <select
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2.5 text-xs text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors uppercase"
                value={settings.theme || "dark"}
                onChange={(e) =>
                  setSettings({ ...settings, theme: e.target.value })
                }
              >
                <option value="dark">Tactical Dark</option>
                <option value="light">Day Light</option>
                <option value="olive">Tactical Military Olive</option>
                <option value="navy">High Contrast Navy</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Software Version String
              </label>
              <input
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2.5 text-xs text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono transition-colors"
                value={
                  settings.software_version || "v4.2.0 (Level 4 S1000D Rev 5.0)"
                }
                onChange={(e) =>
                  setSettings({ ...settings, software_version: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Copyright Notice &amp; Legal Disclaimer
              </label>
              <input
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2.5 text-xs text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                value={settings.copyright_text || ""}
                onChange={(e) =>
                  setSettings({ ...settings, copyright_text: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Hardcopy Forensic Print Watermark Text
              </label>
              <input
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2.5 text-xs text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                value={
                  settings.print_watermark_text ||
                  "RESTRICTED DEFENCE PROPERTY - SSS DEFENCE"
                }
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    print_watermark_text: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 7: SEARCH SUGGESTIONS MANAGER (A13, O7) --- */}
      {activeTab === "suggestions" && (
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-md space-y-6 backdrop-blur-sm">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-lg text-sky-400">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wider">
                  Smart Auto-Complete &amp; Suggestion Feed Index (A13, O7)
                </h3>
                <p className="text-xs text-slate-400">
                  Global query suggestions mapped for instant technician search
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {suggestions.length} Keywords Mapped
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <input
              placeholder="Keyword (e.g. Muzzle Brake, Torque Spec, Fail to Extract)"
              className="md:col-span-6 bg-slate-900 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
            />
            <select
              className="md:col-span-3 bg-slate-900 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
              value={newKeywordCategory}
              onChange={(e) => setNewKeywordCategory(e.target.value)}
            >
              <option value="General">General</option>
              <option value="Parts">Parts &amp; Assemblies</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Troubleshooting">Troubleshooting</option>
              <option value="Safety">Safety &amp; Warnings</option>
              <option value="Procedures">Procedures</option>
            </select>
            <button
              onClick={handleAddSuggestion}
              className="md:col-span-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold p-2.5 text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <PlusCircle size={15} /> Add Keyword
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800/80">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-[11px] tracking-wider uppercase text-slate-400 font-medium">
                <tr>
                  <th className="px-4 py-3">Keyword</th>
                  <th className="px-4 py-3">Category Tag</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {suggestions.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-white">
                      {s.keyword}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-medium bg-slate-800 border border-slate-700 text-sky-300">
                        {s.category || "General"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteSuggestion(s.id)}
                        className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Delete suggestion"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* <!-- Customer Package Generator Modal --> */}
      {showCustomerPackageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-[560px] max-w-full rounded-2xl bg-slate-900 border border-emerald-500/40 p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                  <PackageCheck size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-emerald-400">
                    Export Customer Delivery Package
                  </h3>
                  <p className="text-xs text-slate-400">Clean client release generation</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                JSG 0852 LEVEL-4
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Generate a clean, encrypted database customized for a client
              company. Internal test accounts and audit logs will be stripped
              automatically.
            </p>

            <form
              onSubmit={handleGenerateCustomerPackage}
              className="space-y-3.5"
            >
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Company / Client Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HAL-NASHIK, TATA-DEFENCE, ARMY-CORPS-IV"
                  value={packCompanyName}
                  onChange={(e) => setPackCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <label className="text-xs text-emerald-400 block mb-1 font-semibold">
                    Client Operator Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. hal_tech01"
                    value={packOpUser}
                    onChange={(e) => setPackOpUser(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-emerald-400 block mb-1 font-semibold">
                    Initial Password
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hal#Pass2026!"
                    value={packOpPass}
                    onChange={(e) => setPackOpPass(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <label className="text-xs text-sky-400 block mb-1 font-semibold">
                    Client Admin Username (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. hal_admin (optional)"
                    value={packAdminUser}
                    onChange={(e) => setPackAdminUser(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-sky-400 block mb-1 font-semibold">
                    Admin Password (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Optional admin password"
                    value={packAdminPass}
                    onChange={(e) => setPackAdminPass(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Select Manuals to Include
                </label>
                <div className="max-h-32 overflow-y-auto space-y-1.5 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-xs">
                  {manuals.map((m) => (
                    <label
                      key={m.id}
                      className="flex items-center gap-2.5 text-slate-300 hover:text-white cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={packSelectedManuals.includes(m.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPackSelectedManuals([
                              ...packSelectedManuals,
                              m.id,
                            ]);
                          } else {
                            setPackSelectedManuals(
                              packSelectedManuals.filter((id) => id !== m.id),
                            );
                          }
                        }}
                        className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                      />
                      <span className="font-medium">
                        #{m.id} - {m.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCustomerPackageModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPackaging}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg disabled:opacity-50 flex items-center gap-2 shadow-sm transition-all"
                >
                  <PackageCheck size={16} />
                  {isPackaging ? "Generating..." : "Generate Delivery DB"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-[460px] max-w-full rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl space-y-4 font-sans">
            <h3 className="text-base font-bold text-sky-400">
              Modify Operator: {editingUser.username}
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Role
              </label>
              <select
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 uppercase transition-colors"
                value={editingUser.role}
                onChange={(e) => {
                  const role = e.target.value;
                  const level =
                    role === "superadmin" || role === "admin"
                      ? 3
                      : role === "maintainer"
                        ? 2
                        : 1;
                  setEditingUser({ ...editingUser, role, accessLevel: level });
                }}
              >
                <option value="operator">Operator (Level 1)</option>
                <option value="maintainer">Maintainer (Level 2)</option>
                <option value="admin">Administrator (Level 3)</option>
                <option value="superadmin">Super Admin (Level 3 OEM)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Unit Code
              </label>
              <input
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 font-mono outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                value={editingUser.unit_code || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, unitCode: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Reset Password (Optional)
              </label>
              <input
                type="password"
                placeholder="Leave blank to preserve current"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-100 font-mono outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                value={editingUser.password || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, password: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {exportId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-[420px] max-w-full rounded-2xl bg-slate-900 border border-amber-500/40 p-6 shadow-2xl font-sans">
            <h3 className="text-base font-bold text-amber-400 mb-2 flex items-center gap-2">
              <Lock size={18} /> Encrypt Export Package
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Enter master passkey for AES-256 package encryption.
            </p>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full mb-6 rounded-lg bg-slate-950 border border-slate-700/80 p-3 text-slate-100 font-mono text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
            />
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setExportId(null)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Abort
              </button>
              <button
                onClick={submitExport}
                className="rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-2.5 font-semibold text-xs text-slate-950 transition-all shadow-sm"
              >
                Export Package
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
