// ===== PROFESSIONAL VECTOR SVG ICONS =====
const UI_ICONS = {
  pen: '<svg class="ui-icon" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
  quiz: '<svg class="ui-icon" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>',
  test: '<svg class="ui-icon" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 14l2 2 4-4"></path></svg>',
  book: '<svg class="ui-icon" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
  chart: '<svg class="ui-icon" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
  search: '<svg class="ui-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
  lightbulb: '<svg class="ui-icon" viewBox="0 0 24 24"><line x1="9" y1="18" x2="15" y2="18"></line><line x1="10" y1="22" x2="14" y2="22"></line><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5h6.18z"></path></svg>',
  target: '<svg class="ui-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
  video: '<svg class="ui-icon" viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>',
  notes: '<svg class="ui-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
  reference: '<svg class="ui-icon" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>',
  clock: '<svg class="ui-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
  home: '<svg class="ui-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
  gradCap: '<svg class="ui-icon" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>',
  play: '<svg class="ui-icon" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',
  refresh: '<svg class="ui-icon" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>',
  check: '<svg class="ui-icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>',
  checkCircle: '<svg class="ui-icon" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
  alertCircle: '<svg class="ui-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
  info: '<svg class="ui-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
  award: '<svg class="ui-icon" viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>',
  arrowRight: '<svg class="ui-icon" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
  arrowLeft: '<svg class="ui-icon" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
  external: '<svg class="ui-icon" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>'
};

function getUiIcon(name, customClass = '') {
  const icon = UI_ICONS[name] || '';
  if (!icon) return '';
  if (!customClass) return icon;
  return icon.replace('class="ui-icon"', `class="ui-icon ${customClass}"`);
}
window.UI_ICONS = UI_ICONS;
window.getUiIcon = getUiIcon;

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
  const icon = type === 'success' ? getUiIcon('checkCircle') : type === 'danger' ? getUiIcon('alertCircle') : getUiIcon('info');
  toast.innerHTML = `<span class="toast-icon">${icon}</span> <span>${message}</span>`;
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
  if (percent >= 80) return { label: 'Excellent!', cls: 'excellent', icon: 'award' };
  if (percent >= 60) return { label: 'Good Job!', cls: 'good', icon: 'checkCircle' };
  if (percent >= 40) return { label: 'Keep Practising', cls: 'average', icon: 'book' };
  return { label: 'Needs Improvement', cls: 'poor', icon: 'info' };
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

