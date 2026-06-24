console.log('🚀 HUSA AUTOMATION REPORTER LOADED');

const fs = require('fs');
const path = require('path');

class ModuleReporter {
  constructor() {
    this.results = [];
  }

  getModule(test) {
    const filePath = test.location.file;
    const parts = filePath.split(path.sep);
    return parts[parts.length - 2] || 'unknown';
  }

  onTestEnd(test, result) {
    const moduleName = this.getModule(test);

    this.results.push({
      title: test.title,
      file: test.location.file,
      module: moduleName,
      status: result.status,
      error: result.error ? result.error.message : null,
      duration: result.duration || 0,
      logs: result.stdout ? result.stdout.map(x => x.toString()) : []
    });
  }

  onEnd() {

    const grouped = {};

    for (const r of this.results) {
      if (!grouped[r.module]) {
        grouped[r.module] = {
          total: 0,
          passed: 0,
          failed: 0,
          tests: []
        };
      }

      grouped[r.module].total++;
      if (r.status === 'passed') grouped[r.module].passed++;
      else grouped[r.module].failed++;

      grouped[r.module].tests.push(r);
    }

    const total = this.results.length;
    const passed = this.results.filter(t => t.status === 'passed').length;
    const failed = this.results.filter(t => t.status !== 'passed').length;

    const allGrouped = {
      ALL: {
        total,
        passed,
        failed,
        modules: grouped
      },
      ...grouped
    };

    let html = `
<!DOCTYPE html>
<html>
<head>
<title>HUSA Automation Report</title>

<style>
body {
  font-family: Arial;
  background:#f5f5f5;
  margin:0;
}

/* SIDEBAR */
.sidebar {
  width:260px;
  position:fixed;
  height:100vh;
  background:white;
  border-right:1px solid #ddd;
  overflow:auto;
}

.module-link {
  padding:10px;
  border-bottom:1px solid #eee;
  cursor:pointer;
}

.module-link:hover {
  background:#f2f2f2;
}

.module-link.active {
  background:#dcdcdc !important;
}

.module-link.pass { color:#1a7f37; font-weight:600; }
.module-link.fail { color:#d93025; font-weight:600; }

/* CONTENT */
.content {
  margin-left:280px;
  padding:20px;
}

/* TREE */
.tree-module {
  background:#eee;
  margin:10px 0;
  padding:10px;
  border-radius:6px;
  cursor:pointer;
}

.tree-module.active {
  background:#dcdcdc;
}

.tree-tests {
  display:none;
  margin-left:15px;
}

.test {
  background:white;
  margin:6px 0;
  padding:10px;
  border-radius:6px;
  border-left:4px solid #ccc;
  cursor:pointer;
}

.test.active {
  background:#dcdcdc;
}

.status {
  display:inline-block;
  padding:3px 10px;
  border-radius:20px;
  font-size:12px;
  margin-left:8px;
  font-weight:bold;
}

.status.passed {
  background:#e6f9ed;
  color:#1a7f37;
}

.status.failed {
  background:#ffe6e6;
  color:#d93025;
}

.details {
  display:none;
  background:#fafafa;
  padding:10px;
  margin-top:8px;
  border-left:3px solid #007bff;
}

.logbox {
  background:black;
  color:#00ff88;
  padding:10px;
  font-size:12px;
  white-space:pre-wrap;
}
</style>

<script>

let activeModule = null;

function toggleModule(id){
  const el = document.getElementById(id);
  el.style.display = el.style.display === 'block' ? 'none' : 'block';
}

function toggleTest(id){
  const el = document.getElementById(id);
  el.style.display = el.style.display === 'block' ? 'none' : 'block';
}

/* =========================
   MODULE OPEN + HIGHLIGHT
========================= */
function openModule(id){

  activeModule = id;

  document.querySelectorAll('.module-link').forEach(e => {
    e.classList.remove('active');
  });

  const active = document.getElementById('link-' + id);
  if (active) active.classList.add('active');

  document.querySelectorAll('.module-section').forEach(e => {
    e.style.display = 'none';
  });

  const section = document.getElementById('section-' + id);
  if (section) section.style.display = 'block';
}

window.onload = function(){
  openModule('ALL');
};

</script>

</head>

<body>

<h2 style="padding:10px;">📊 HUSA AUTOMATION REPORT</h2>

<div style="padding:10px;">
Total: ${total} | Passed: ${passed} | Failed: ${failed}
</div>

<!-- SIDEBAR -->
<div class="sidebar">
  <h3 style="padding:10px;">Modules</h3>
`;

    // =====================
    // SIDEBAR
    // =====================
    for (const m in allGrouped) {
      const g = allGrouped[m];
      const statusClass = g.failed > 0 ? 'fail' : 'pass';

      html += `
        <div id="link-${m}" class="module-link ${statusClass}" onclick="openModule('${m}')">
          ${m} (${g.total})
        </div>
      `;
    }

    html += `
</div>

<div class="content">
`;

    // =====================
    // RIGHT SIDE RENDER
    // =====================
    for (const m in allGrouped) {

      html += `
        <div id="section-${m}" class="module-section" style="display:none;">
          <h2>📁 ${m}</h2>
      `;

      const data = allGrouped[m];

      // =====================
      // ALL COLLAPSIBLE TREE (FIXED)
      // =====================
      if (m === 'ALL') {

        for (const mod in data.modules) {

          const group = data.modules[mod];
          const modId = `mod-${mod}`;

          html += `
            <div class="tree-module" onclick="toggleModule('${modId}')">
              📁 ${mod} (${group.total})
            </div>

            <div id="${modId}" class="tree-tests">
          `;

          group.tests.forEach((t, i) => {

            const testId = `test-${mod}-${i}`;

            html += `
              <div class="test" onclick="toggleTest('${testId}')">
                ${t.status === 'passed' ? '✔' : '✖'} ${t.title}

                <span class="status ${t.status}">
                  ${t.status.toUpperCase()}
                </span>

                <div class="details" id="${testId}">
                  <p><b>File:</b> ${t.file}</p>
                  <p><b>Duration:</b> ${t.duration} ms</p>

                  ${t.error ? `<p style="color:red;">${t.error}</p>` : ''}

                  <div class="logbox">
                    ${t.logs.length ? t.logs.join('\n') : 'No logs'}
                  </div>
                </div>
              </div>
            `;
          });

          html += `</div>`;
        }

      } else {

        // =====================
        // INDIVIDUAL MODULE (UNCHANGED)
        // =====================
        data.tests.forEach((t, i) => {

          const id = `${m}-${i}`;

          html += `
            <div class="test" onclick="toggleTest('${id}')">
              ${t.status === 'passed' ? '✔' : '✖'} ${t.title}

              <span class="status ${t.status}">
                ${t.status.toUpperCase()}
              </span>

              <div class="details" id="${id}">
                <p><b>File:</b> ${t.file}</p>
                <p><b>Duration:</b> ${t.duration} ms</p>

                ${t.error ? `<p style="color:red;">${t.error}</p>` : ''}

                <div class="logbox">
                  ${t.logs.length ? t.logs.join('\n') : 'No logs'}
                </div>
              </div>
            </div>
          `;
        });
      }

      html += `</div>`;
    }

    html += `
</div>
</body>
</html>
`;

    const dir = path.join(process.cwd(), 'custom-report');
    fs.mkdirSync(dir, { recursive: true });

    const file = path.join(dir, 'report.html');
    fs.writeFileSync(file, html);

    console.log('🎉 HUSA Report generated at:', file);
  }
}

