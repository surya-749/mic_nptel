import Link from 'next/link';
import UiIcon from '@/components/UiIcon';
import { getAssignments, getWeeks, getMockTests } from '@/lib/data';

export default function HomePage() {
  const assignments = getAssignments();
  const weeks = getWeeks();
  const mockTests = getMockTests();
  const totalQuestions = assignments.reduce((sum, a) => sum + (a.questions ? a.questions.length : 0), 0);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <UiIcon name="gradCap" /> NPTEL Certification Prep
          </div>
          <h1>
            Ace Your NPTEL Exam on
            <br />
            Understanding Incubation & Entrepreneurship
          </h1>
          <p>
            Study smarter with topic-wise quizzes, timed mock tests, instant explanations, and curated study materials — all in one place.
          </p>
          <div className="hero-actions">
            <Link href="/quizzes" className="btn btn-primary">
              <UiIcon name="pen" /> Start Quizzing
            </Link>
            <Link href="/mock-tests" className="btn btn-outline">
              <UiIcon name="test" /> Take Mock Test
            </Link>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="stats-bar">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">{totalQuestions}</div>
            <div className="stat-label">MCQ Questions</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{weeks.length}</div>
            <div className="stat-label">Weeks Covered</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{mockTests.length}</div>
            <div className="stat-label">Mock Tests</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Free Access</div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* FEATURES */}
        <div className="section-header">
          <h2>Everything You Need to Prepare</h2>
          <p>Comprehensive preparation resources designed around the NPTEL syllabus</p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <UiIcon name="book" />
            </div>
            <div>
              <div className="feature-title">Study Materials</div>
              <div className="feature-desc">
                Week-wise topics, key concepts, and curated reference links organized by module.
              </div>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <UiIcon name="pen" />
            </div>
            <div>
              <div className="feature-title">Topic-wise Quizzes</div>
              <div className="feature-desc">
                Practice assignment-wise MCQs with instant feedback and detailed explanations for every question.
              </div>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <UiIcon name="test" />
            </div>
            <div>
              <div className="feature-title">Timed Mock Tests</div>
              <div className="feature-desc">
                Full 30-question mock exams under real exam conditions. Review answers after submission.
              </div>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <UiIcon name="chart" />
            </div>
            <div>
              <div className="feature-title">Score & Analysis</div>
              <div className="feature-desc">
                Instant results with accuracy percentage, correct/wrong counts, and question-level review.
              </div>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <UiIcon name="search" />
            </div>
            <div>
              <div className="feature-title">Search & Filter</div>
              <div className="feature-desc">
                Find quizzes or materials by topic, week, or keyword — quickly locate what you need.
              </div>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <UiIcon name="lightbulb" />
            </div>
            <div>
              <div className="feature-title">Explanations</div>
              <div className="feature-desc">
                Every answer comes with a clear conceptual explanation to reinforce understanding.
              </div>
            </div>
          </div>
        </div>

        {/* WEEK OVERVIEW */}
        <div className="section-header">
          <h2>Course Overview — Weeks 1–12</h2>
          <p>Browse study materials and quizzes by week</p>
        </div>

        <div className="week-overview-grid">
          {weeks.map(w => (
            <Link key={w.week} href={`/materials?week=${w.week}`} className="week-pill">
              <div className="week-pill-num">{w.week}</div>
              <div className="week-pill-title">{w.title}</div>
            </Link>
          ))}
        </div>

        {/* QUICK PRACTICE */}
        <div className="section-header mt-3" style={{ marginTop: '2.5rem' }}>
          <h2>Quick Practice</h2>
          <p>Jump directly into any assignment quiz</p>
        </div>

        <div className="cards-grid">
          {assignments.map(a => (
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
                  <div className="card-subtitle">{a.questions.length} Questions</div>
                </div>
              </div>
              <div className="card-body">
                Practice assignment MCQs on {a.topic.toLowerCase()} with instant feedback and explanations.
              </div>
              <div className="card-footer">
                <span className="badge badge-star">
                  <UiIcon name="check" /> {a.questions.length} MCQs
                </span>
                <Link
                  href={`/quizzes?id=${a.id}`}
                  className="btn btn-primary"
                  style={{ fontSize: '0.48rem', padding: '0.55rem 0.9rem' }}
                >
                  Start &nbsp;→
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
