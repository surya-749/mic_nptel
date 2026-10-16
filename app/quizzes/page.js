'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import UiIcon from '@/components/UiIcon';
import { useCourse } from '@/components/CourseContext';
import { getAssignments, getAssignment, isAnswerCorrect } from '@/lib/data';
import { saveProgress, loadProgress, clearProgress } from '@/lib/storage';
import { useToast } from '@/components/ToastContext';

const letters = ['A', 'B', 'C', 'D', 'E'];

function QuizzesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { currentCourse, courseMeta } = useCourse();

  const allAssignments = getAssignments(currentCourse);

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWeek, setSelectedWeek] = useState(searchParams.get('week') || '');

  // Active quiz state
  const [activeAssignmentId, setActiveAssignmentId] = useState(searchParams.get('id') || null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [savedRecords, setSavedRecords] = useState({});

  // Sync saved records on mount and active state changes
  useEffect(() => {
    const records = {};
    allAssignments.forEach(a => {
      const saved = loadProgress(`quiz_${a.id}`);
      if (saved) records[a.id] = saved;
    });
    setSavedRecords(records);
  }, [allAssignments, activeAssignmentId]);

  // When activeAssignmentId changes via URL or click
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setActiveAssignmentId(id);
      const saved = loadProgress(`quiz_${id}`);
      setUserAnswers(saved && saved.answers ? saved.answers : {});
      setCurrentIndex(0);
      setRevealed({});
    } else {
      setActiveAssignmentId(null);
    }
  }, [searchParams]);

  const currentAssignment = activeAssignmentId ? getAssignment(activeAssignmentId, currentCourse) : null;

  // Filter assignments
  const filteredAssignments = allAssignments.filter(a => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWeek = selectedWeek ? String(a.week) === selectedWeek : true;
    return matchesSearch && matchesWeek;
  });

  const handleStartQuiz = (id) => {
    router.push(`/quizzes?id=${id}`);
  };

  const handleBackToList = () => {
    router.push('/quizzes');
  };

  const handleResetProgress = (id, e) => {
    e.stopPropagation();
    clearProgress(`quiz_${id}`);
    setSavedRecords(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    if (activeAssignmentId === id) {
      setUserAnswers({});
      setRevealed({});
    }
    showToast('Quiz progress reset', 'info');
  };

  const selectOption = (optIndex) => {
    if (!currentAssignment) return;
    const q = currentAssignment.questions[currentIndex];
    if (revealed[q.id]) return;

    const isMulti = q.isMultiple || Array.isArray(q.answer);
    if (isMulti) {
      const prev = Array.isArray(userAnswers[q.id]) ? userAnswers[q.id] : [];
      const updated = prev.includes(optIndex)
        ? prev.filter(i => i !== optIndex)
        : [...prev, optIndex].sort((a, b) => a - b);
      const newAnswers = { ...userAnswers, [q.id]: updated };
      setUserAnswers(newAnswers);
      saveProgress(`quiz_${currentAssignment.id}`, { answers: newAnswers });
    } else {
      const newAnswers = { ...userAnswers, [q.id]: optIndex };
      setUserAnswers(newAnswers);
      saveProgress(`quiz_${currentAssignment.id}`, { answers: newAnswers });
    }
  };

  const checkAnswer = () => {
    if (!currentAssignment) return;
    const q = currentAssignment.questions[currentIndex];
    const isMulti = q.isMultiple || Array.isArray(q.answer);
    const ans = userAnswers[q.id];
    if (ans === undefined || (isMulti && (!Array.isArray(ans) || ans.length === 0))) {
      showToast('Please select an answer first', 'danger');
      return;
    }
    setRevealed(prev => ({ ...prev, [q.id]: true }));
  };

  const navigate = (direction) => {
    if (!currentAssignment) return;
    const total = currentAssignment.questions.length;
    const next = currentIndex + direction;

    if (next >= total) {
      // Finish quiz
      const correct = currentAssignment.questions.filter(
        q => isAnswerCorrect(userAnswers[q.id], q.answer)
      ).length;

      saveProgress(`quiz_${currentAssignment.id}`, {
        answers: userAnswers,
        correct,
        total,
        finished: true,
        date: new Date().toISOString()
      });

      router.push(`/results?type=quiz&assignmentId=${currentAssignment.id}`);
      return;
    }

    if (next >= 0 && next < total) {
      setCurrentIndex(next);
    }
  };

  // Weeks list for filter dropdown
  const weeksList = Array.from(new Set(allAssignments.map(a => a.week))).sort((a, b) => a - b);

  return (
    <>
      <div className="page-header">
        <div className="page-header-content">
          <div className="badge badge-blue" style={{ marginBottom: '0.6rem', alignSelf: 'flex-start' }}>
            <UiIcon name={courseMeta.icon || 'book'} /> {courseMeta.name}
          </div>
          <h1>
            <UiIcon name="pen" className="page-title-icon" /> Assignment Quizzes
          </h1>
          <p>Practice assignment-wise MCQs with instant feedback and detailed explanations for {courseMeta.name}</p>
        </div>
      </div>

      <main className="main-content">
        {!activeAssignmentId || !currentAssignment ? (
          /* QUIZ LIST VIEW */
          <div>
            <div className="filter-bar">
              <div className="search-input-wrapper">
                <span className="search-icon">
                  <UiIcon name="search" />
                </span>
                <input
                  type="text"
                  className="search-input"
                  placeholder={`Search ${courseMeta.name} quizzes…`}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <select
                className="filter-select"
                value={selectedWeek}
                onChange={e => setSelectedWeek(e.target.value)}
              >
                <option value="">All Weeks</option>
                {weeksList.map(w => (
                  <option key={w} value={w}>
                    Week {w}
                  </option>
                ))}
              </select>
            </div>

            {filteredAssignments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <UiIcon name="search" style={{ width: 36, height: 36 }} />
                </div>
                <h3>No quizzes found</h3>
                <p>Try a different keyword or clear the filter for {courseMeta.name}</p>
              </div>
            ) : (
              <div className="cards-grid">
                {filteredAssignments.map(a => {
                  const saved = savedRecords[a.id];
                  const answered = saved && saved.answers ? Object.keys(saved.answers).length : 0;
                  const total = a.questions ? a.questions.length : 0;

                  return (
                    <div key={a.id} className="card">
                      <div className="card-ribbon">
                        Week {a.week} · {a.topic}
                      </div>
                      <div className="card-header">
                        <div className="card-icon">
                          <UiIcon name="pen" />
                        </div>
                        <div>
                          <div className="card-title">{a.title}</div>
                          <div className="card-subtitle">{total} Questions</div>
                        </div>
                      </div>
                      <div className="card-body">
                        MCQ practice covering {a.topic.toLowerCase()}.
                        {saved && saved.finished && (
                          <div className="quiz-result-inline">
                            Score: {saved.correct}/{saved.total} ({Math.round((saved.correct / saved.total) * 100)}%)
                          </div>
                        )}
                        {saved && !saved.finished && answered > 0 && (
                          <div className="quiz-result-inline in-progress">
                            In progress: {answered}/{total} answered
                          </div>
                        )}
                      </div>
                      <div className="card-footer">
                        <span className="badge badge-star">
                          <UiIcon name="check" /> {total} MCQs
                        </span>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          {saved && (
                            <button
                              type="button"
                              className="btn btn-ghost"
                              style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
                              onClick={e => handleResetProgress(a.id, e)}
                              title="Reset saved progress"
                            >
                              <UiIcon name="refresh" />
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ fontSize: '0.48rem', padding: '0.55rem 0.9rem' }}
                            onClick={() => handleStartQuiz(a.id)}
                          >
                            {saved ? (saved.finished ? 'Review' : 'Resume') : 'Start'} &nbsp;→
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ACTIVE QUIZ VIEW */
          <div className="quiz-container">
            <button
              className="btn btn-ghost"
              style={{ marginBottom: '1.25rem', alignSelf: 'flex-start' }}
              onClick={handleBackToList}
            >
              ← Back to Quizzes
            </button>

            {(() => {
              const total = currentAssignment.questions.length;
              const q = currentAssignment.questions[currentIndex];
              if (!q) return <div>Question not found</div>;

              const isMulti = q.isMultiple || Array.isArray(q.answer);
              const selected = userAnswers[q.id];
              const isRevealed = !!revealed[q.id];

              const answered = Object.keys(userAnswers).length;
              const correct = currentAssignment.questions.filter(
                question => isAnswerCorrect(userAnswers[question.id], question.answer)
              ).length;

              const userGotItRight = isAnswerCorrect(selected, q.answer);

              return (
                <>
                  <div className="quiz-progress">
                    <div className="quiz-progress-header">
                      <span className="quiz-progress-label">{currentAssignment.title}</span>
                      <span className="quiz-progress-count">
                        {currentIndex + 1} / {total}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
                      ></div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '0.6rem',
                        flexWrap: 'wrap',
                        gap: '0.4rem'
                      }}
                    >
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {answered > 0 ? `Score so far: ${correct}/${answered} answered correctly` : ''}
                      </span>
                      <span className="badge badge-blue">
                        Week {currentAssignment.week} · {currentAssignment.topic}
                      </span>
                    </div>
                  </div>

                  {/* Question Card */}
                  <div className="question-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div className="question-number">
                        Question {currentIndex + 1} of {total}
                      </div>
                      {isMulti && (
                        <span className="badge badge-warning" style={{ fontSize: '0.55rem', padding: '0.25rem 0.6rem' }}>
                          Select All That Apply (Multiple Options)
                        </span>
                      )}
                    </div>
                    <div className="question-text">{q.question}</div>

                    <ul className="options-list">
                      {q.options.map((opt, i) => {
                        const isOptionSelected = isMulti
                          ? Array.isArray(selected) && selected.includes(i)
                          : selected === i;

                        const isOptionCorrect = isMulti
                          ? Array.isArray(q.answer) && q.answer.includes(i)
                          : q.answer === i;

                        let cls = '';
                        if (isRevealed) {
                          if (isOptionCorrect) cls = 'correct';
                          else if (isOptionSelected && !isOptionCorrect) cls = 'incorrect';
                        } else if (isOptionSelected) {
                          cls = 'selected';
                        }

                        return (
                          <li
                            key={i}
                            className={`option-item ${cls} ${isRevealed ? 'disabled' : ''}`}
                            onClick={() => !isRevealed && selectOption(i)}
                          >
                            <label className="option-label">
                              <span className="option-letter">
                                {isMulti ? (isOptionSelected ? '✓' : letters[i]) : letters[i]}
                              </span>
                              <span className="option-text">{opt}</span>
                              {isRevealed && isOptionCorrect && (
                                <span className="option-indicator">
                                  <UiIcon name="checkCircle" />
                                </span>
                              )}
                              {isRevealed && isOptionSelected && !isOptionCorrect && (
                                <span className="option-indicator">
                                  <UiIcon name="alertCircle" />
                                </span>
                              )}
                            </label>
                          </li>
                        );
                      })}
                    </ul>

                    {isRevealed && (
                      <div className={`explanation-box ${!userGotItRight ? 'wrong' : ''}`}>
                        <div className="explanation-title">
                          <UiIcon name={userGotItRight ? 'checkCircle' : 'alertCircle'} />{' '}
                          {userGotItRight ? 'Correct!' : 'Incorrect'}
                        </div>
                        <div className="explanation-text">{q.explanation}</div>
                      </div>
                    )}
                  </div>

                  {/* Quiz Navigation */}
                  <div className="quiz-nav">
                    <button
                      className="btn btn-ghost"
                      onClick={() => navigate(-1)}
                      disabled={currentIndex === 0}
                    >
                      ← Prev
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={checkAnswer}
                      disabled={isRevealed || selected === undefined || (isMulti && Array.isArray(selected) && selected.length === 0)}
                    >
                      {isRevealed ? 'Revealed' : 'Check Answer'}
                    </button>
                    <button className="btn btn-blue" onClick={() => navigate(1)}>
                      {currentIndex === total - 1 ? 'Finish →' : 'Next →'}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </main>
    </>
  );
}

export default function QuizzesPage() {
  return (
    <Suspense fallback={<div className="main-content text-center mt-3"><p>Loading quizzes...</p></div>}>
      <QuizzesContent />
    </Suspense>
  );
}