module.exports = ModuleReporter;




// console.log('🚀 HUSA AUTOMATION REPORTER LOADED');

// const fs = require('fs');
// const path = require('path');

// class ModuleReporter {
//   constructor() {
//     this.results = [];
//   }

//   getModule(test) {
//     const filePath = test.location.file;
//     const parts = filePath.split(path.sep);
//     return parts[parts.length - 2] || 'unknown';
//   }

//   onTestEnd(test, result) {
//     const moduleName = this.getModule(test);

//     this.results.push({
//       title: test.title,
//       file: test.location.file,
//       module: moduleName,
//       status: result.status,
//       error: result.error ? result.error.message : null,
//       duration: result.duration || 0,
//       logs: result.stdout ? result.stdout.map(x => x.toString()) : []
//     });
//   }

//   onEnd() {

//     // =====================
//     // GROUP DATA
//     // =====================
//     const grouped = {};

//     for (const r of this.results) {
//       if (!grouped[r.module]) {
//         grouped[r.module] = {
//           total: 0,
//           passed: 0,
//           failed: 0,
//           tests: []
//         };
//       }

//       grouped[r.module].total++;
//       if (r.status === 'passed') grouped[r.module].passed++;
//       else grouped[r.module].failed++;

//       grouped[r.module].tests.push(r);
//     }

