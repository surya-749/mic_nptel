// ===== materials.js =====

const resourceTypeMap = {
  notes: { icon: 'notes', label: 'Notes' },
  video: { icon: 'video', label: 'Video Lecture' },
  reference: { icon: 'reference', label: 'Reference' }
};

let allWeeks = [];
let examStrategy = null;

async function initMaterials() {
  try {
    const data = await fetchData('data/materials.json');
    allWeeks = (data.weeks || []).sort((a, b) => a.week - b.week);
    examStrategy = data.examStrategy;

    // Render Exam Strategy Banner
    renderExamStrategy();

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
        <div class="empty-state-icon">${getUiIcon('alert')}</div>
        <h3>Could not load materials</h3>
        <p>${e.message}</p>
      </div>`;
  }
}

function renderExamStrategy() {
  const container = document.getElementById('examStrategyContainer');
  if (!container || !examStrategy) return;

  const pointsHtml = (examStrategy.points || []).map((pt, i) => {
    const iconName = i === 0 ? 'target' : 'lightbulb';
    const badgeText = i === 0 ? '80% Exam Questions' : 'Conceptual Focus';
    const formatted = pt
      .replace('Assignment Heavy: ', '<strong>Assignment Heavy: </strong>')
      .replace('Conceptual Application: ', '<strong>Conceptual Application: </strong>');
    return `
      <div class="strategy-point">
        <span class="point-badge">${getUiIcon(iconName)} ${badgeText}</span>
        <span>${formatted}</span>
      </div>
    `;
  }).join('');

  const videoBtn = examStrategy.overviewVideo ? `
    <div class="exam-strategy-action">
      <a href="${examStrategy.overviewVideo.url}" target="_blank" rel="noopener" class="btn btn-primary" style="font-size:0.48rem;padding:0.65rem 1.1rem">
        ${getUiIcon('play')} Watch Course Overview Video ↗
      </a>
      <span style="font-size:0.82rem;color:var(--text-muted);align-self:center">
        ${examStrategy.overviewVideo.description}
      </span>
    </div>
  ` : '';

  container.innerHTML = `
    <div class="exam-strategy-banner">
      <div class="exam-strategy-header">
        <div class="exam-strategy-icon">${getUiIcon('lightbulb')}</div>
        <div>
          <div class="exam-strategy-title">Study Strategy for the Exam</div>
          <div class="exam-strategy-subtitle">Understanding Incubation and Entrepreneurship — NPTEL Certification</div>
        </div>
      </div>
      <div class="exam-strategy-points">
        ${pointsHtml}
      </div>
      ${videoBtn}
    </div>
  `;
}

function renderWeeks() {
  const search = document.getElementById('searchInput').value.toLowerCase().trim();
  const weekVal = document.getElementById('weekFilter').value;
  const typeVal = document.getElementById('typeFilter').value;

  let filtered = allWeeks.filter(w => {
    if (weekVal && String(w.week) !== weekVal) return false;

    const matchTitle = w.title.toLowerCase().includes(search);
    const matchCoreFocus = (w.coreFocus || '').toLowerCase().includes(search);
    const matchTakeaway = (w.keyTakeaway || '').toLowerCase().includes(search);
    const matchTopic = (w.topics || []).some(t => t.toLowerCase().includes(search));
    const matchResource = (w.resources || []).some(r =>
      r.title.toLowerCase().includes(search) ||
      (r.description || '').toLowerCase().includes(search)
    );

    if (search && !matchTitle && !matchCoreFocus && !matchTakeaway && !matchTopic && !matchResource) return false;

    if (typeVal) {
      const hasType = (w.resources || []).some(r => r.type === typeVal);
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
    const resources = typeVal ? w.resources.filter(r => r.type === typeVal) : w.resources;
    const topics = search
      ? w.topics.filter(t => t.toLowerCase().includes(search) || (w.coreFocus && w.coreFocus.toLowerCase().includes(search)))
      : w.topics;

    return `
      <div class="week-card" id="week-card-${w.week}">
        <div class="week-header" onclick="toggleWeek('week-card-${w.week}')">
          <div class="week-number">W${w.week}</div>
          <div class="week-info">
            <div class="week-title">Week ${w.week}: ${w.title}</div>
            <div class="week-meta">${w.topics.length} key topics &nbsp;·&nbsp; ${w.resources.length} resources</div>
          </div>
          <span class="week-toggle">▾</span>
        </div>
        <div class="week-body">
          ${w.coreFocus ? `
            <div class="week-core-focus">
              <span class="focus-label">${getUiIcon('target')} Core Focus</span>
              <p class="focus-text">${w.coreFocus}</p>
            </div>
          ` : ''}

          <div class="topics-section">
            <div class="subsection-title">${getUiIcon('notes')} Key Topics</div>
            <div class="topics-list">
              ${(search && topics.length ? topics : w.topics).map(t =>
                `<span class="badge badge-blue">${t}</span>`
              ).join('')}
            </div>
          </div>

          ${w.keyTakeaway ? `
            <div class="week-key-takeaway">
              <span class="takeaway-label">${getUiIcon('lightbulb')} Key Takeaway</span>
              <p class="takeaway-text">${w.keyTakeaway}</p>
            </div>
          ` : ''}

          <div class="resources-section">
            <div class="subsection-title">${getUiIcon('video')} Video Lectures & Study Resources</div>
            ${resources.map(r => {
              const rm = resourceTypeMap[r.type] || { icon: 'notes', label: r.type };
              const isExternal = r.url && r.url !== '#' && r.url.startsWith('http');
              return `
                <div class="resource-item">
                  <div class="resource-type-icon ${r.type}">${getUiIcon(rm.icon)}</div>
                  <div class="resource-info">
                    <div class="resource-title">${r.title}</div>
                    <div class="resource-desc">${r.description}</div>
                  </div>
                  ${isExternal ? `
                    <a href="${r.url}" target="_blank" rel="noopener" class="resource-link" title="Open ${rm.label}">
                      Watch / Open ↗
                    </a>
                  ` : `
                    <span class="resource-link" style="opacity:0.6" title="Study material">Notes</span>
                  `}
                </div>
              `;
            }).join('')}
          </div>
          <div style="margin-top:1.4rem;display:flex;gap:0.75rem;flex-wrap:wrap">
            <a href="quizzes.html?week=${w.week}" class="btn btn-primary" style="font-size:0.48rem;padding:0.6rem 1rem">
              ${getUiIcon('pen')} Practice Week ${w.week} Assignment Quiz &nbsp;→
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleWeek(cardId) {
  const card = document.getElementById(cardId);
  if (card) card.classList.toggle('open');
}

initMaterials();
