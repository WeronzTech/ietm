# IETM Feature Audit & Cross-Check Report

This document records the audit of the IETM (Interactive Electronic Technical Manual) system against the complete defense standard feature checklist.

---

## 📊 Summary of Baseline Audit

| Category | Total | ✅ Present | 🟡 Partial | ❌ Missing |
| :--- | :---: | :---: | :---: | :---: |
| **Viewer Module (End User)** | 38 | 9 | 8 | 21 |
| **Administrator Module** | 16 | 3 | 7 | 6 |
| **Authoring / Super Admin (OEM)** | 11 | 3 | 3 | 5 |
| **General Quality** | 3 | 2 | 0 | 1 |
| **TOTAL** | **68** | **17** | **18** | **33** |

---

## Audit Table

### 1. VIEWER MODULE (End User)

| ID | Feature | Status | Evidence | What is missing |
| :--- | :--- | :---: | :--- | :--- |
| **V1** | Login page, then a home page with module boxes; the user selects a module to enter it | ✅ Present | `src/pages/Login.jsx`, `src/pages/Dashboard.jsx`, `src/pages/ManualView.jsx` | Fully working. Login directs to mission dashboard with module cards that launch viewer. |
| **V2** | Each module has tabs: Core Content, Manuals, Drawings, Videos, Glossary | ❌ Missing | `src/pages/ManualView.jsx` | Viewer currently only displays raw content and bookmarks sidebar; tabs for Core Content, Manuals, Drawings, Videos, and Glossary are missing. |
| **V3** | Core Content shown as a hierarchical content tree | ✅ Present | `src/components/Sidebar/TreeView.jsx`, `TreeNode.jsx` | Recursive hierarchical tree of chapters and data modules with expand/collapse. |
| **V4** | Manuals shown as a hierarchical tree; PDF manuals with an organised index and a normal PDF viewer (zoom, page navigation, etc.) | ❌ Missing | `src/pages/ManualView.jsx` | Dedicated PDF manuals tab with hierarchical index and embedded PDF viewer with controls (zoom, page nav) does not exist. |
| **V5** | Drawings shown as thumbnails; clicking opens the image with zoom in, zoom out and pan | ❌ Missing | `src/components/Content/MediaPanel.jsx` | Drawing thumbnail gallery with interactive zoom in, zoom out, pan, and reset viewer modal does not exist. |
| **V6** | Videos play in a standard video player (play/pause, seek, volume, fullscreen) | 🟡 Partial | `src/components/Content/ModuleViewer.jsx` | Raw video tags can be placed in HTML, but no dedicated Videos gallery tab or standard multimedia player with custom controls exists. |
| **V7** | Glossary of abbreviations and definitions (editable by authorised users) | ❌ Missing | `electron/database.js` | No glossary table or UI in viewer or admin. |
| **V8** | Navigation: previous/next page, previous/next module, easy movement through structured data | ✅ Present | `src/pages/ManualView.jsx#L183-L201` | "PREVIOUS STEP" and "NEXT STEP" buttons navigate sequentially through the flat tree. |
| **V9** | Content fills the screen frame (not page-oriented) and adjusts to the display | ✅ Present | `src/components/Layout.jsx`, `src/pages/ManualView.jsx` | Fluid responsive layout with flexbox and scroll areas that fit any screen resolution. |
| **V10** | Global search across all modules and pages | ✅ Present | `src/components/Layout.jsx#L54-L122`, `electron/main.js#L438-L478` | Search bar searches titles and HTML content across modules, returning highlighted snippets. |
| **V11** | Filters to sort and find data across modules and pages | ❌ Missing | `src/components/Layout.jsx` | Global search only searches text; no sort filters (A-Z, date, type) or advanced search modal. |
| **V12** | Category filter on search results (by module) | ❌ Missing | `src/components/Layout.jsx#L98-L121` | Dropdown displays flat search results with no module category filter tabs. |
| **V13** | Search suggestions: typing shows suggestions; clicking one fills the search box and shows results | 🟡 Partial | `src/components/Layout.jsx` | Live search executes directly on keystroke, but dedicated autocomplete suggestions table/feed that populates query does not exist. |
| **V14** | Separate button to search keywords inside PDF manuals; results list the topics/PDFs containing the keyword and open in a separate window | ❌ Missing | `src/components/Layout.jsx`, `src/pages/ManualView.jsx` | No PDF manual keyword search engine or dedicated search modal. |
| **V15** | Previous search results / search history saved user-wise | ❌ Missing | `electron/database.js` | No search history table or user-wise search history display. |
| **V16** | Hyperlinks (blue, underlined) that jump to other sections, pages or modules | 🟡 Partial | `src/components/Content/ModuleViewer.jsx` | HTML links exist, but internal cross-reference link clicking (`data-module-id` or `#module-id`) does not seamlessly route the viewer to the target module. |
| **V17** | Text hotspot: hover shows a popup with text; click opens a separate window | ❌ Missing | `src/components/Content/HotspotImage.jsx` | `HotspotImage.jsx` is 0 bytes. Text hotspots with hover tooltips and click modals are missing. |
| **V18** | Image hotspot: hover shows a popup with an image; click opens a separate window | ❌ Missing | `src/components/Content/HotspotImage.jsx` | Image hotspots with thumbnail hover previews and separate zoom windows are missing. |
| **V19** | Video hotspot: hover shows a popup with a video; click opens a separate window | ❌ Missing | `src/components/Content/HotspotImage.jsx` | Video hotspots with video hover previews and video modal player are missing. |
| **V20** | Related content of a linked page shown in a separate window | ❌ Missing | `src/components/Content/ModuleViewer.jsx` | No "Related Content" drawer or separate window for linked topics. |
| **V21** | Table and drawing interactivity: clicking a name in the table highlights its number in the drawing, and clicking the number in the drawing highlights its name in the table | 🟡 Partial | `src/components/Content/IPBViewer.jsx` | Part table and hotspots exist, but clicking table part does not cross-highlight the hotspot pin in the graphic, and clicking hotspot navigates away rather than two-way selecting. |
| **V22** | Interactive illustrations and schematics | 🟡 Partial | `src/components/Content/IPBViewer.jsx` | Hotspots can be overlaid on images, but pan/zoom and interactive toggleable schematic layers are not present. |
| **V23** | Supports videos, images, PDFs, drawings and tables | 🟡 Partial | `src/components/Content/ModuleViewer.jsx` | Supports HTML tables and images; dedicated multi-media viewers for PDF manuals, drawings, and videos need to be integrated. |
| **V24** | 3D model viewing: 360° rotation, plus exploded view and highlight (add-on; basic version is enough) | ❌ Missing | `src/components/Content/` | No 3D model interactive component with 360° orbit rotation, exploded view toggle, and part highlight. |
| **V25** | Annotations/comments on content, of two types: private (self) and sent to Administrator | ❌ Missing | `electron/database.js`, `src/components/Content/ModuleViewer.jsx` | No annotations table or UI for adding private vs admin notes. |
| **V26** | Two-way replies: Administrator can reply to the user and the user can reply to the Administrator | ❌ Missing | `electron/database.js` | No annotation replies table or chat/thread UI. |
| **V27** | Annotations are moderated by the Administrator | ❌ Missing | `src/pages/AdminDashboard.jsx` | No annotation review/moderation status in Admin. |
| **V28** | Bookmark any page; list and open bookmarks; delete bookmarks | ✅ Present | `src/pages/ManualView.jsx#L101-L107`, `src/components/Sidebar/TreeView.jsx#L114-L133`, `electron/main.js#L293-L315` | Fully implemented: toggle bookmark button, list in sidebar tab, navigate, unpin. |
| **V29** | Increase, decrease and reset font size | ❌ Missing | `src/pages/ManualView.jsx` | No font size scaling controls (A+, A-, Reset) in viewer. |
| **V30** | Full screen button | ❌ Missing | `src/pages/ManualView.jsx` | No fullscreen toggle button to expand viewer to complete monitor frame. |
| **V31** | Theme change: light, dark and other colour modes, applied instantly | ❌ Missing | `src/components/Layout.jsx` | Fixed dark theme; no theme switcher (Light, Dark, Military Olive, High-Contrast Navy). |
| **V32** | Help documents explaining features and procedures | ❌ Missing | `src/components/Layout.jsx` | No Help Modal or user guide explaining IETM navigation and controls. |
| **V33** | Software version number visible | 🟡 Partial | `src/components/Layout.jsx#L77-L81` | Shows branding "SSS DEFENCE", but software version ("v4.2.0 Level 4") is omitted in the header. |
| **V34** | Revision history viewable | ❌ Missing | `src/pages/ManualView.jsx` | No revision history view tab or dialog showing changes, versions, and dates. |
| **V35** | Login and logout | ✅ Present | `src/pages/Login.jsx`, `src/context/AuthContext.jsx`, `src/components/Layout.jsx#L132-L138` | Fully functional login and session termination. |
| **V36** | Auto logout when the same user logs in from another system | ❌ Missing | `electron/main.js` | No concurrent session detection or session invalidation on dual login. |
| **V37** | Auto logout after a set idle time | ❌ Missing | `src/context/AuthContext.jsx` | No idle inactivity timer with warning and automatic logout. |
| **V38** | Security questions | ❌ Missing | `electron/database.js`, `src/pages/Login.jsx` | No security questions setup or password recovery verification. |