//     const total = this.results.length;
//     const passed = this.results.filter(t => t.status === 'passed').length;
//     const failed = this.results.filter(t => t.status !== 'passed').length;

//     // =====================
//     // CREATE ALL VIRTUAL MODULE
//     // =====================
//     const allGrouped = {
//       ALL: {
//         total,
//         passed,
//         failed,
//         tests: this.results
//       },
//       ...grouped
//     };

//     // =====================
//     // HTML START
//     // =====================
//     let html = `
// <!DOCTYPE html>
// <html>
// <head>
// <title>HUSA Automation Report</title>

// <style>
// body {
//   font-family: Arial;
//   background:#f5f5f5;
//   margin:0;
// }

// /* ===== SIDEBAR ===== */
// .sidebar {
//   width:240px;
//   position:fixed;
//   height:100vh;
//   background:white;
//   border-right:1px solid #ddd;
//   overflow:auto;
// }

// .module-link {
//   padding:10px;
//   border-bottom:1px solid #eee;
//   cursor:pointer;
// }

// .module-link:hover {
//   background:#f2f2f2;
// }

// .module-link.active {
//   background:#e6e6e6;
// }

// .module-link.pass {
//   color:#1a7f37;
//   font-weight:600;
// }

// .module-link.fail {
//   color:#d93025;
//   font-weight:600;
// }

// /* ===== CONTENT ===== */
// .content {
//   margin-left:260px;
//   padding:20px;
// }

// /* ===== MODULE HEADER ===== */
// .module-header {
//   padding:10px;
//   border-radius:6px;
// }

// .module-header.active {
//   background:#e6e6e6;
// }

// /* ===== TEST BOX ===== */
// .test {
//   background:white;
//   margin:10px 0;
//   padding:12px;
//   border-radius:6px;
//   border-left:4px solid #ccc;
// }

// .status {
//   display:inline-block;
//   padding:3px 10px;
//   border-radius:20px;
//   font-size:12px;
//   margin-left:8px;
//   font-weight:bold;
// }

// .status.passed {
//   background:#e6f9ed;
//   color:#1a7f37;
//   border:1px solid #1a7f37;
// }

// .status.failed {
//   background:#ffe6e6;
//   color:#d93025;
//   border:1px solid #d93025;
// }

// /* ===== DETAILS ===== */
// .details {
//   display:none;
//   background:#fafafa;
//   padding:10px;
//   margin-top:10px;
//   border-left:3px solid #007bff;
// }

// .logbox {
//   background:black;
//   color:#00ff88;
//   padding:10px;
//   font-size:12px;
//   white-space:pre-wrap;
// }
// </style>

// <script>
// window.__activeModule = null;

// function toggle(id){
//   const el = document.getElementById(id);
//   el.style.display = el.style.display === 'block' ? 'none' : 'block';
// }

// function openModule(id){
//   window.__activeModule = id;

//   document.querySelectorAll('.module-link').forEach(el => {
//     el.classList.remove('active');
//   });

//   const activeEl = document.getElementById('link-' + id);
//   if (activeEl) activeEl.classList.add('active');

//   document.querySelectorAll('.module-header').forEach(h => {
//     h.classList.remove('active');
//   });

//   const header = document.getElementById('header-' + id);
//   if (header) header.classList.add('active');

