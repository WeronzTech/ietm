# JSG 0852 LEVEL-4 IETM COMPREHENSIVE TESTING GUIDE

This document provides exhaustive instructions for running all automated, integration, security, performance, and user acceptance test suites for the Quantum TechDocs IETM Level-4 suite built to Indian Defence Standard JSG 0852.

---

## 1. PRE-REQUISITES & ENVIRONMENT

- **Operating System:** Windows 10/11 or Linux Server (Ubuntu 20.04/22.04 LTS / RHEL 8/9)
- **Node.js Environment:** Node v20+ / Electron 39 runtime (v22.21.1)
- **Database Engine:** `better-sqlite3-multiple-ciphers` with SQLCipher AES-256 encryption (`ietm_core_secure.db`)
- **Frontend Engine:** Vite 7.3+ with React 19

> [!NOTE]
> Because `better-sqlite3-multiple-ciphers` is compiled by `electron-builder` against the Electron Node ABI, all Node test scripts must be run using Electron's Node runtime by passing `$env:ELECTRON_RUN_AS_NODE=1` on Windows or `ELECTRON_RUN_AS_NODE=1` on Linux.

---

## 2. AUTOMATED COMPREHENSIVE TEST SUITE (32 TESTS)

The test suite in `scratch/test_ietm_suite.mjs` executes 32 automated checks verifying:

1. **Authentication & Password Hashing:** bcrypt salt verification, plain text prevention, 5-attempt brute-force lockout window.
2. **Role-Based Access Control (RBAC):** 4 JSG 0852 roles (`Operator`, `Maintainer`, `Admin`, `Super Admin / Author`), server-enforced print function restrictions.
3. **Content Hierarchy & Navigation:** 33 data modules, parent-child tree integrity, sequential stepper navigation.
4. **Cross-Reference Link Integrity:** Diagnostic link crawl verifying 0 broken links.
5. **Drawing ↔ Table Interactivity (A6):** Bi-directional mapping between ISPL parts breakdown and spatial SVG hotspot pins.
6. **Search & Auto-Complete Suggestions:** Keyword search and dynamic suggestion index.
7. **Forensic Audit Logging (C1-C8):** `USER_LOGIN`, `VIEW_MODULE`, `SEARCH_QUERY`, and `PRINT_FRAME` audit trails.
8. **Annotations & Moderation (A8, D5):** Private vs To-Admin submissions and Admin reply workflow.
9. **Revisions & Change History (A8):** ECN revisions and linked PDF change notices.
10. **AES-256-GCM Backup Encryption (D8, F1):** Cryptographic encryption and authenticated restoration with zero data loss.
11. **Performance Benchmark (G1):** 50 sequential module topic fetches measuring average and peak latency against the JSG 0852 ≤ 1,000 ms requirement.

### Command to Run:

```powershell
# Windows PowerShell:
$env:ELECTRON_RUN_AS_NODE=1; .\node_modules\.bin\electron.cmd scratch/test_ietm_suite.mjs

# Linux / macOS:
ELECTRON_RUN_AS_NODE=1 ./node_modules/.bin/electron scratch/test_ietm_suite.mjs
```

### Expected Output:

```
====================================================
       JSG 0852 LEVEL-4 IETM COMPREHENSIVE TEST SUITE
====================================================

--- TEST GROUP 1: AUTHENTICATION & SECURITY POLICIES ---
[PASS] User operator1 exists in database
[PASS] operator1 password verified with bcrypt
[PASS] Password is encrypted/hashed with bcrypt, not plain text
[PASS] Account lockout enforced after 5 failed attempts (15-min lockout window)

--- TEST GROUP 2: ROLE-BASED ACCESS CONTROL MATRIX ---
[PASS] Operator role present (Level 1: Read-only access)
[PASS] Maintainer role present (Level 2: Maintenance & troubleshooting access)
[PASS] Admin role present (Level 3: User management, backups, print rights)
[PASS] Super Admin / Author role present (Level 3: OEM Authoring & configuration)
[PASS] Operator role cannot access Print function (Restricted)
[PASS] Maintainer role cannot access Print function (Restricted)
[PASS] Admin role can access Print function
[PASS] Super Admin role can access Print function

--- TEST GROUP 3: CONTENT HIERARCHY & NAVIGATION ---
[PASS] Primary weapon manual exists (SSS DEFENCE G72-SMG)
[PASS] Hierarchical content tree populated with 33 data modules
[PASS] Parent-child tree structure verified (12 chapters, 21 subtopics)

--- TEST GROUP 4: CROSS-REFERENCES & LINK CHECKER ---
[PASS] Diagnostic link crawl verified: 0 embedded cross-module hyperlinks scanned, 0 broken links

--- TEST GROUP 5: DRAWING <-> TABLE BI-DIRECTIONAL INTERACTIVITY ---
[PASS] ISPL Parts loaded: 5 parts in Module 75
[PASS] Schematic hotspots loaded: 5 hotspots in Module 75
[PASS] Bi-directional mapping: All 5 parts mapped to valid spatial schematic hotspots

--- TEST GROUP 6: SEARCH & SUGGESTIONS ---
[PASS] Keyword search returned 7 modules for query 'safety'
[PASS] Search auto-complete suggestions loaded: 7 suggestions indexed

--- TEST GROUP 7: FORENSIC AUDIT LOGGING ---
[PASS] Audit log recorded USER_LOGIN with IP and timestamp
[PASS] Audit log recorded VIEW_MODULE with document ID
[PASS] Audit log recorded SEARCH_QUERY keywords
[PASS] Audit log recorded PRINT_FRAME event

--- TEST GROUP 8: ANNOTATIONS & MODERATION ---
[PASS] Created "to_admin" annotation with pending moderation status
[PASS] Admin reply to user annotation recorded and retrieved

--- TEST GROUP 9: REVISIONS & CHANGE TRACKING ---
[PASS] Revision history retrieved: 3 formal military ECN revisions found
[PASS] Revision Rev 2.4 carries change notes and linked ECN PDF

--- TEST GROUP 10: AES-256 BACKUP & INTEGRITY ---
[PASS] Database payload successfully encrypted with AES-256-GCM
[PASS] AES-256-GCM package decrypted & authenticated with zero data loss

--- TEST GROUP 11: PERFORMANCE BENCHMARK (TOPIC LOAD TIME) ---
Measured 50 sequential module topic fetches:
- Average Load Time: 0.76 ms
- Maximum Load Time: 3.05 ms
- Requirement: <= 1,000 ms (1.0 second)
[PASS] Topic load time 3.05 ms meets strict JSG 0852 <= 1.0s requirement

====================================================
TOTAL TESTS: 32
PASSED:      32
FAILED:      0
====================================================
```

---

## 3. REST API & LAN SERVER INTEGRATION TESTS (11 TESTS)

The test suite in `scratch/test_server_api.mjs` verifies the embedded HTTP server:

1. Static asset delivery (`dist/index.html` served on root).
2. User authentication and session token issuance.
3. Server-side RBAC enforcement: Operator hitting `/api/auth/users` receives `HTTP 403 Forbidden`.
4. Admin account privilege verification.
5. Topic content delivery (`GET /api/ietm/content/:id`).
6. Advanced search filtering (`POST /api/ietm/search`).
7. Revision history retrieval (`GET /api/ietm/revisions/:id`).
8. Glossary index retrieval (`GET /api/ietm/glossary/:id`).
9. OWASP path traversal protection (`/..%2f..%2fwindows` safely neutralized).

### Command to Run:

```powershell
# Windows PowerShell:
$env:ELECTRON_RUN_AS_NODE=1; .\node_modules\.bin\electron.cmd scratch/test_server_api.mjs

# Linux:
ELECTRON_RUN_AS_NODE=1 ./node_modules/.bin/electron scratch/test_server_api.mjs
```

### Expected Output:

```
--- STARTING REST API & HTTP SERVER TEST ---
[IETM Server] Active and listening on http://0.0.0.0:5055
[PASS] Static web server serves index.html on root path
[PASS] POST /api/auth/login authenticates operator1
[PASS] Session token issued in login response
[PASS] POST /api/auth/login authenticates admin1 with role admin
[PASS] RBAC Server Enforcement: Operator accessing /api/auth/users receives 403 Forbidden
[PASS] Admin accessing /api/auth/users receives user list
[PASS] GET /api/ietm/content/75 returns topic data
[PASS] POST /api/ietm/search returns search hits
[PASS] GET /api/ietm/revisions/19 returns revision history
[PASS] GET /api/ietm/glossary/19 returns glossary terms
[PASS] Path traversal attempt safely neutralized to web root
HTTP Server closed.

====================================================
API TESTS: 11
PASSED:    11
FAILED:    0
====================================================
```

---

## 4. FRONTEND PRODUCTION BUILD VERIFICATION

To verify that all React 19 components, Tailwind utility classes, Lucide icons, and Jodit editor modules compile cleanly into production bundles:

```powershell
.\node_modules\.bin\vite.cmd build
```

Expected result:

- `✓ 2455 modules transformed.`
- Zero syntax or bundling errors.
- Output generated in `dist/` (`index.html`, CSS chunk, JS chunk).

---

## 5. USER CREDENTIAL MATRIX FOR MANUAL QA & UAT

The following pre-seeded test accounts represent each of the 4 JSG 0852 clearance levels:

| Username      | Password      | Role         | Access Level  | Description & Clearance                                                  |
| :------------ | :------------ | :----------- | :-----------: | :----------------------------------------------------------------------- |
| `operator1`   | `operator123` | `operator`   |    Level 1    | Read-only procedure viewer, search, personal bookmarks, private notes    |
| `maintainer1` | `maint123`    | `maintainer` |    Level 2    | Field maintenance, diagnostics, IPB parts lookup, glossary editor        |
| `admin1`      | `admin123`    | `admin`      |    Level 3    | User management, audit logs, annotation moderation, watermarked print    |
| `superadmin`  | `admin123`    | `superadmin` | Level 3 (OEM) | Full OEM Authoring, TOC tree generation, PDF conversion, system settings |

---

## 6. MANUAL END-TO-END VERIFICATION CHECKLIST

1. **Standalone Desktop Launch:**
   Run `npm run dev` to launch Electron. Verify native application window loads the Mission Dashboard.
2. **Browser / Networked LAN Launch:**
   Launch the embedded server. In Chrome, Edge, or Firefox, navigate to `http://localhost:5000` (or `http://<server-ip>:5000`). Confirm login page renders cleanly without client dependencies.
3. **Drawing ↔ Table Interactivity:**
   Log in as `operator1`, select manual `SSS DEFENCE G72-SMG`, navigate to Chapter 3 (`Identification of Components`). Click hotspot pin **2** on the drawing; observe row **Rotating Bolt Carrier Assembly** highlight in the table. Click table row **Upper Receiver Main Housing**; observe hotspot pin **1** pulse and highlight on the drawing.
4. **Restricted Watermarked Print:**
   Attempt to print as `operator1` (Print button disabled with tooltip). Log out and log in as `admin1`. Open a procedure and click the Print button. Verify the printed page carries the forensic watermark:
   `RESTRICTED MILITARY TECHNICAL DATA - FOR AUTHORIZED USE ONLY | OPERATOR AUTH: admin1 (ADMIN) | TIMESTAMP: <Current Date/Time>`.
5. **Annotation Moderation Workflow:**
   As `operator1`, add a note toggled to "To Admin". Log out and log in as `admin1`. Open Admin Dashboard > Annotation Moderation tab. Verify note appears; submit a reply. Log back in as `operator1` to confirm reply appears in thread.
6. **Encrypted Backup & In-App Restore:**
   In Admin Dashboard > Database Backups tab, click "Create AES-256 Backup". Confirm encrypted snapshot file is created. Select a backup from the restore list to test instantaneous restoration.
