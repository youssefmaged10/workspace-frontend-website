/* ─────────────────────────────────────────────
   ProWorkspace – app.js
   ───────────────────────────────────────────── */

/* ══════════════════════════════════════════════
   1. FILE DATA
   ══════════════════════════════════════════════ */
const FILES = [
  {
    id: 1,
    name: "Project Guidelines",
    type: "folder",
    modified: "Oct 24, 2023",
    size: null,
    owner: "Marcus Chen",
    ownerInitials: "MC",
    ownerColor: "#6b8cda"
  },
  {
    id: 2,
    name: "Q4_Budget_Review.pdf",
    type: "pdf",
    modified: "Oct 22, 2023",
    size: "2.4 MB",
    owner: "Sarah Jenkins",
    ownerInitials: "SJ",
    ownerColor: "#e07b54"
  },
  {
    id: 3,
    name: "Hero_Banner_V2.png",
    type: "image",
    modified: "Oct 20, 2023",
    size: "14.8 MB",
    owner: "You",
    ownerInitials: "ME",
    ownerColor: "#1d4ed8"
  },
  {
    id: 4,
    name: "Meeting_Minutes_Final.docx",
    type: "doc",
    modified: "Oct 19, 2023",
    size: "45 KB",
    owner: "David Miller",
    ownerInitials: "DM",
    ownerColor: "#6b8cda"
  },
  {
    id: 5,
    name: "Archives_2022.zip",
    type: "zip",
    modified: "Oct 15, 2023",
    size: "450.2 MB",
    owner: "Marcus Chen",
    ownerInitials: "MC",
    ownerColor: "#6b8cda"
  }
];

const TOTAL_ITEMS = 142;
const PAGE_SIZE   = 5;

/* ══════════════════════════════════════════════
   2. FILE TYPE ICON HELPERS
   ══════════════════════════════════════════════ */
const FILE_ICONS = {
  folder: {
    cssClass: "file-type-icon--folder",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
          </svg>`
  },
  pdf: {
    cssClass: "file-type-icon--pdf",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>`
  },
  image: {
    cssClass: "file-type-icon--image",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>`
  },
  doc: {
    cssClass: "file-type-icon--doc",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>`
  },
  zip: {
    cssClass: "file-type-icon--zip",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
          </svg>`
  }
};

/* ══════════════════════════════════════════════
   3. TABLE RENDERING
   ══════════════════════════════════════════════ */
let currentPage = 1;

function renderTable(files) {
  const tbody = document.getElementById("fileTableBody");
  if (!tbody) return;

  tbody.innerHTML = files.map(file => {
    const icon = FILE_ICONS[file.type] || FILE_ICONS.zip;
    const sizeCell = file.size
      ? `<span>${file.size}</span>`
      : `<span class="size-dash">—</span>`;

    return `
      <tr data-id="${file.id}">
        <td>
          <div class="file-icon-cell">
            <div class="file-type-icon ${icon.cssClass}">${icon.svg}</div>
            <span class="file-name">${escapeHtml(file.name)}</span>
          </div>
        </td>
        <td class="date-cell">${file.modified}</td>
        <td class="size-cell">${sizeCell}</td>
        <td>
          <div class="owner-cell">
            <div class="owner-avatar" style="background:${file.ownerColor}">${file.ownerInitials}</div>
            <span class="owner-name">${escapeHtml(file.owner)}</span>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  // Row click highlight (optional UX)
  tbody.querySelectorAll("tr").forEach(row => {
    row.addEventListener("click", () => {
      tbody.querySelectorAll("tr").forEach(r => r.classList.remove("selected"));
      row.classList.add("selected");
    });
  });
}

function updatePagination() {
  const prevBtn   = document.getElementById("prevBtn");
  const nextBtn   = document.getElementById("nextBtn");
  const countEl   = document.getElementById("tableCount");
  const totalPages = Math.ceil(TOTAL_ITEMS / PAGE_SIZE);

  if (prevBtn) prevBtn.disabled = currentPage === 1;
  if (nextBtn) nextBtn.disabled = currentPage === totalPages;

  if (countEl) {
    const start = (currentPage - 1) * PAGE_SIZE + 1;
    const end   = Math.min(currentPage * PAGE_SIZE, TOTAL_ITEMS);
    countEl.textContent = `Showing ${start}–${end} of ${TOTAL_ITEMS} items`;
  }
}

function escapeHtml(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

/* ══════════════════════════════════════════════
   4. SEARCH / FILTER
   ══════════════════════════════════════════════ */
function setupSearch() {
  const input = document.querySelector(".search-input");
  if (!input) return;

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    const filtered = query
      ? FILES.filter(f => f.name.toLowerCase().includes(query) || f.owner.toLowerCase().includes(query))
      : FILES;
    renderTable(filtered);
  });
}