//   document.querySelectorAll('.module-section').forEach(m => {
//     m.style.display = 'none';
//   });

//   const el = document.getElementById('section-' + id);
//   if (el) {
//     el.style.display = 'block';
//     el.scrollIntoView({ behavior:'smooth' });
//   }
// }
// </script>

// </head>

// <body>

// <h2 style="padding:10px;">📊 HUSA AUTOMATION REPORT</h2>

// <div style="padding:10px; display:flex; gap:20px; font-weight:bold;">
//   <div style="color:#007bff;">Total Tests: ${total}</div>
//   <div style="color:green;">Passed: ${passed}</div>
//   ${failed > 0 ? `<div style="color:red;">Failed: ${failed}</div>` : ''}
// </div>

// <!-- ===================== -->
// <!-- SIDEBAR -->
// <!-- ===================== -->
// <div class="sidebar">
//   <h3 style="padding:10px;">Modules</h3>
// `;

//     // =====================
//     // SIDEBAR (ADD ALL FIRST)
//     // =====================
//     for (const m in allGrouped) {
//       const g = allGrouped[m];
//       const statusClass = g.failed > 0 ? 'fail' : 'pass';

//       html += `
//         <div
//           id="link-${m}"
//           class="module-link ${statusClass}"
//           onclick="openModule('${m}')"
//         >
//           ${m} (${g.total})
//         </div>
//       `;
//     }

//     html += `
// </div>

// <div class="content">
// `;

//     // =====================
//     // MODULE DETAILS (INCLUDING ALL)
//     // =====================
//     for (const m in allGrouped) {

//       html += `
//         <div id="section-${m}" class="module-section" style="display:none;">

//           <div class="module-header" id="header-${m}">
//             <h2>📁 ${m}</h2>
//           </div>
//       `;

//       allGrouped[m].tests.forEach((t, i) => {
//         const id = `${m}-${i}`;

//         html += `
//           <div class="test" onclick="toggle('${id}')">
//             ${t.status === 'passed' ? '✔' : '✖'}
//             ${t.title}

//             <span class="status ${t.status}">
//               ${t.status.toUpperCase()}
//             </span>

//             <div class="details" id="${id}">
//               <p><b>File:</b> ${t.file}</p>
//               <p><b>Duration:</b> ${t.duration} ms</p>

//               ${t.error ? `<p style="color:red;">${t.error}</p>` : ''}

//               <h4>Logs</h4>
//               <div class="logbox">
//                 ${t.logs.length ? t.logs.join('\n') : 'No logs'}
//               </div>
//             </div>
//           </div>
//         `;
//       });

//       html += `</div>`;
//     }

//     html += `
// </div>
// </body>
// </html>
// `;

//     // =====================
//     // WRITE FILE
//     // =====================
//     const dir = path.join(process.cwd(), 'custom-report');
//     fs.mkdirSync(dir, { recursive: true });

//     const file = path.join(dir, 'report.html');
//     fs.writeFileSync(file, html);

//     console.log('🎉 HUSA Report generated at:', file);
//   }
// }

// module.exports = ModuleReporter;



// console.log('🚀 HUSA AUTOMATION REPORTER LOADED');

// const fs = require('fs');
// const path = require('path');

// class ModuleReporter {
//   constructor() {
//     this.results = [];
//   }

//   getModule(test) {
//     const filePath = test.location.file;
//     const parts = filePath.split(path.sep);
//     return parts[parts.length - 2] || 'unknown';
//   }

//   onTestEnd(test, result) {
//     const moduleName = this.getModule(test);

//     this.results.push({
//       title: test.title,
//       file: test.location.file,
//       module: moduleName,
//       status: result.status,
//       error: result.error ? result.error.message : null,
//       duration: result.duration || 0,
//       logs: result.stdout ? result.stdout.map(x => x.toString()) : []
//     });
//   }

//   onEnd() {

//     // =====================
//     // GROUP DATA
//     // =====================
//     const grouped = {};

//     for (const r of this.results) {
//       if (!grouped[r.module]) {
//         grouped[r.module] = {
//           total: 0,
//           passed: 0,
//           failed: 0,
//           tests: []
//         };
//       }

