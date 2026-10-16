'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import UiIcon from '@/components/UiIcon';
import { getMockTests, getMockTest, getAssignments } from '@/lib/data';
import { saveProgress, loadProgress, formatTime } from '@/lib/storage';
import { useToast } from '@/components/ToastContext';

const letters = ['A', 'B', 'C', 'D', 'E'];

function MockTestsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const mockTests = getMockTests();
  const assignments = getAssignments();

  // Active mock test ID from query or state
  const [activeMockId, setActiveMockId] = useState(searchParams.get('id') || null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [timerStarted, setTimerStarted] = useState(false);
  const [savedRecords, setSavedRecords] = useState({});

  const timerRef = useRef(null);

  // Sync saved records on mount
  useEffect(() => {
    const records = {};
    mockTests.forEach(m => {
      const saved = loadProgress(`mock_${m.id}`);
      if (saved) records[m.id] = saved;
    });
    setSavedRecords(records);
  }, [mockTests, activeMockId]);

  // Load active mock test
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const mock = getMockTest(id);
      if (mock) {
        setActiveMockId(id);
        setCurrentIndex(0);
        setUserAnswers({});
        setTimeLeft(mock.duration * 60);
        setTimerStarted(true);
      }
    } else {
      setActiveMockId(null);
      setTimerStarted(false);
    }
  }, [searchParams]);

  // Timer countdown
  useEffect(() => {
    if (!timerStarted || !activeMockId) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerStarted, activeMockId]);

  // Question lookup
  const questionMap = useRef({});
  useEffect(() => {
    const map = {};
    assignments.forEach(a => {
      (a.questions || []).forEach(q => {
        map[q.id] = q;
      });
    });
    questionMap.current = map;
  }, [assignments]);

  const activeMock = activeMockId ? getMockTest(activeMockId) : null;
  const mockQuestions = activeMock
    ? (activeMock.questionIds || []).map(id => questionMap.current[id]).filter(Boolean)
    : [];

  const handleStartMock = (id) => {
    router.push(`/mock-tests?id=${id}`);
  };

  const selectOption = (optIndex) => {
    if (!mockQuestions[currentIndex]) return;
    const q = mockQuestions[currentIndex];
    const newAnswers = { ...userAnswers, [q.id]: optIndex };
    setUserAnswers(newAnswers);
    saveProgress(`mock_${activeMockId}`, { answers: newAnswers });
  };

  const handleAutoSubmit = () => {
    showToast("Time's up! Submitting your test automatically…", 'danger');
    finalizeSubmission();
  };

  const handleSubmitTest = () => {
    const answeredCount = Object.keys(userAnswers).length;
    const total = mockQuestions.length;
    const unans = total - answeredCount;

    if (unans > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unans} unanswered question${unans > 1 ? 's' : ''}.\nAre you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }

    finalizeSubmission();
  };

  const finalizeSubmission = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!activeMock) return;

    const timeSpent = activeMock.duration * 60 - timeLeft;
    const correct = mockQuestions.filter(q => userAnswers[q.id] === q.answer).length;
    const total = mockQuestions.length;

    saveProgress(`mock_${activeMock.id}`, {
      answers: userAnswers,
      correct,
      total,
      duration: timeSpent,
      finished: true,
      date: new Date().toISOString()
    });

    router.push(`/results?type=mock&mockId=${activeMock.id}`);
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-content">
          <h1>
            <UiIcon name="test" className="page-title-icon" /> Mock Tests
          </h1>
          <p>Full timed examinations covering all 12 weeks — just like the real NPTEL exam</p>
        </div>
      </div>

      <main className="main-content">
        {!activeMockId || !activeMock ? (
          /* MOCK LIST VIEW */
          <div>
            <div className="section-header">
              <h2>Available Mock Tests</h2>
              <p>Each test has 30 questions with a 45-minute timer. You can review answers after submission.</p>
            </div>

            <div>
              {mockTests.map(m => {
                const saved = savedRecords[m.id];
                const lastAttempt = saved && saved.finished ? saved : null;

                return (
                  <div key={m.id} className="mock-card">
                    <div className="mock-card-header">
                      <div>
                        <div className="mock-card-title">{m.title}</div>
                        <div className="mock-card-desc">{m.description}</div>
                      </div>
                      <span className="badge badge-blue">
                        <UiIcon name="target" /> {m.scope}
                      </span>
                    </div>

                    <div className="mock-meta-row">
                      <span className="badge badge-purple">
                        <UiIcon name="check" /> {m.questionCount} Questions
                      </span>
                      <span className="badge badge-green">
                        <UiIcon name="clock" /> {m.duration} Mins
                      </span>
                      <span className="badge badge-orange">
                        <UiIcon name="gradCap" /> Pass: 40%
                      </span>
                    </div>

                    {lastAttempt && (
                      <div
                        style={{
                          marginBottom: '1.25rem',
                          background: 'rgba(255,255,255,0.85)',
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          border: '2px solid var(--pixel-dark)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '0.6rem'
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                          Last attempt: {lastAttempt.correct}/{lastAttempt.total} (
                          {Math.round((lastAttempt.correct / lastAttempt.total) * 100)}%)
                        </span>
                        <Link
                          href={`/results?type=mock&mockId=${m.id}`}
                          className="btn btn-ghost"
                          style={{ fontSize: '0.45rem', padding: '0.45rem 0.8rem' }}
                        >
                          <UiIcon name="chart" /> View Result
                        </Link>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                      <button className="btn btn-primary" onClick={() => handleStartMock(m.id)}>
                        <UiIcon name="play" /> {lastAttempt ? 'Retake Test' : 'Start Test'} &nbsp;→
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ACTIVE MOCK VIEW */
          <div>
            {/* Mock Header */}
            <div className="mock-header">
              <div>
                <div className="mock-title">{activeMock.title}</div>
                <div className="mock-meta">
                  30 MCQs &nbsp;·&nbsp; {activeMock.duration} Minutes &nbsp;·&nbsp; {activeMock.scope}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  className={`timer ${timeLeft < 60 ? 'danger' : timeLeft < 300 ? 'warning' : ''}`}
                  id="timerDisplay"
                >
                  <UiIcon name="clock" /> {formatTime(timeLeft)}
                </div>
                <button
                  className="btn btn-danger"
                  onClick={handleSubmitTest}
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                >
                  Submit Test
                </button>
              </div>
            </div>

            {/* Quiz Progress */}
            <div className="quiz-progress">
              <div className="quiz-progress-header">
                <span className="quiz-progress-label">Question {currentIndex + 1}</span>
                <span className="quiz-progress-count">
                  {currentIndex + 1} / {mockQuestions.length}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${((currentIndex + 1) / mockQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="quiz-layout">
              <div>
                {/* Question Card */}
                {mockQuestions[currentIndex] && (
                  <div className="question-card">
                    <div className="question-number">
                      Question {currentIndex + 1} of {mockQuestions.length}
                    </div>
                    <div className="question-text">{mockQuestions[currentIndex].question}</div>
                    <ul className="options-list">
                      {mockQuestions[currentIndex].options.map((opt, i) => {
                        const isSelected = userAnswers[mockQuestions[currentIndex].id] === i;
                        return (
                          <li
                            key={i}
                            className={`option-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => selectOption(i)}
                          >
                            <label className="option-label">
                              <span className="option-letter">{letters[i]}</span>
                              <span className="option-text">{opt}</span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                <div className="quiz-nav">
                  <button
                    className="btn btn-ghost"
                    onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                  >
                    ← Prev
                  </button>
                  <button
                    className="btn btn-blue"
                    onClick={() =>
                      setCurrentIndex(prev => Math.min(mockQuestions.length - 1, prev + 1))
                    }
                    disabled={currentIndex === mockQuestions.length - 1}
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* Question Palette */}
              <div className="question-palette">
                <div className="palette-title">Questions</div>
                <div className="palette-grid">
                  {mockQuestions.map((q, idx) => {
                    const isAnswered = userAnswers[q.id] !== undefined;
                    const isCurrent = idx === currentIndex;
                    return (
                      <button
                        key={q.id}
                        className={`palette-btn ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''}`}
                        onClick={() => setCurrentIndex(idx)}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="palette-legend">
                  <div className="legend-item">
                    <div className="legend-dot current"></div>
                    <span>Current</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot answered"></div>
                    <span>Answered</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot"></div>
                    <span>Not answered</span>
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <button
                    className="btn btn-danger"
                    onClick={handleSubmitTest}
                    style={{ width: '100%', fontSize: '0.48rem', padding: '0.7rem 0.5rem' }}
                  >
                    Submit Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default function MockTestsPage() {
  return (
    <Suspense fallback={<div className="main-content text-center mt-3"><p>Loading mock tests...</p></div>}>
      <MockTestsContent />
    </Suspense>
  );
}
