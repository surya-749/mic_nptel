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

// ===== BOTTOM NAVIGATION TOGGLE & ACTIVE HIGHLIGHT =====
function toggleBottomMenu(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const menu = document.getElementById('bottomNavMenu');
  const btn = document.getElementById('bottomNavToggle');
  if (!menu) return;
  const isOpen = menu.classList.toggle('open');
  if (btn) {
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
  }
}
window.toggleBottomMenu = toggleBottomMenu;

// Delegated click handling so it works regardless of load timing
document.addEventListener('click', (e) => {
  const toggleBtn = e.target.closest('#bottomNavToggle');
  if (toggleBtn) {
    toggleBottomMenu(e);
    return;
  }
  // Close if clicked outside
  const widget = document.getElementById('bottomNavWidget');
  const menu = document.getElementById('bottomNavMenu');
  const btn = document.getElementById('bottomNavToggle');
  if (widget && !widget.contains(e.target)) {
    if (menu && menu.classList.contains('open')) {
      menu.classList.remove('open');
      if (btn) {
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    }
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const menu = document.getElementById('bottomNavMenu');
    const btn = document.getElementById('bottomNavToggle');
    if (menu) menu.classList.remove('open');
    if (btn) {
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  }
});

// Highlight active link
function highlightBottomNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.bottom-nav-link').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (href === 'index.html' && (!page || page === ''))) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', highlightBottomNav);
} else {
  highlightBottomNav();
}

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

// ===== NATURAL FLOATING PIXEL CLOUDS =====
(function initFloatingClouds() {
  if (document.querySelector('.pixel-clouds-layer')) return;

  const cloudSVGs = [
    // Type 0: Large Fluffy Cloud
    `<svg width="150" height="60" viewBox="0 0 75 30" shape-rendering="crispEdges">
      <path fill="#ffffff" d="M16 11h42v15H8v-9h8z M27 5h20v6H27z M6 15h63v9H6z M2 19h71v6H2z"/>
      <path fill="#aee2fb" d="M2 25h71v3H2z M10 28h55v2H10z"/>
    </svg>`,
    // Type 1: Medium Rounded Cloud
    `<svg width="110" height="48" viewBox="0 0 55 24" shape-rendering="crispEdges">
      <path fill="#ffffff" d="M13 8h29v12H7v-7h6z M20 3h16v5H20z M5 11h45v8H5z M2 14h51v5H2z"/>
      <path fill="#aee2fb" d="M2 19h51v3H2z M9 22h37v2H9z"/>
    </svg>`,
    // Type 2: Small Cute Cloud
    `<svg width="80" height="36" viewBox="0 0 40 18" shape-rendering="crispEdges">
      <path fill="#ffffff" d="M9 6h22v9H5v-6h4z M15 2h10v4h-10z M3 9h34v6H3z"/>
      <path fill="#aee2fb" d="M3 15h34v2H3z M7 17h26v1H7z"/>
    </svg>`,
    // Type 3: Wide Panoramic Cloud
    `<svg width="175" height="54" viewBox="0 0 88 27" shape-rendering="crispEdges">
      <path fill="#ffffff" d="M15 9h58v13H7v-8h8z M26 4h36v5H26z M38 2h12v2H38z M5 13h78v8H5z M2 16h84v5H2z"/>
      <path fill="#aee2fb" d="M2 21h84v3H2z M11 24h66v3H11z"/>
    </svg>`
  ];

  const cloudsConfig = [
    { top: '3%',  svgIdx: 0, speed: 75,  delay: -18, bobDur: 7.2, opacity: 0.95, scale: 1.05 },
    { top: '12%', svgIdx: 1, speed: 105, delay: -64, bobDur: 8.5, opacity: 0.85, scale: 0.90 },
    { top: '22%', svgIdx: 2, speed: 60,  delay: -32, bobDur: 6.2, opacity: 0.92, scale: 0.95 },
    { top: '33%', svgIdx: 3, speed: 90,  delay: -75, bobDur: 9.0, opacity: 0.90, scale: 1.10 },
    { top: '44%', svgIdx: 1, speed: 115, delay: -22, bobDur: 7.8, opacity: 0.82, scale: 0.85 },
    { top: '55%', svgIdx: 0, speed: 70,  delay: -52, bobDur: 6.8, opacity: 0.95, scale: 1.00 },
    { top: '66%', svgIdx: 2, speed: 85,  delay: -15, bobDur: 8.0, opacity: 0.88, scale: 0.92 },
    { top: '76%', svgIdx: 3, speed: 120, delay: -92, bobDur: 9.2, opacity: 0.85, scale: 1.05 },
    { top: '86%', svgIdx: 1, speed: 65,  delay: -40, bobDur: 6.5, opacity: 0.92, scale: 0.95 },
    { top: '93%', svgIdx: 2, speed: 98,  delay: -72, bobDur: 7.5, opacity: 0.80, scale: 0.88 }
  ];

  function createLayer() {
    const layer = document.createElement('div');
    layer.className = 'pixel-clouds-layer';
    layer.setAttribute('aria-hidden', 'true');

    cloudsConfig.forEach(c => {
      const cloud = document.createElement('div');
      cloud.className = 'floating-cloud';
      cloud.style.top = c.top;
      cloud.style.animationDuration = `${c.speed}s`;
      cloud.style.animationDelay = `${c.delay}s`;
      cloud.style.opacity = c.opacity;

      const bob = document.createElement('div');
      bob.className = 'cloud-bob';
      bob.style.animationDuration = `${c.bobDur}s`;
      bob.style.transform = `scale(${c.scale})`;
      bob.innerHTML = cloudSVGs[c.svgIdx];

      cloud.appendChild(bob);
      layer.appendChild(cloud);
    });

    document.body.prepend(layer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createLayer);
  } else {
    createLayer();
  }
})();

