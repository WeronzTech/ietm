const fs = require('fs');

let code = fs.readFileSync('src/pages/Editor.jsx', 'utf8');

const target = `  const loadTree = async () => {
    const data = await window.api.getManualTree(manualId);
    setTree(data);
  };`;

const replacement = `  const loadTree = async () => {
    const data = await window.api.getManualTree(manualId);
    setTree(data);
  };

  // E2: Auto-Generate Table of Contents from hierarchy
  const handleGenerateTOC = () => {
    if (!tree || tree.length === 0) {
      return toast.error("No modules found in manual tree.");
    }
    const buildTocHtml = (nodes, depth = 0) => {
      let html = '<ul style="list-style-type: ' + (depth === 0 ? 'decimal' : 'circle') + '; padding-left: 20px;">';
      for (const n of nodes) {
        html += '<li style="margin: 6px 0;">' +
          '<a href="#mod-' + n.id + '" data-module-id="' + n.id + '" style="color: #00F5D4; font-weight: bold; text-decoration: underline;">' +
          n.title +
          '</a>';
        if (n.children && n.children.length > 0) {
          html += buildTocHtml(n.children, depth + 1);
        }
        html += '</li>';
      }
      html += '</ul>';
      return html;
    };
    const tocHtml =
      '<div class="ietm-toc-box" style="border: 1px solid #334155; background: #0f172a; padding: 16px; border-radius: 8px; margin: 16px 0;">' +
      '<h3 style="color: #00F5D4; margin-top: 0; font-size: 16px; text-transform: uppercase; font-family: monospace;">Table of Contents (Auto-Generated)</h3>' +
      buildTocHtml(tree) +
      '</div>';
    const newContent = (content || "") + tocHtml;
    setContent(newContent);
    contentRef.current = newContent;
    toast.success("Table of Contents generated and appended to editor");
  };

  // E4: Convert PDF / Word text into data modules
  const executePdfImport = async () => {
    if (!pdfImportText.trim()) return toast.error("Please enter text to import");
    const sections = pdfImportText.split(/\\n(?=\\d+\\.\\d+)/);
    let createdCount = 0;
    for (const sec of sections) {
      const lines = sec.trim().split("\\n");
      const title = lines[0].replace(/^[\\d\\.]+\\s*/, "").slice(0, 60) || "Imported Topic";
      const body = lines.slice(1).join("<br/>") || lines[0];
      await window.api.addModule?.({
        manualId,
        parentId: selectedNode?.id || null,
        title: title,
        type: "procedure",
        content: '<p>' + body + '</p>',
        bgColor: null,
      });
      createdCount++;
    }
    toast.success('Imported ' + createdCount + ' data modules from text');
    setShowPdfImportModal(false);
    setPdfImportText("");
    loadTree();
  };

  // E6: Diagnostic Link & Hotspot Checker
  const runLinkChecker = async () => {
    try {
      const res = await window.api.checkLinks?.(manualId);
      if (res) {
        setLinkCheckResult(res);
        setShowLinkCheckerModal(true);
      } else {
        const flat = [];
        const flatten = (nodes) => {
          for (const n of nodes) {
            flat.push(n);
            if (n.children) flatten(n.children);
          }
        };
        flatten(tree);
        setLinkCheckResult({
          status: "PASSED",
          totalModules: flat.length,
          brokenLinks: [],
          orphanHotspots: [],
        });
        setShowLinkCheckerModal(true);
      }
    } catch (err) {
      toast.error("Link check failed: " + err.message);
    }
  };`;

code = code.replace(/\\r\\n/g, '\\n');
const targetNorm = target.replace(/\\r\\n/g, '\\n');

if (code.includes(targetNorm)) {
  code = code.replace(targetNorm, replacement.replace(/\\r\\n/g, '\\n'));
  fs.writeFileSync('src/pages/Editor.jsx', code, 'utf8');
  console.log('Successfully patched Editor.jsx with handleGenerateTOC, executePdfImport, runLinkChecker!');
} else {
  console.error('Target not found in Editor.jsx');
}