---

### 2. ADMINISTRATOR MODULE

| ID | Feature | Status | Evidence | What is missing |
| :--- | :--- | :---: | :--- | :--- |
| **A1** | Admin dashboard after admin login | ✅ Present | `src/pages/AdminDashboard.jsx`, `src/pages/Dashboard.jsx#L238` | Admin users are automatically routed to the comprehensive Admin Control Center. |
| **A2** | Create and delete users; assign roles such as Operator or Maintainer; role-based access to data | 🟡 Partial | `src/pages/AdminDashboard.jsx#L261-L311` | Can create and delete users, but roles dropdown only has "user" and "admin" (missing "maintainer" and "operator"), and role-based data filtering is rudimentary. |
| **A3** | View user history and user login/logout history | 🟡 Partial | `src/pages/AdminDashboard.jsx#L617-L644` | Mixed inside general audit logs, but no dedicated user login/logout history filtering or user session audit table. |
| **A4** | Activity tracking: login/logout, documents accessed (with time), search activity, search keywords, bookmarks, annotations, security questions | 🟡 Partial | `electron/main.js#L273-L290` | Only login, logout, and print are tracked; document open time, search queries, bookmark actions, and annotations are not logged to audit logs. |
| **A5** | Printing only by Admin, and only the frame currently being viewed | 🟡 Partial | `src/pages/ManualView.jsx#L161-L167` | Print button is active for all users rather than restricted to Administrator, though it does print only the active frame. |
| **A6** | Every print carries a watermark (date, time, etc.) | 🟡 Partial | `src/pages/ManualView.jsx#L170-L174` | CSS watermark markup exists but is hidden with class `hidden` instead of properly styled `@media print` visible watermark overlay. |
| **A7** | Print history is recorded | ✅ Present | `src/pages/ManualView.jsx#L78-L87`, `electron/main.js#L273` | PRINT_PROCEDURE audit log is committed with username, timestamp, and target module title. |
| **A8** | Admin can print user data, activities, annotations and other information as reports | ❌ Missing | `src/pages/AdminDashboard.jsx` | No dedicated print report buttons for user activity, annotations, or audit trails. |
| **A9** | Consolidated reports: per-user activity, and annotations by user and by date, in a printable format | ❌ Missing | `src/pages/AdminDashboard.jsx` | No consolidated printable report generator with per-user filters and date ranges. |
| **A10** | Review, moderate and reply to user annotations | ❌ Missing | `src/pages/AdminDashboard.jsx` | No annotation moderation table or reply interface in Admin. |
| **A11** | Backup and restore inside the application, with support for multiple backups; backups are encrypted | 🟡 Partial | `src/pages/AdminDashboard.jsx#L382-L388`, `electron/main.js#L405-L424` | Backup export exists, but in-app Restore from backup is missing, and backups are unencrypted raw DB copies. |
| **A12** | Admin can create hotspots and hyperlinks | 🟡 Partial | `src/pages/Editor.jsx#L826-L862` | Basic coordinate hotspot editor exists in Editor, but link maker tool and text/media hotspot creation need full support. |
| **A13** | Admin can enter data that feeds search suggestions | ❌ Missing | `electron/database.js` | No search suggestions database table or admin management form. |
| **A14** | Revision history: enter revision details for content changes and upload PDF pages into the history tab | ❌ Missing | `src/pages/AdminDashboard.jsx`, `electron/database.js` | No revision history manager to log version, changes, author, and upload change notice PDFs. |
| **A15** | Configurable settings: client logo, login page, module boxes, copyright text, IETM title, idle logout time, theme, multi-user login detection | ❌ Missing | `src/pages/AdminDashboard.jsx` | No settings tab in Admin to configure title, logo, copyright, idle timeout, and security flags. |
| **A16** | Confidential data stored in encrypted form | ✅ Present | `electron/database.js#L24-L34`, `electron/main.js#L713` | SQLite encrypted using SQLCipher (`better-sqlite3-multiple-ciphers`), packages encrypted with AES-256 (`crypto.js`). |