/* ══════════════════════════════════════════════
   5. PAGINATION
   ══════════════════════════════════════════════ */
function setupPagination() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const totalPages = Math.ceil(TOTAL_ITEMS / PAGE_SIZE);

  prevBtn?.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      updatePagination();
      // In a real app, fetch new page data. Here we just keep the same 5 rows.
      flashTable();
    }
  });

  nextBtn?.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      updatePagination();
      flashTable();
    }
  });
}

function flashTable() {
  const wrapper = document.querySelector(".file-table-wrapper");
  if (!wrapper) return;
  wrapper.style.opacity = "0.5";
  wrapper.style.transition = "opacity 0.15s";
  setTimeout(() => { wrapper.style.opacity = "1"; }, 200);
}

/* ══════════════════════════════════════════════
   6. MODAL: NEW FOLDER
   ══════════════════════════════════════════════ */
function setupNewFolderModal() {
  const openBtn    = document.getElementById("newFolderBtn");
  const modal      = document.getElementById("newFolderModal");
  const cancelBtn  = document.getElementById("cancelFolderBtn");
  const confirmBtn = document.getElementById("confirmFolderBtn");
  const nameInput  = document.getElementById("folderNameInput");

  openBtn?.addEventListener("click", () => {
    if (nameInput) nameInput.value = "";
    modal?.classList.add("open");
    setTimeout(() => nameInput?.focus(), 100);
  });

  cancelBtn?.addEventListener("click", () => modal?.classList.remove("open"));

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("open");
  });

  confirmBtn?.addEventListener("click", () => {
    const name = nameInput?.value.trim();
    if (!name) { shakeInput(nameInput); return; }

    // Add new folder to the top of the table
    const newFolder = {
      id: Date.now(),
      name,
      type: "folder",
      modified: formatToday(),
      size: null,
      owner: "You",
      ownerInitials: "ME",
      ownerColor: "#1d4ed8"
    };
    FILES.unshift(newFolder);
    renderTable(FILES.slice(0, PAGE_SIZE));
    modal.classList.remove("open");
    showToast(`Folder "${name}" created`);
  });

  nameInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") confirmBtn?.click();
    if (e.key === "Escape") cancelBtn?.click();
  });
}

/* ══════════════════════════════════════════════
   7. MODAL: UPLOAD
   ══════════════════════════════════════════════ */
function setupUploadModal() {
  const openBtn    = document.getElementById("uploadBtn");
  const modal      = document.getElementById("uploadModal");
  const cancelBtn  = document.getElementById("cancelUploadBtn");
  const confirmBtn = document.getElementById("confirmUploadBtn");
  const fileInput  = document.getElementById("fileInput");
  const filenameEl = document.getElementById("uploadFilename");
  const uploadZone = document.getElementById("uploadZone");

  openBtn?.addEventListener("click", () => {
    if (fileInput) fileInput.value = "";
    if (filenameEl) filenameEl.textContent = "";
    modal?.classList.add("open");
  });

  cancelBtn?.addEventListener("click", () => modal?.classList.remove("open"));

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("open");
  });

  fileInput?.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file && filenameEl) {
      filenameEl.textContent = file.name;
    }
  });

  // Drag & drop on zone
  uploadZone?.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = "#1d4ed8";
    uploadZone.style.background = "#f5f8ff";
  });
  uploadZone?.addEventListener("dragleave", () => {
    uploadZone.style.borderColor = "";
    uploadZone.style.background = "";
  });
  uploadZone?.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = "";
    uploadZone.style.background = "";
    const dropped = e.dataTransfer?.files[0];
    if (dropped && filenameEl) {
      filenameEl.textContent = dropped.name;
      // Simulate file input selection for upload
      const dt = new DataTransfer();
      dt.items.add(dropped);
      if (fileInput) fileInput.files = dt.files;
    }
  });

  confirmBtn?.addEventListener("click", () => {
    const file = fileInput?.files[0];
    if (!file) { showToast("Please select a file first", "error"); return; }

    const ext = file.name.split(".").pop().toLowerCase();
    const typeMap = {
      pdf: "pdf", png: "image", jpg: "image", jpeg: "image", gif: "image",
      webp: "image", docx: "doc", doc: "doc", txt: "doc",
      zip: "zip", rar: "zip", "7z": "zip"
    };
    const type = typeMap[ext] || "zip";

    const newFile = {
      id: Date.now(),
      name: file.name,
      type,
      modified: formatToday(),
      size: formatBytes(file.size),
      owner: "You",
      ownerInitials: "ME",
      ownerColor: "#1d4ed8"
    };
    FILES.unshift(newFile);
    renderTable(FILES.slice(0, PAGE_SIZE));
    modal.classList.remove("open");
    showToast(`"${file.name}" uploaded successfully`);
  });
}