//       grouped[r.module].total++;
//       if (r.status === 'passed') grouped[r.module].passed++;
//       else grouped[r.module].failed++;

//       grouped[r.module].tests.push(r);
//     }

//     const total = this.results.length;
//     const passed = this.results.filter(t => t.status === 'passed').length;
//     const failed = this.results.filter(t => t.status !== 'passed').length;

//     // =====================
//     // HTML START
//     // =====================
//     let html = `
// <!DOCTYPE html>
// <html>
// <head>
// <title>HUSA Automation Report</title>

// <style>
// body {
//   font-family: Arial;
//   background:#f5f5f5;
//   margin:0;
// }

// /* ===== SIDEBAR ===== */
// .sidebar {
//   width:240px;
//   position:fixed;
//   height:100vh;
//   background:white;
//   border-right:1px solid #ddd;
//   overflow:auto;
// }

// .module-link {
//   padding:10px;
//   border-bottom:1px solid #eee;
//   cursor:pointer;
// }

// .module-link:hover {
//   background:#f2f2f2;
// }

// .module-link.active {
//   background:#e6e6e6;
// }

// .module-link.pass {
//   color:#1a7f37;
//   font-weight:600;
// }

// .module-link.fail {
//   color:#d93025;
//   font-weight:600;
// }

// /* ===== CONTENT ===== */
// .content {
//   margin-left:260px;
//   padding:20px;
// }


// /* ===== MODULE HEADER ===== */
// .module-header {
//   padding:10px;
//   border-radius:6px;
// }

// .module-header.active {
//   background:#e6e6e6;
// }

// /* ===== TEST BOX ===== */
// .test {
//   background:white;
//   margin:10px 0;
//   padding:12px;
//   border-radius:6px;
//   border-left:4px solid #ccc;
// }

// .status {
//   display:inline-block;
//   padding:3px 10px;
//   border-radius:20px;
//   font-size:12px;
//   margin-left:8px;
//   font-weight:bold;
// }

// .status.passed {
//   background:#e6f9ed;
//   color:#1a7f37;
//   border:1px solid #1a7f37;
// }

// .status.failed {
//   background:#ffe6e6;
//   color:#d93025;
//   border:1px solid #d93025;
// }

// /* ===== DETAILS ===== */
// .details {
//   display:none;
//   background:#fafafa;
//   padding:10px;
//   margin-top:10px;
//   border-left:3px solid #007bff;
// }

// .logbox {
//   background:black;
//   color:#00ff88;
//   padding:10px;
//   font-size:12px;
//   white-space:pre-wrap;
// }
// </style>

// <script>
// window.__activeModule = null;

// function toggle(id){
//   const el = document.getElementById(id);
//   el.style.display = el.style.display === 'block' ? 'none' : 'block';
// }

// function openModule(id){
//   window.__activeModule = id;

//   // sidebar highlight
//   document.querySelectorAll('.module-link').forEach(el => {
//     el.classList.remove('active');
//   });

//   const activeEl = document.getElementById('link-' + id);
//   if (activeEl) activeEl.classList.add('active');

//   // module header highlight
//   document.querySelectorAll('.module-header').forEach(h => {
//     h.classList.remove('active');
//   });

//   const header = document.getElementById('header-' + id);
//   if (header) header.classList.add('active');

//   // show module section only
//   document.querySelectorAll('.module-section').forEach(m => {
//     m.style.display = 'none';
//   });

//   const el = document.getElementById('section-' + id);
//   if (el) {
//     el.style.display = 'block';
//     el.scrollIntoView({ behavior:'smooth' });
//   }
// }
// </script>

// </head>

// <body>

// <h2 style="padding:10px;">📊 HUSA AUTOMATION REPORT</h2>

// <div style="padding:10px; display:flex; gap:20px; font-weight:bold;">
//   <div style="color:#007bff;">Total Tests: ${total}</div>
//   <div style="color:green;">Passed: ${passed}</div>
//   ${failed > 0 ? `<div style="color:red;">Failed: ${failed}</div>` : ''}
// </div>

