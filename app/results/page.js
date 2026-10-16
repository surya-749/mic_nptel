'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import UiIcon from '@/components/UiIcon';
import { getAssignments, getMockTests } from '@/lib/data';
import { loadProgress, getScoreGrade, formatTime } from '@/lib/storage';

const letters = ['A', 'B', 'C', 'D', 'E'];

function ResultsContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const assignmentId = searchParams.get('assignmentId');
  const mockId = searchParams.get('mockId');

  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const assignments = getAssignments();
    const mockTests = getMockTests();

    if (type === 'quiz' && assignmentId) {
      const assignment = assignments.find(a => a.id === assignmentId);
      if (!assignment) {
        setError('Quiz not found.');
        return;
      }

      const saved = loadProgress(`quiz_${assignmentId}`);
      const answers = saved && saved.answers ? saved.answers : {};
      const total = assignment.questions.length;
      const correct = assignment.questions.filter(q => answers[q.id] === q.answer).length;
      const percent = Math.round((correct / total) * 100);

      setResultData({
        title: `${assignment.title} Results`,
        subtitle: `${assignment.topic} — Week ${assignment.week}`,
        correct,
        total,
        percent,
        timeTaken: null,
        backHref: '/quizzes',
        backLabel: '← Back to Quizzes',
        retakeHref: `/quizzes?id=${assignmentId}`,
        retakeLabel: '↺ Retake Quiz',
        questions: assignment.questions,
        answers
      });
    } else if (type === 'mock' && mockId) {
      const mock = mockTests.find(m => m.id === mockId);
      if (!mock) {
        setError('Mock test not found.');
        return;
      }

      const questionMap = {};
      assignments.forEach(a => {
        (a.questions || []).forEach(q => {
          questionMap[q.id] = q;
        });
      });

      const questions = (mock.questionIds || []).map(id => questionMap[id]).filter(Boolean);
      const saved = loadProgress(`mock_${mockId}`);
      const answers = saved && saved.answers ? saved.answers : {};
      const total = questions.length;
      const correct = questions.filter(q => answers[q.id] === q.answer).length;
      const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
      const timeTaken = saved ? saved.duration : null;

      setResultData({
        title: `${mock.title} Results`,
        subtitle: mock.description,
        correct,
        total,
        percent,
        timeTaken,
        backHref: '/mock-tests',
        backLabel: '← Back to Mock Tests',
        retakeHref: `/mock-tests?id=${mockId}`,
        retakeLabel: '↺ Retake Test',
        questions,
        answers
      });
    } else {
      setError('No result data found. Please complete a quiz or mock test first.');
    }
  }, [type, assignmentId, mockId]);

  if (error) {
    return (
      <main className="main-content">
        <div className="empty-state">
          <div className="empty-state-icon">
            <UiIcon name="alertCircle" style={{ width: 44, height: 44 }} />
          </div>
          <h3>Result Not Found</h3>
          <p>{error}</p>
          <Link href="/" className="btn btn-blue" style={{ marginTop: '1.25rem' }}>
            <UiIcon name="home" /> Go Home
          </Link>
        </div>
      </main>
    );
  }

  if (!resultData) {
    return (
      <main className="main-content">
        <div className="empty-state">
          <div className="empty-state-icon">
            <UiIcon name="clock" style={{ width: 36, height: 36 }} />
          </div>
          <h3>Loading Results…</h3>
        </div>
      </main>
    );
  }

  const {
    title,
    subtitle,
    correct,
    total,
    percent,
    timeTaken,
    backHref,
    backLabel,
    retakeHref,
    retakeLabel,
    questions,
    answers
  } = resultData;

  const grade = getScoreGrade(percent);

  return (
    <main className="main-content">
      <div style={{ marginBottom: '1rem' }}>
        <Link href={backHref} className="btn btn-ghost">
          {backLabel}
        </Link>
      </div>

      {/* RESULT HERO */}
      <div className="result-hero">
        <div className={`score-circle ${grade.cls}`}>
          <div className="score-percent">{percent}%</div>
          <div className="score-label">Score</div>
        </div>

        <div className="result-title">
          <UiIcon name={grade.icon || 'award'} /> {grade.label}
        </div>
        <div className="result-subtitle">
          {title} · {subtitle}
        </div>

        <div className="result-stats">
          <div className="result-stat">
            <div className="result-stat-number correct-count">{correct}</div>
            <div className="result-stat-label">Correct</div>
          </div>
          <div className="result-stat">
            <div className="result-stat-number wrong-count">{total - correct}</div>
            <div className="result-stat-label">Incorrect / Skipped</div>
          </div>
          <div className="result-stat">
            <div className="result-stat-number" style={{ color: '#0c4d8c' }}>
              {total}
            </div>
            <div className="result-stat-label">Total</div>
          </div>
          {timeTaken ? (
            <div className="result-stat">
              <div className="result-stat-number" style={{ color: 'var(--text-dark)' }}>
                {formatTime(timeTaken)}
              </div>
              <div className="result-stat-label">Time Taken</div>
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '1.5rem'
          }}
        >
          <Link href={retakeHref} className="btn btn-blue">
            <UiIcon name="refresh" /> {retakeLabel}
          </Link>
          <Link href="/" className="btn btn-ghost">
            <UiIcon name="home" /> Home
          </Link>
        </div>
      </div>

      {/* ANSWER REVIEW */}
      <div className="review-section">
        <div className="section-header">
          <h2>
            <UiIcon name="test" /> Answer Review
          </h2>
          <p>Check every question, your answer, and the explanation</p>
        </div>

        <div>
          {questions.map((q, i) => {
            const selected = answers[q.id];
            const isCorrect = selected === q.answer;
            const skipped = selected === undefined;

            const cls = skipped ? 'skipped-q' : isCorrect ? 'correct-q' : 'wrong-q';

            return (
              <div key={q.id || i} className={`review-question ${cls}`}>
                <div className="review-q-header">
                  <span className="review-q-number">Q{i + 1}</span>
                  {skipped ? (
                    <span className="badge badge-gray">
                      <UiIcon name="info" /> Skipped
                    </span>
                  ) : isCorrect ? (
                    <span className="badge badge-green">
                      <UiIcon name="checkCircle" /> Correct
                    </span>
                  ) : (
                    <span className="badge badge-red">
                      <UiIcon name="alertCircle" /> Incorrect
                    </span>
                  )}
                </div>

                <div className="review-q-text">{q.question}</div>

                {!skipped && !isCorrect && (
                  <div className="review-answer your-wrong">
                    <UiIcon name="alertCircle" /> Your answer: {letters[selected]}. {q.options[selected]}
                  </div>
                )}

                {!skipped && isCorrect && (
                  <div className="review-answer your-correct">
                    <UiIcon name="checkCircle" /> Your answer: {letters[selected]}. {q.options[selected]}
                  </div>
                )}

                {!isCorrect && (
                  <div className="review-answer correct-ans">
                    <UiIcon name="checkCircle" /> Correct answer: {letters[q.answer]}. {q.options[q.answer]}
                  </div>
                )}

                <div className="review-explanation">
                  <UiIcon name="lightbulb" /> {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="main-content text-center mt-3"><p>Loading results...</p></div>}>
      <ResultsContent />
    </Suspense>
  );
}
