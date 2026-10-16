// ===== app.js — Shared utilities =====

// Data fetching cache
const _dataCache = {};
async function fetchData(url) {
  if (_dataCache[url]) return _dataCache[url];
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  const data = await res.json();
  _dataCache[url] = data;
  return data;
}

// ===== NAVBAR =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // Close on link click (mobile)
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Highlight active nav link
(function highlightNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
})();

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = '', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? '✅' : type === 'danger' ? '❌' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 280);
  }, duration);
}

// ===== URL PARAMS =====
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// ===== SCORE GRADE =====
function getScoreGrade(percent) {
  if (percent >= 80) return { label: 'Excellent!', cls: 'excellent', emoji: '🏆' };
  if (percent >= 60) return { label: 'Good Job!', cls: 'good', emoji: '👍' };
  if (percent >= 40) return { label: 'Keep Practising', cls: 'average', emoji: '📖' };
  return { label: 'Needs Improvement', cls: 'poor', emoji: '💪' };
}

// ===== LOCAL STORAGE HELPERS =====
function saveProgress(key, data) {
  try { localStorage.setItem('nptel_' + key, JSON.stringify(data)); } catch(e) {}
}

function loadProgress(key) {
  try {
    const s = localStorage.getItem('nptel_' + key);
    return s ? JSON.parse(s) : null;
  } catch(e) { return null; }
}

// ===== FORMAT TIME =====
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