// <!-- ===================== -->
// <!-- SIDEBAR -->
// <!-- ===================== -->
// <div class="sidebar">
//   <h3 style="padding:10px;">Modules</h3>
// `;

//     // SIDEBAR
//     for (const m in grouped) {
//       const g = grouped[m];
//       const statusClass = g.failed > 0 ? 'fail' : 'pass';

//       html += `
//         <div
//           id="link-${m}"
//           class="module-link ${statusClass}"
//           onclick="openModule('${m}')"
//         >
//           ${m} (${g.total})
//         </div>
//       `;
//     }

//     html += `
// </div>

// <div class="content">
// `;


//     // =====================
//     // MODULE DETAILS
//     // =====================
//     for (const m in grouped) {

//       html += `
//         <div id="section-${m}" class="module-section" style="display:none;">

//           <div class="module-header" id="header-${m}">
//             <h2>📁 ${m}</h2>
//           </div>
//       `;

//       grouped[m].tests.forEach((t, i) => {
//         const id = `${m}-${i}`;

//         html += `
//           <div class="test" onclick="toggle('${id}')">
//             ${t.status === 'passed' ? '✔' : '✖'}
//             ${t.title}

//             <span class="status ${t.status}">
//               ${t.status.toUpperCase()}
//             </span>

//             <div class="details" id="${id}">
//               <p><b>File:</b> ${t.file}</p>
//               <p><b>Duration:</b> ${t.duration} ms</p>

//               ${t.error ? `<p style="color:red;">${t.error}</p>` : ''}

//               <h4>Logs</h4>
//               <div class="logbox">
//                 ${t.logs.length ? t.logs.join('\n') : 'No logs'}
//               </div>
//             </div>
//           </div>
//         `;
//       });

//       html += `</div>`;
//     }

//     html += `
// </div>
// </body>
// </html>
// `;

//     // =====================
//     // WRITE FILE
//     // =====================
//     const dir = path.join(process.cwd(), 'custom-report');
//     fs.mkdirSync(dir, { recursive: true });

//     const file = path.join(dir, 'report.html');
//     fs.writeFileSync(file, html);

//     console.log('🎉 HUSA Report generated at:', file);
//   }
// }

// module.exports = ModuleReporter;





// console.log('🚀 SUMMARY REPORTER LOADED');

// const fs = require('fs');
// const path = require('path');

// class ModuleReporter {
//   constructor() {
//     this.results = [];
//     this.logs = {};
//   }

//   // =========================
//   // GET MODULE NAME
//   // =========================
//   getModule(test) {
//     const filePath = test.location.file;
//     const parts = filePath.split(path.sep);

//     // folder just before spec file
//     return parts[parts.length - 2] || 'unknown';
//   }

//   // =========================
//   // TEST START
//   // =========================
//   onTestBegin(test) {
//     const moduleName = this.getModule(test);

//     if (!this.logs[moduleName]) {
//       this.logs[moduleName] = [];
//     }

//     // ❌ WRONG: test.info().on('stdout')
//     // ✔ DO NOTHING HERE FOR LOGS
//   }

//   // =========================
//   // TEST END
//   // =========================
//   onTestEnd(test, result) {

//     const moduleName = this.getModule(test);

//     if (!this.logs[moduleName]) {
//       this.logs[moduleName] = [];
//     }

//     // ✔ capture console output safely (Playwright supported)
//     const logs =
//       result.stdout
//         ? result.stdout.map(chunk => chunk.toString())
//         : [];

//     this.logs[moduleName].push({
//       test: test.title,
//       logs
//     });

//     this.results.push({
//       title: test.title,
//       file: test.location.file,
//       module: moduleName,
//       status: result.status,
//       error: result.error ? result.error.message : null,
//       duration: result.duration,
//       logs
//     });
//   }

//   // =========================
//   // REPORT END
//   // =========================
//   onEnd() {

//     const grouped = {};

//     // =========================
//     // GROUP BY MODULE
//     // =========================
//     for (const r of this.results) {

