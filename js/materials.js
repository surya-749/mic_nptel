// ===== materials.js =====

const resourceTypeMap = {
  notes: { icon: '📝', label: 'Notes' },
  video: { icon: '🎥', label: 'Video' },
  reference: { icon: '📖', label: 'Reference' }
};

let allWeeks = [];

async function initMaterials() {
  try {
    const data = await fetchData('data/materials.json');
    allWeeks = data.weeks;

    // Populate week filter
    const weekFilter = document.getElementById('weekFilter');
    allWeeks.forEach(w => {
      const opt = document.createElement('option');
      opt.value = w.week;
      opt.textContent = `Week ${w.week}`;
      weekFilter.appendChild(opt);
    });

    // If URL has ?week=N, pre-select it and open that card
    const paramWeek = getParam('week');
    if (paramWeek) weekFilter.value = paramWeek;

    renderWeeks();

    // Open card from URL param after render
    if (paramWeek) {
      const card = document.getElementById(`week-card-${paramWeek}`);
      if (card) {
        card.classList.add('open');
        setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }

    // Events
    document.getElementById('searchInput').addEventListener('input', renderWeeks);
    weekFilter.addEventListener('change', renderWeeks);
    document.getElementById('typeFilter').addEventListener('change', renderWeeks);

  } catch(e) {
    document.getElementById('weekCards').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3>Could not load materials</h3>
        <p>${e.message}</p>
      </div>`;
  }
}

function renderWeeks() {
  const search = document.getElementById('searchInput').value.toLowerCase().trim();
  const weekVal = document.getElementById('weekFilter').value;
  const typeVal = document.getElementById('typeFilter').value;

  let filtered = allWeeks.filter(w => {
    if (weekVal && String(w.week) !== weekVal) return false;

    const matchTopic = w.topics.some(t => t.toLowerCase().includes(search));
    const matchTitle = w.title.toLowerCase().includes(search);
    const matchResource = w.resources.some(r =>
      r.title.toLowerCase().includes(search) ||
      r.description.toLowerCase().includes(search)
    );

    if (search && !matchTopic && !matchTitle && !matchResource) return false;

    if (typeVal) {
      const hasType = w.resources.some(r => r.type === typeVal);
      if (!hasType) return false;
    }

    return true;
  });

  const container = document.getElementById('weekCards');
  const noResults = document.getElementById('noResults');

  if (filtered.length === 0) {
    container.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');

  container.innerHTML = filtered.map(w => {
    // Filter resources if typeVal set
    const resources = typeVal ? w.resources.filter(r => r.type === typeVal) : w.resources;

    // Highlight matching topics
    const topics = search
      ? w.topics.filter(t => t.toLowerCase().includes(search))
      : w.topics;

    return `
      <div class="week-card" id="week-card-${w.week}">
        <div class="week-header" onclick="toggleWeek('week-card-${w.week}')">
          <div class="week-number">W${w.week}</div>
          <div class="week-info">
            <div class="week-title">Week ${w.week}: ${w.title}</div>
            <div class="week-meta">${w.topics.length} topics &nbsp;·&nbsp; ${w.resources.length} resources</div>
          </div>
          <span class="week-toggle">▾</span>
        </div>
        <div class="week-body">
          <div class="topics-section">
            <div class="subsection-title">📌 Key Topics</div>
            <div class="topics-list">
              ${(search ? topics : w.topics).map(t =>
                `<span class="badge badge-blue">${t}</span>`
              ).join('')}
            </div>
          </div>
          <div class="resources-section">
            <div class="subsection-title">🔗 Resources</div>
            ${resources.map(r => {
              const rm = resourceTypeMap[r.type] || { icon: '📄', label: r.type };
              return `
                <div class="resource-item">
                  <div class="resource-type-icon ${r.type}">${rm.icon}</div>
                  <div class="resource-info">
                    <div class="resource-title">${r.title}</div>
                    <div class="resource-desc">${r.description}</div>
                  </div>
                  <a href="${r.url}" target="_blank" rel="noopener" class="resource-link" title="Open resource">↗</a>
                </div>
              `;
            }).join('')}
          </div>
          <div style="margin-top:1.2rem">
            <a href="quizzes.html?week=${w.week}" class="btn btn-primary" style="font-size:0.48rem;padding:0.6rem 1rem">
              ✏️ Practice Week ${w.week} Quiz →
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleWeek(cardId) {
  const card = document.getElementById(cardId);
  card.classList.toggle('open');
}

initMaterials();