/* ══════════════════════════════════════════════
   8. NOTIFICATIONS
   ══════════════════════════════════════════════ */
function setupNotifications() {
  const btn   = document.getElementById("notifBtn");
  const panel = document.getElementById("notifPanel");
  const close = document.getElementById("notifClose");

  btn?.addEventListener("click", (e) => {
    e.stopPropagation();
    panel?.classList.toggle("open");
  });

  close?.addEventListener("click", () => panel?.classList.remove("open"));

  document.addEventListener("click", (e) => {
    if (!panel?.contains(e.target) && e.target !== btn) {
      panel?.classList.remove("open");
    }
  });
}

/* ══════════════════════════════════════════════
   9. TOAST MESSAGES
   ══════════════════════════════════════════════ */
function showToast(message, type = "success") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
    <span class="toast__icon">${type === "success" ? "✓" : "✕"}</span>
    <span>${escapeHtml(message)}</span>
  `;

  // Inline styles so no extra CSS needed (self-contained)
  Object.assign(toast.style, {
    position:     "fixed",
    bottom:       "24px",
    right:        "24px",
    background:   type === "success" ? "#1a1d23" : "#dc2626",
    color:        "#fff",
    padding:      "10px 18px",
    borderRadius: "9px",
    fontSize:     "13.5px",
    fontWeight:   "500",
    display:      "flex",
    alignItems:   "center",
    gap:          "8px",
    boxShadow:    "0 4px 20px rgba(0,0,0,0.18)",
    zIndex:       "9999",
    animation:    "fadeUp 0.2s ease",
    fontFamily:   "DM Sans, sans-serif"
  });

  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = "0"; toast.style.transition = "opacity 0.3s"; }, 2500);
  setTimeout(() => toast.remove(), 2900);
}

/* ══════════════════════════════════════════════
   10. UTILITY HELPERS
   ══════════════════════════════════════════════ */
function formatToday() {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function shakeInput(el) {
  if (!el) return;
  el.style.borderColor = "#dc2626";
  el.animate([
    { transform: "translateX(0)" },
    { transform: "translateX(-5px)" },
    { transform: "translateX(5px)" },
    { transform: "translateX(0)" }
  ], { duration: 300, iterations: 1 });
  setTimeout(() => { el.style.borderColor = ""; }, 800);
}

/* ══════════════════════════════════════════════
   11. KEYBOARD SHORTCUTS
   ══════════════════════════════════════════════ */
document.addEventListener("keydown", (e) => {
  // Cmd/Ctrl + K → focus search
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    document.querySelector(".search-input")?.focus();
  }
  // Escape → close all modals
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-overlay.open").forEach(m => m.classList.remove("open"));
    document.getElementById("notifPanel")?.classList.remove("open");
  }
});

/* ══════════════════════════════════════════════
   12. INIT
   ══════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  renderTable(FILES);
  updatePagination();
  setupSearch();
  setupPagination();
  setupNewFolderModal();
  setupUploadModal();
  setupNotifications();
});
document.getElementById('menuBtn').addEventListener('click', () => {
  document.querySelector('.sidebar').classList.toggle('open');
});