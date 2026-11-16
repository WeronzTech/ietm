const fs = require('fs');

let code = fs.readFileSync('src/pages/AdminDashboard.jsx', 'utf8');

// 1. Add handleExportAuditCsv
const targetFunc = `    if (res?.success) {
      setGeneratedReport(res);
      toast.success("Consolidated report generated");
    }
  };`;

const replacementFunc = `    if (res?.success) {
      setGeneratedReport(res);
      toast.success("Consolidated report generated");
    }
  };

  const handleExportAuditCsv = () => {
    if (!filteredAudits || filteredAudits.length === 0) {
      return toast.error("No audit logs available to export");
    }
    const headers = ["ID", "Timestamp", "User ID", "Username", "Role", "Action", "Target Details", "IP Address"];
    const rows = filteredAudits.map((a) => [
      a.id,
      '"' + (a.timestamp || a.created_at || "") + '"',
      a.user_id,
      '"' + (a.username || "System") + '"',
      '"' + (a.role || "N/A") + '"',
      '"' + (a.action || "") + '"',
      '"' + (a.target || "").replace(/"/g, '""') + '"',
      '"' + (a.ip_address || "127.0.0.1") + '"'
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", 'IETM_AUDIT_LOGS_' + new Date().toISOString().slice(0, 10) + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported ' + filteredAudits.length + ' audit records to CSV');
  };`;

// 2. Add Export button in the header
const targetHeader = `<span className="text-xs font-mono text-gray-500">
              Showing {filteredAudits.length} of {audits.length} Events
            </span>
          </div>`;

const replacementHeader = `<div className="flex items-center gap-3">
              <span className="text-xs font-mono text-gray-500">
                Showing {filteredAudits.length} of {audits.length} Events
              </span>
              <button
                onClick={handleExportAuditCsv}
                className="flex items-center gap-1.5 px-3 py-1 bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500 rounded text-xs font-mono transition-colors"
                title="Export Filtered Audit Trail to CSV"
              >
                <Download size={13} /> Export CSV
              </button>
            </div>
          </div>`;

code = code.replace(/\r\n/g, '\n');
const newFuncCode = targetFunc.replace(/\r\n/g, '\n');
const newHeaderCode = targetHeader.replace(/\r\n/g, '\n');

if (code.includes(newFuncCode)) {
  code = code.replace(newFuncCode, replacementFunc.replace(/\r\n/g, '\n'));
  console.log('Successfully added handleExportAuditCsv!');
} else {
  console.error('Could not find targetFunc in AdminDashboard.jsx');
}

if (code.includes(newHeaderCode)) {
  code = code.replace(newHeaderCode, replacementHeader.replace(/\r\n/g, '\n'));
  console.log('Successfully added Export CSV button in header!');
} else {
  console.error('Could not find targetHeader in AdminDashboard.jsx');
}

fs.writeFileSync('src/pages/AdminDashboard.jsx', code, 'utf8');
console.log('Updated src/pages/AdminDashboard.jsx');