//       if (!grouped[r.module]) {
//         grouped[r.module] = {
//           total: 0,
//           passed: 0,
//           failed: 0,
//           tests: []
//         };
//       }

//       grouped[r.module].total++;

//       if (r.status === 'passed') grouped[r.module].passed++;
//       else grouped[r.module].failed++;

//       grouped[r.module].tests.push(r);
//     }

//     // =========================
//     // HTML START
//     // =========================
//     let html = `
// <!DOCTYPE html>
// <html>
// <head>
// <title>Module Report</title>

// <style>
// body { font-family: Arial; background:#f5f5f5; }
// .container { display:flex; }
// .sidebar {
//   width:220px;
//   background:white;
//   height:100vh;
//   overflow:auto;
//   position:fixed;
//   border-right:1px solid #ddd;
// }
// .content { margin-left:240px; padding:20px; }

// .module {
//   padding:10px;
//   cursor:pointer;
//   border-bottom:1px solid #eee;
// }

// .card {
//   background:white;
//   padding:10px;
//   margin:10px;
//   display:inline-block;
//   width:200px;
//   border-radius:6px;
// }

// .test {
//   background:white;
//   margin:10px 0;
//   padding:10px;
//   border-radius:5px;
//   cursor:pointer;
// }

// .details {
//   display:none;
//   background:#fafafa;
//   padding:10px;
//   margin-top:10px;
//   border-left:3px solid #007bff;
// }

// .pass { color:green; }
// .fail { color:red; }

// .logbox {
//   background:black;
//   color:lime;
//   padding:10px;
//   font-size:12px;
//   white-space:pre-wrap;
// }
// </style>

// <script>
// function toggle(id){
//   const el = document.getElementById(id);
//   el.style.display = el.style.display === 'block' ? 'none' : 'block';
// }

// function scrollToModule(id){
//   document.getElementById(id).scrollIntoView({behavior:'smooth'});
// }
// </script>

// </head>

// <body>

// <h1 style="padding:10px;">📊 HUSA Automation Report</h1>

// <div class="container">

// <div class="sidebar">
// <h3 style="padding:10px;">Modules</h3>
// `;

//     // =========================
//     // SIDEBAR
//     // =========================
//     for (const m in grouped) {
//       html += `
//         <div class="module" onclick="scrollToModule('${m}')">
//           ${m} (${grouped[m].total})
//         </div>
//       `;
//     }

//     html += `
// </div>

// <div class="content">
// `;

//     // =========================
//     // DASHBOARD
//     // =========================
//     for (const m in grouped) {
//       html += `
//         <div class="card">
//           <h3 onclick="scrollToModule('${m}')">${m}</h3>
//           <p>Total: ${grouped[m].total}</p>
//           <p class="pass">Passed: ${grouped[m].passed}</p>
//           <p class="fail">Failed: ${grouped[m].failed}</p>
//         </div>
//       `;
//     }

//     html += `<hr/>`;

//     // =========================
//     // DETAILS
//     // =========================
//     for (const m in grouped) {

//       html += `<div id="${m}">
//         <h2>📁 ${m}</h2>`;

//       grouped[m].tests.forEach((t, i) => {

//         const id = `${m}-${i}`;

//         html += `
//           <div class="test" onclick="toggle('${id}')">
//             ${t.status === 'passed' ? '✔' : '✖'}
//             ${t.title}
//             <span class="${t.status}">[${t.status}]</span>

//             <div class="details" id="${id}">
//               <p><b>File:</b> ${t.file}</p>
//               <p><b>Duration:</b> ${t.duration}ms</p>

//               ${t.error ? `<p class="fail">${t.error}</p>` : ''}

//               <h4>Logs</h4>
//               <div class="logbox">
//                 ${t.logs && t.logs.length
//                   ? t.logs.join('\n')
//                   : 'No logs captured'}
//               </div>
//             </div>
//           </div>
//         `;
//       });

//       html += `</div>`;
//     }

//     html += `
// </div>
// </div>
// </body>
// </html>
// `;

