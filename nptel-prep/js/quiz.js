// ===== quiz.js =====

let allAssignments = [];
let currentAssignment = null;
let currentIndex = 0;
let userAnswers = {};   // { questionId: selectedIndex }
let revealed = {};      // { questionId: true }
const letters = ['A', 'B', 'C', 'D', 'E'];

// ===== INIT =====
async function initQuiz() {
  try {
    const data = await fetchData('data/questions.json');
    allAssignments = data.assignments;

    // Populate week filter
    const weekFilter = document.getElementById('weekFilter');
    const weeks = [...new Set(allAssignments.map(a => a.week))].sort();
    weeks.forEach(w => {
      const opt = document.createElement('option');
      opt.value = w;
      opt.textContent = `Week ${w}`;
      weekFilter.appendChild(opt);
    });

    // Bind filter events
    document.getElementById('searchInput').addEventListener('input', renderQuizList);
    weekFilter.addEventListener('change', renderQuizList);

    // Check URL param to launch directly
    const paramId = getParam('id');
    const paramWeek = getParam('week');

    if (paramId) {
      const assignment = allAssignments.find(a => a.id === paramId);
      if (assignment) { startQuiz(assignment); return; }
    }

    if (paramWeek) {
      weekFilter.value = paramWeek;
    }

    renderQuizList();
    showQuizList();

  } catch(e) {
    document.getElementById('quizCards').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3>Could not load quizzes</h3>
        <p>${e.message}</p>
      </div>`;
    showQuizList();
  }
}

// ===== QUIZ LIST =====
function renderQuizList() {
  const search = document.getElementById('searchInput').value.toLowerCase().trim();
  const weekVal = document.getElementById('weekFilter').value;

  const colors = ['blue','purple','green','orange','red','blue'];

  let filtered = allAssignments.filter(a => {
    if (weekVal && String(a.week) !== String(weekVal)) return false;
    if (search && !a.title.toLowerCase().includes(search) && !a.topic.toLowerCase().includes(search)) return false;
    return true;
  });

  const container = document.getElementById('quizCards');
  const noResults = document.getElementById('noResults');

  if (filtered.length === 0) {
    container.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');
  container.innerHTML = filtered.map((a, i) => {
    // Load saved progress
    const saved = loadProgress(`quiz_${a.id}`);
    const answered = saved ? Object.keys(saved.answers || {}).length : 0;
    const total = a.questions.length;
    const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

    return `
      <div class="card">
        <div class="card-ribbon">Week ${a.week} · ${a.topic}</div>
        <div class="card-header">
          <div class="card-icon">✏️</div>
          <div>
            <div class="card-title">${a.title}</div>
            <div class="card-subtitle">${total} Questions</div>
          </div>
        </div>
        <div class="card-body">
          ${total} MCQ questions on ${a.topic.toLowerCase()}.
          ${answered > 0 ? `<br><span style="color:var(--success);font-size:0.82rem;font-weight:700">✓ ${answered}/${total} answered</span>` : ''}
        </div>
        <div class="card-footer">
          <span class="badge badge-star">★★★ ${total} MCQs</span>
          <div style="display:flex;gap:0.5rem">
            ${answered > 0 ? `<button class="btn btn-ghost" style="font-size:0.45rem;padding:0.45rem 0.75rem" onclick="clearProgress('${a.id}')">↺ Reset</button>` : ''}
            <button class="btn btn-primary" style="font-size:0.48rem;padding:0.5rem 0.9rem" onclick="startQuizById('${a.id}')">Start →</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function startQuizById(id) {
  const assignment = allAssignments.find(a => a.id === id);
  if (assignment) startQuiz(assignment);
}

function clearProgress(id) {
  saveProgress(`quiz_${id}`, {});
  renderQuizList();
  showToast('Progress cleared', '');
}

// ===== START QUIZ =====
function startQuiz(assignment) {
  currentAssignment = assignment;
  currentIndex = 0;
  revealed = {};

  // Restore saved answers
  const saved = loadProgress(`quiz_${assignment.id}`);
  userAnswers = (saved && saved.answers) ? saved.answers : {};

  document.getElementById('quizTitle').textContent = `${assignment.title} — ${assignment.topic}`;
  document.getElementById('topicBadge').textContent = `Week ${assignment.week}`;

  showActiveView();
  renderQuestion();
}

// ===== RENDER QUESTION =====
function renderQuestion() {
  const q = currentAssignment.questions[currentIndex];
  const total = currentAssignment.questions.length;
  const answered = Object.keys(userAnswers).length;
  const correct = Object.keys(userAnswers).filter(id => {
    const a = currentAssignment.questions.find(x => x.id === id);
    return a && userAnswers[id] === a.answer;
  }).length;

  // Update progress
  document.getElementById('progressCount').textContent = `${currentIndex + 1} / ${total}`;
  document.getElementById('progressFill').style.width = `${((currentIndex + 1) / total) * 100}%`;
  document.getElementById('scoreTrack').textContent =
    answered > 0 ? `Score so far: ${correct}/${answered} correct` : '';

  // Prev/next buttons
  document.getElementById('prevBtn').disabled = currentIndex === 0;
  document.getElementById('nextBtn').textContent = currentIndex === total - 1 ? 'Finish ✓' : 'Next →';

  const isRevealed = revealed[q.id];
  const selected = userAnswers[q.id];

  const card = document.getElementById('questionCard');
  card.innerHTML = `
    <div class="question-number">Question ${currentIndex + 1} of ${total}</div>
    <div class="question-text">${q.question}</div>
    <ul class="options-list" id="optionsList">
      ${q.options.map((opt, i) => {
        let cls = '';
        if (isRevealed) {
          if (i === q.answer) cls = 'correct';
          else if (i === selected && selected !== q.answer) cls = 'incorrect';
        } else if (i === selected) {
          cls = 'selected';
        }
        return `
          <li class="option-item ${cls} ${isRevealed ? 'disabled' : ''}" onclick="${isRevealed ? '' : `selectOption(${i})`}">
            <label class="option-label">
              <span class="option-letter">${letters[i]}</span>
              <span class="option-text">${opt}</span>
              ${isRevealed && i === q.answer ? '<span class="option-indicator">✅</span>' : ''}
              ${isRevealed && i === selected && selected !== q.answer ? '<span class="option-indicator">❌</span>' : ''}
            </label>
          </li>
        `;
      }).join('')}
    </ul>
    ${isRevealed ? `
      <div class="explanation-box ${selected !== q.answer ? 'wrong' : ''}">
        <div class="explanation-title">${selected === q.answer ? '✅ Correct!' : '❌ Incorrect'}</div>
        <div class="explanation-text">${q.explanation}</div>
      </div>
    ` : ''}
  `;

  // Check button state
  const checkBtn = document.getElementById('checkBtn');
  if (isRevealed) {
    checkBtn.textContent = 'Revealed';
    checkBtn.disabled = true;
  } else {
    checkBtn.textContent = 'Check Answer';
    checkBtn.disabled = selected === undefined;
  }
}

// ===== SELECT OPTION =====
function selectOption(index) {
  const q = currentAssignment.questions[currentIndex];
  if (revealed[q.id]) return;
  userAnswers[q.id] = index;
  saveProgress(`quiz_${currentAssignment.id}`, { answers: userAnswers });
  renderQuestion();
}

// ===== CHECK ANSWER =====
function checkAnswer() {
  const q = currentAssignment.questions[currentIndex];
  if (userAnswers[q.id] === undefined) {
    showToast('Please select an answer first', 'danger');
    return;
  }
  revealed[q.id] = true;
  renderQuestion();
}

// ===== NAVIGATE =====
function navigate(direction) {
  const total = currentAssignment.questions.length;
  const next = currentIndex + direction;

  if (next >= total) {
    // Finish — go to results
    finishQuiz();
    return;
  }

  if (next < 0) return;
  currentIndex = next;
  renderQuestion();
}

// ===== FINISH =====
function finishQuiz() {
  const total = currentAssignment.questions.length;
  const correct = currentAssignment.questions.filter(q =>
    userAnswers[q.id] === q.answer
  ).length;

  saveProgress(`quiz_${currentAssignment.id}`, {
    answers: userAnswers,
    correct,
    total,
    finished: true,
    date: new Date().toISOString()
  });

  // Build results URL
  const params = new URLSearchParams({
    type: 'quiz',
    assignmentId: currentAssignment.id
  });
  window.location.href = `results.html?${params.toString()}`;
}

// ===== VIEW SWITCHING =====
function showQuizList() {
  document.getElementById('quizListView').classList.add('visible');
  document.getElementById('quizActiveView').classList.remove('visible');
  renderQuizList();
}

function showActiveView() {
  document.getElementById('quizListView').classList.remove('visible');
  document.getElementById('quizActiveView').classList.add('visible');
}

initQuiz();