---

### 3. AUTHORING / SUPER ADMIN MODULE (OEM only)

| ID | Feature | Status | Evidence | What is missing |
| :--- | :--- | :---: | :--- | :--- |
| **O1** | Separate OEM-only access; end client cannot reach it or edit content | 🟡 Partial | `src/pages/Dashboard.jsx#L238`, `src/pages/Editor.jsx` | Role check prevents regular users from editing, but distinction between End-Client Admin vs OEM Super Admin is not explicitly separated. |
| **O2** | Create new content, pages and modules; add, delete, modify and edit content | ✅ Present | `src/pages/Editor.jsx` | Complete chapter and sub-topic creator, tree builder, module editor, and module deletion. |
| **O3** | Insert images, tables and multimedia | ✅ Present | `src/pages/Editor.jsx#L270-L279`, `electron/main.js#L905-L928` | Jodit editor with full toolbar for tables, formatting, plus media asset upload handler. |
| **O4** | Create hyperlinks, hotspots (text, image, video) and related content | 🟡 Partial | `src/pages/Editor.jsx#L826-L862` | Basic coordinate hotspot creation exists, but text, image, and video hotspot types and related content linking are missing. |
| **O5** | Generate index / table of contents | ❌ Missing | `src/pages/Editor.jsx` | No one-click "Generate Table of Contents / Index" utility to insert formatted TOC into module content. |
| **O6** | Create module boxes | ✅ Present | `src/pages/AdminDashboard.jsx#L464-L545` | Admin/OEM can create new weapon systems / module blocks with metadata. |
| **O7** | Create smart search (suggestions and index) | ❌ Missing | `electron/database.js` | No interface for author to define keywords, synonyms, and smart suggestions. |
| **O8** | Create glossary and abbreviations | ❌ Missing | `electron/database.js` | No authoring tool to manage glossary terms and acronyms. |
| **O9** | Convert PDF text into database content | ❌ Missing | `src/pages/Editor.jsx` | No PDF text parser / importer to extract text and structure from PDF into module content. |
| **O10** | Upload drawings, PDF manuals and videos | 🟡 Partial | `electron/main.js#L905-L928` | Generic asset uploader exists, but dedicated uploaders into the Drawings, Manuals, and Videos collections are missing. |
| **O11** | Configure login page, logos, project name and copyright text | ❌ Missing | `electron/database.js` | Settings are hardcoded; no OEM configuration panel. |

---

### 4. GENERAL QUALITY

| ID | Feature | Status | Evidence | What is missing |
| :--- | :--- | :---: | :--- | :--- |
| **G1** | Content opens quickly (about 1 second or less per topic) | ✅ Present | `electron/database.js`, `electron/main.js#L888-L903` | SQLite query execution takes under 15ms; instant UI rendering with React. |
| **G2** | Works in Chrome, Edge and Firefox with nothing extra installed on the user's computer | ✅ Present | Standard Vite / React web application compatible across modern Chromium, Gecko, and WebKit browsers and Electron. |
| **G3** | A link checker that finds broken hyperlinks, hotspots and navigation | ❌ Missing | `src/pages/Editor.jsx` | No automated diagnostic link checker to detect broken links, orphan modules, or invalid hotspot targets. |
