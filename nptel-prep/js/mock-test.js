// ===== mock-test.js =====

let allMockTests = [];
let allQuestions = {};   // flat map: questionId → question object
let currentMock = null;
let mockQuestions = [];  // resolved question objects for this mock
let mockIndex = 0;
let mockAnswers = {};    // { questionId: selectedOptionIndex }
let timerInterval = null;
let timeLeft = 0;
const letters = ['A', 'B', 'C', 'D', 'E'];

// ===== INIT =====
async function initMockTest() {
  try {
    const data = await fetchData('data/questions.json');
    allMockTests = data.mockTests;

    // Build flat question lookup
    data.assignments.forEach(a => {
      a.questions.forEach(q => {
        allQuestions[q.id] = q;
      });
    });

    renderMockList();
    showMockList();

  } catch(e) {
    document.getElementById('mockCards').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3>Could not load mock tests</h3>
        <p>${e.message}</p>
      </div>`;
    showMockList();
  }
}

// ===== MOCK LIST =====
function renderMockList() {
  const container = document.getElementById('mockCards');
  container.innerHTML = allMockTests.map(mt => {
    const saved = loadProgress(`mock_${mt.id}`);
    const hasSaved = saved && saved.finished;
    const minutes = Math.floor(mt.duration / 60);

    return `
      <div class="mock-card">
        <div class="mock-card-header">
          <div>
            <div class="mock-card-title">🧪 ${mt.title}</div>
            <div class="mock-card-desc">${mt.description}</div>
          </div>
          ${hasSaved ? `<span class="badge badge-green">✓ Completed</span>` : ''}
        </div>
        <div class="mock-meta-row">
          <span class="badge badge-blue">📋 ${mt.questionCount} Questions</span>
          <span class="badge badge-orange">⏱ ${minutes} Minutes</span>
          <span class="badge badge-purple">📚 All 6 Weeks</span>
          ${hasSaved ? `<span class="badge badge-green">Score: ${saved.correct}/${saved.total} (${Math.round(saved.correct/saved.total*100)}%)</span>` : ''}
        </div>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="startMock('${mt.id}')">
            ${hasSaved ? '↺ Retake Test' : '▶ Start Test'}
          </button>
          ${hasSaved ? `<a href="results.html?type=mock&mockId=${mt.id}" class="btn btn-ghost">📊 View Last Results</a>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// ===== START MOCK =====
function startMock(mockId) {
  currentMock = allMockTests.find(mt => mt.id === mockId);
  if (!currentMock) return;

  mockQuestions = currentMock.questionIds.map(id => allQuestions[id]).filter(Boolean);
  mockIndex = 0;
  mockAnswers = {};
  timeLeft = currentMock.duration;

  document.getElementById('mockTitle').textContent = currentMock.title;
  document.getElementById('mockMeta').textContent =
    `${mockQuestions.length} questions · ${Math.floor(currentMock.duration / 60)} minutes`;

  showActiveView();
  startTimer();
  renderMockQuestion();
  renderPalette();
}

// ===== TIMER =====
function startTimer() {
  clearInterval(timerInterval);
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showToast('⏰ Time is up! Submitting automatically…', 'danger');
      setTimeout(submitMock, 1500);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById('timerDisplay');
  if (!el) return;
  const formatted = formatTime(timeLeft);
  el.textContent = `⏱ ${formatted}`;
  if (timeLeft <= 60) {
    el.className = 'timer danger';
  } else if (timeLeft <= 300) {
    el.className = 'timer warning';
  } else {
    el.className = 'timer';
  }
}

// ===== RENDER MOCK QUESTION =====
function renderMockQuestion() {
  const q = mockQuestions[mockIndex];
  const total = mockQuestions.length;
  const selected = mockAnswers[q.id];

  document.getElementById('mockProgressLabel').textContent =
    `Question ${mockIndex + 1}`;
  document.getElementById('mockProgressCount').textContent =
    `${mockIndex + 1} / ${total}`;
  document.getElementById('mockProgressFill').style.width =
    `${((mockIndex + 1) / total) * 100}%`;

  document.getElementById('mockPrevBtn').disabled = mockIndex === 0;
  document.getElementById('mockNextBtn').textContent =
    mockIndex === total - 1 ? 'Review →' : 'Next →';

  const card = document.getElementById('mockQuestionCard');
  card.innerHTML = `
    <div class="question-number">Question ${mockIndex + 1} of ${total}</div>
    <div class="question-text">${q.question}</div>
    <ul class="options-list">
      ${q.options.map((opt, i) => `
        <li class="option-item ${selected === i ? 'selected' : ''}" onclick="mockSelectOption(${i})">
          <label class="option-label">
            <span class="option-letter">${letters[i]}</span>
            <span class="option-text">${opt}</span>
          </label>
        </li>
      `).join('')}
    </ul>
  `;

  renderPalette();
}

function mockSelectOption(index) {
  const q = mockQuestions[mockIndex];
  mockAnswers[q.id] = index;
  renderMockQuestion();
}

function mockNavigate(dir) {
  const next = mockIndex + dir;
  if (next < 0 || next >= mockQuestions.length) return;
  mockIndex = next;
  renderMockQuestion();
}

// ===== PALETTE =====
function renderPalette() {
  const grid = document.getElementById('paletteGrid');
  grid.innerHTML = mockQuestions.map((q, i) => {
    let cls = '';
    if (i === mockIndex) cls = 'current';
    else if (mockAnswers[q.id] !== undefined) cls = 'answered';
    return `<button class="palette-btn ${cls}" onclick="goToQuestion(${i})">${i + 1}</button>`;
  }).join('');
}

function goToQuestion(index) {
  mockIndex = index;
  renderMockQuestion();
}

// ===== SUBMIT =====
function submitMock() {
  clearInterval(timerInterval);

  const answered = Object.keys(mockAnswers).length;
  const total = mockQuestions.length;

  if (answered < total) {
    const unanswered = total - answered;
    const confirmed = confirm(
      `You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}.\n\nSubmit anyway?`
    );
    if (!confirmed) {
      // Resume timer
      startTimer();
      return;
    }
  }

  const correct = mockQuestions.filter(q => mockAnswers[q.id] === q.answer).length;

  saveProgress(`mock_${currentMock.id}`, {
    answers: mockAnswers,
    correct,
    total,
    finished: true,
    duration: currentMock.duration - timeLeft,
    date: new Date().toISOString()
  });

  const params = new URLSearchParams({
    type: 'mock',
    mockId: currentMock.id
  });
  window.location.href = `results.html?${params.toString()}`;
}

// ===== VIEW SWITCHING =====
function showMockList() {
  document.getElementById('mockListView').classList.add('visible');
  document.getElementById('mockActiveView').classList.remove('visible');
}

function showActiveView() {
  document.getElementById('mockListView').classList.remove('visible');
  document.getElementById('mockActiveView').classList.add('visible');
}

initMockTest();
