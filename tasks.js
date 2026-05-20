// ── STATE ────────────────────────────────────────────────────
let dragCard    = null;   // the card element being dragged
let dragOrigin  = null;   // original column id
let taskCounter = 10;     // unique id counter for new tasks
 
// ── SIDEBAR ACTIVE ────────────────────────────────────────────
function setActive(el) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
}
 
// ── DRAG & DROP ───────────────────────────────────────────────
function initDragDrop() {
  // Attach events to all existing cards
  document.querySelectorAll('.card').forEach(attachCardEvents);
 
  // Attach drop-zone events to all card lists
  document.querySelectorAll('.cards-list').forEach(attachDropZone);
}
 
function attachCardEvents(card) {
  card.addEventListener('dragstart', onDragStart);
  card.addEventListener('dragend',   onDragEnd);
}
 
function attachDropZone(list) {
  const col = list.closest('.column');
 
  list.addEventListener('dragover', e => {
    e.preventDefault();
    col.classList.add('drag-over');
 
    // Find insertion point
    const after = getDragAfterElement(list, e.clientY);
    if (after == null) {
      list.appendChild(dragCard);
    } else {
      list.insertBefore(dragCard, after);
    }
  });
 
  list.addEventListener('dragleave', e => {
    // Only remove highlight when leaving the list entirely
    if (!list.contains(e.relatedTarget)) {
      col.classList.remove('drag-over');
    }
  });
 
  list.addEventListener('drop', e => {
    e.preventDefault();
    col.classList.remove('drag-over');
    const newCol = col.dataset.col;
    dragCard.dataset.col = newCol;
    updateCounts();
  });
}
 
function onDragStart(e) {
  dragCard   = e.currentTarget;
  dragOrigin = dragCard.closest('.column').dataset.col;
  dragCard.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}
 
function onDragEnd() {
  if (dragCard) dragCard.classList.remove('dragging');
  document.querySelectorAll('.column').forEach(c => c.classList.remove('drag-over'));
  dragCard   = null;
  dragOrigin = null;
  updateCounts();
}
 
// Returns the element directly after the cursor's Y position
function getDragAfterElement(container, y) {
  const draggables = [...container.querySelectorAll('.card:not(.dragging)')];
  return draggables.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
 
// ── COUNT UPDATER ─────────────────────────────────────────────
function updateCounts() {
  const cols = ['todo', 'inprogress', 'review', 'done'];
  let total = 0;
  cols.forEach(col => {
    const count = document.getElementById(`cards-${col}`).querySelectorAll('.card').length;
    document.getElementById(`count-${col}`).textContent = count;
    total += count;
  });
  document.getElementById('active-count').textContent = total;
}
 
// ── MODAL ─────────────────────────────────────────────────────
function openModal(colId) {
  document.getElementById('new-col').value = colId;
  document.getElementById('new-title').value = '';
  document.getElementById('new-desc').value = '';
  document.getElementById('new-priority').value = 'medium';
  document.getElementById('modal-overlay').classList.add('open');
 
  // Trigger reflow then show with animation
  const modal = document.getElementById('modal');
  modal.style.display = 'block';
  requestAnimationFrame(() => modal.classList.add('open'));
 
  setTimeout(() => document.getElementById('new-title').focus(), 80);
}
 
function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('open');
  document.getElementById('modal-overlay').classList.remove('open');
  setTimeout(() => { modal.style.display = 'none'; }, 180);
}
 
// ── ADD TASK ──────────────────────────────────────────────────
function addTask() {
  const title    = document.getElementById('new-title').value.trim();
  const desc     = document.getElementById('new-desc').value.trim();
  const priority = document.getElementById('new-priority').value;
  const colId    = document.getElementById('new-col').value;
 
  if (!title) {
    document.getElementById('new-title').focus();
    document.getElementById('new-title').style.borderColor = '#ef4444';
    return;
  }
  document.getElementById('new-title').style.borderColor = '';
 
  const card = buildCard(++taskCounter, title, desc, priority, colId);
  document.getElementById(`cards-${colId}`).appendChild(card);
  attachCardEvents(card);
  updateCounts();
  closeModal();
 
  // Subtle entrance animation
  card.animate([
    { opacity: 0, transform: 'translateY(-8px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], { duration: 220, easing: 'ease-out', fill: 'backwards' });
}
 
function buildCard(id, title, desc, priority, colId) {
  const colors = {
    high:   ['#fef3c7', '#92400e'],
    medium: ['#e0f2fe', '#075985'],
    low:    ['#dcfce7', '#166534'],
  };
  const [bg, color] = colors[priority] || colors.medium;
 
  const card = document.createElement('div');
  card.className = 'card';
  card.draggable = true;
  card.dataset.id  = id;
  card.dataset.col = colId;
 
  card.innerHTML = `
    <div class="card-top">
      <span class="priority ${priority}" style="background:${bg};color:${color}">
        ${priority.toUpperCase()}
      </span>
      <button class="card-menu">⋮⋮</button>
    </div>
    <div class="card-title">${escapeHtml(title)}</div>
    ${desc ? `<div class="card-desc">${escapeHtml(desc)}</div>` : ''}
    <div class="card-footer">
      <div class="card-meta"></div>
      <div class="card-avatar" style="background:#d1fae5;color:#065f46;">AR</div>
    </div>
  `;
  return card;
}
 
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
 
// ── KEYBOARD: close modal on Escape ──────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if (e.key === 'Enter' && document.getElementById('modal').classList.contains('open')) {
    addTask();
  }
});
 
// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initDragDrop();
  updateCounts();
  document.getElementById('menuBtn').addEventListener('click', () => {
   document.querySelector('.sidebar').classList.toggle('open');
});
});
function togglePopup(id) {
  // Close all others first
  document.querySelectorAll('.popup').forEach(p => p.classList.remove('open'));
  document.getElementById(id).classList.toggle('open');
}

function assignPerson(taskId, initials, name) {
  // Update avatar on the card
  document.querySelector(`#${taskId} .avatar`).textContent = initials;
  // Close popup
  document.querySelector(`#${taskId} .popup`).classList.remove('open');
  // Optionally save to backend
  saveAssignment(taskId, name);
}

// Close popups when clicking outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('.card'))
    document.querySelectorAll('.popup').forEach(p => p.classList.remove('open'));
});
// Team members data
const TEAM = [
  { initials:'JK', name:'Jake K.',  role:'Security Specialist', bg:'#fde68a', color:'#92400e' },
  { initials:'ML', name:'Maya L.',  role:'Senior Backend Eng',  bg:'#1e293b', color:'#fff'    },
  { initials:'AR', name:'Aisha R.', role:'Full-stack Dev',      bg:'#d1fae5', color:'#065f46' },
  { initials:'SA', name:'Sara A.',  role:'UI/UX Designer',      bg:'#fce7f3', color:'#9d174d' },
  { initials:'YM', name:'Youssef M.',role:'Project Manager',    bg:'#bfdbfe', color:'#1e40af' },
];

function openRecommend(btn, taskId) {
  const popup = document.getElementById('recommend-popup');
  const list  = document.getElementById('recommend-list');

  // Position popup near the button
  const rect = btn.getBoundingClientRect();
  popup.style.top  = (rect.bottom + window.scrollY + 6) + 'px';
  popup.style.left = (rect.left  + window.scrollX)     + 'px';

  // Shuffle team for demo (replace with real API call)
  const shuffled = [...TEAM].sort(() => Math.random() - 0.5);
  list.innerHTML = shuffled.map(p => `
    <div class="recommend-row" onclick="assignFromRecommend('${taskId}','${p.initials}','${p.bg}','${p.color}')">
      <div class="rec-avatar" style="background:${p.bg};color:${p.color}">${p.initials}</div>
      <div>
        <div class="rec-name">${p.name}</div>
        <div class="rec-role">${p.role}</div>
      </div>
      <span class="rec-score">${Math.floor(Math.random()*20+80)}%</span>
    </div>
  `).join('');

  popup.classList.toggle('open');
  popup._taskId = taskId;
}

function assignFromRecommend(taskId, initials, bg, color) {
  const card = document.querySelector(`.card[data-id="${taskId}"]`);
  const avatar = card.querySelector('.card-avatar');
  avatar.textContent = initials;
  avatar.style.background = bg;
  avatar.style.color = color;
  document.getElementById('recommend-popup').classList.remove('open');
}

// Close popup when clicking outside
document.addEventListener('click', function(e) {
  const popup = document.getElementById('recommend-popup');
  if (!e.target.closest('.recommend-btn') && !e.target.closest('.recommend-popup')) {
    popup.classList.remove('open');
  }
});
// ── TOUCH DRAG AND DROP ──
let touchCard = null;
let touchOriginCol = null;

document.addEventListener('touchstart', function(e) {
  const card = e.target.closest('.card');
  if (!card) return;
  touchCard = card;
  touchOriginCol = card.dataset.col;
  touchCard.classList.add('dragging');
}, { passive: true });

document.addEventListener('touchmove', function(e) {
  if (!touchCard) return;
  e.preventDefault();

  const touch = e.touches[0];

  // Hide card so we can detect what's underneath
  touchCard.style.visibility = 'hidden';
  const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
  touchCard.style.visibility = 'visible';

  // Find the column we're hovering over
  const targetList = elementBelow?.closest('.cards-list');
  const targetCol  = elementBelow?.closest('.column');

  // Remove all drag-over highlights
  document.querySelectorAll('.column').forEach(c => c.classList.remove('drag-over'));

  if (targetList && targetCol) {
    targetCol.classList.add('drag-over');

    const afterEl = getDragAfterElement(targetList, touch.clientY);
    if (afterEl == null) {
      targetList.appendChild(touchCard);
    } else {
      targetList.insertBefore(touchCard, afterEl);
    }
  }
}, { passive: false });

document.addEventListener('touchend', function() {
  if (!touchCard) return;
  touchCard.classList.remove('dragging');
  document.querySelectorAll('.column').forEach(c => c.classList.remove('drag-over'));
  touchCard.dataset.col = touchCard.closest('.column')?.dataset.col || touchOriginCol;
  updateCounts();
  touchCard = null;
  touchOriginCol = null;
});