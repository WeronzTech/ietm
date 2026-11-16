const fs = require('fs');

let code = fs.readFileSync('src/components/Content/ModuleViewer.jsx', 'utf8');

// 1. Add hoverTooltip state
const targetState = `  const [activeHotspot, setActiveHotspot] = useState(null);`;
const replacementState = `  const [activeHotspot, setActiveHotspot] = useState(null);
  const [hoverTooltip, setHoverTooltip] = useState(null);`;

// 2. Add handleContentMouseOver & handleContentMouseOut
const targetClick = `  // 2. Intercept click on hyperlinked cross-references (V16) and interactive hotspots (V17, V18, V19, V20)
  const handleContentClick = (e) => {`;

const replacementClick = `  const handleContentMouseOver = (e) => {
    const link = e.target.closest("a, [data-hotspot-type], [data-module-id]");
    if (!link) {
      if (hoverTooltip) setHoverTooltip(null);
      return;
    }
    const hotspotType = link.getAttribute("data-hotspot-type");
    const dataModId = link.getAttribute("data-module-id");
    const rect = link.getBoundingClientRect();
    if (hotspotType) {
      setHoverTooltip({
        text: \`[\${hotspotType.toUpperCase()} HOTSPOT] \${link.getAttribute("data-hotspot-title") || "Click to inspect"}\`,
        x: Math.max(10, rect.left),
        y: Math.max(10, rect.top - 28),
      });
    } else if (dataModId) {
      setHoverTooltip({
        text: \`[HYPERLINK] Jump to Data Module #\${dataModId}\`,
        x: Math.max(10, rect.left),
        y: Math.max(10, rect.top - 28),
      });
    }
  };

  const handleContentMouseOut = () => {
    setHoverTooltip(null);
  };

  // 2. Intercept click on hyperlinked cross-references (V16) and interactive hotspots (V17, V18, V19, V20)
  const handleContentClick = (e) => {`;

// 3. Attach onMouseOver and onMouseLeave
const targetDiv = `onClick={handleContentClick}
        >`;
const replacementDiv = `onClick={handleContentClick}
          onMouseOver={handleContentMouseOver}
          onMouseOut={handleContentMouseOut}
        >`;

// 4. Render tooltip
const targetRender = `      {safetyOverlay}
      {ContentComponent}`;

const replacementRender = `      {safetyOverlay}
      {hoverTooltip && (
        <div
          style={{ left: hoverTooltip.x, top: hoverTooltip.y }}
          className="fixed z-50 px-2 py-0.5 rounded bg-black/95 border border-vector-accent text-[10px] font-mono font-bold text-vector-accent shadow-[0_0_10px_rgba(0,245,212,0.3)] pointer-events-none animate-fade-in"
        >
          {hoverTooltip.text}
        </div>
      )}
      {ContentComponent}`;

code = code.replace(/\r\n/g, '\n');
code = code.replace(targetState, replacementState);
code = code.replace(targetClick, replacementClick);
code = code.replace(targetDiv, replacementDiv);
code = code.replace(targetRender, replacementRender);

fs.writeFileSync('src/components/Content/ModuleViewer.jsx', code, 'utf8');
console.log('Successfully updated src/components/Content/ModuleViewer.jsx with hover tooltips!');