//     // =========================
//     // WRITE FILE
//     // =========================
//     const dir = path.join(process.cwd(), 'custom-report');
//     fs.mkdirSync(dir, { recursive: true });

//     const file = path.join(dir, 'report.html');
//     fs.writeFileSync(file, html);

//     console.log('🎉 Report generated at:', file);
//   }
// }

// module.exports = ModuleReporter;





















// console.log('CUSTOM REPORTER LOADED');

// const fs = require('fs');
// const path = require('path');

// class ModuleReporter {
//   constructor() {
//     this.results = [];
//   }

//   onTestEnd(test, result) {

//     // Extract module from file path
//     const filePath = test.location.file;

//     // Example: tests/ui/buildAndprice/bsi-inInventory/test.spec.js
//     const parts = filePath.split(path.sep);

//     // take folder before spec file
//     const moduleName = parts[parts.length - 2] || 'unknown';

//     this.results.push({
//       title: test.title,
//       file: filePath,
//       module: moduleName,
//       status: result.status
//     });
//   }

//   onEnd() {

//     const grouped = {};

//     // =========================
//     // GROUP BY MODULE
//     // =========================
//     for (const r of this.results) {

//       if (!grouped[r.module]) {
//         grouped[r.module] = {
//           total: 0,
//           passed: 0,
//           failed: 0,
//           tests: []
//         };
//       }

//       grouped[r.module].total++;

//       if (r.status === 'passed') grouped[r.module].passed++;
//       else grouped[r.module].failed++;

//       grouped[r.module].tests.push(r);
//     }

//     // =========================
//     // HTML HEADER
//     // =========================
//     let html = `
//     <html>
//     <head>
//       <style>
//         body { font-family: Arial; }

//         table {
//           border-collapse: collapse;
//           width: 80%;
//         }

//         th, td {
//           border: 1px solid #ddd;
//           padding: 8px;
//         }

//         th {
//           background: #333;
//           color: white;
//         }

//         .pass { color: green; font-weight: bold; }
//         .fail { color: red; font-weight: bold; }

//         .module-link {
//           margin: 10px;
//           display: inline-block;
//           padding: 8px;
//           background: #007bff;
//           color: white;
//           text-decoration: none;
//           border-radius: 5px;
//         }

//         .section {
//           margin-top: 40px;
//           padding: 10px;
//           border-top: 2px solid #ccc;
//         }
//       </style>
//     </head>

//     <body>

//     <h1>📊 Module Wise Test Report</h1>

//     <h2>Summary</h2>

//     <table>
//       <tr>
//         <th>Module</th>
//         <th>Total</th>
//         <th>Passed</th>
//         <th>Failed</th>
//       </tr>
//     `;

//     // =========================
//     // SUMMARY TABLE
//     // =========================
//     for (const module in grouped) {

//       html += `
//         <tr>
//           <td>
//             <a href="#${module}">${module}</a>
//           </td>
//           <td>${grouped[module].total}</td>
//           <td class="pass">${grouped[module].passed}</td>
//           <td class="fail">${grouped[module].failed}</td>
//         </tr>
//       `;
//     }

//     html += `</table>`;

//     // =========================
//     // DETAILED SECTION
//     // =========================
//     html += `<h2>Details</h2>`;

//     for (const module in grouped) {

//       html += `
//         <div class="section" id="${module}">
//           <h2>${module}</h2>
//       `;

//       for (const t of grouped[module].tests) {

//         html += `
//           <div>
//             ${t.status === 'passed' ? '✔' : '✖'}
//             ${t.title}
//             <span class="${t.status}">
//               [${t.status}]
//             </span>
//           </div>
//         `;
//       }

//       html += `</div>`;
//     }

//     html += `
//     </body>
//     </html>
//     `;

//     // =========================
//     // WRITE FILE
//     // =========================
//     const dir = path.join(process.cwd(), 'custom-report');

//     fs.mkdirSync(dir, { recursive: true });

//     const filePath = path.join(dir, 'report.html');

//     fs.writeFileSync(filePath, html);

//     console.log('Custom report generated at:', filePath);
//   }
// }

// module.exports = ModuleReporter;