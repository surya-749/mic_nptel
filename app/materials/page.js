'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import UiIcon from '@/components/UiIcon';
import { useCourse } from '@/components/CourseContext';
import { getWeeks, getExamStrategy } from '@/lib/data';

const resourceTypeMap = {
  notes: { icon: 'notes', label: 'Notes' },
  video: { icon: 'video', label: 'Video Lecture' },
  reference: { icon: 'reference', label: 'Reference' }
};

function MaterialsContent() {
  const searchParams = useSearchParams();
  const { currentCourse, courseMeta } = useCourse();
  const allWeeks = getWeeks(currentCourse);
  const examStrategy = getExamStrategy(currentCourse);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWeek, setSelectedWeek] = useState(searchParams.get('week') || '');
  const [selectedType, setSelectedType] = useState('');
  const [openCards, setOpenCards] = useState({});

  useEffect(() => {
    const paramWeek = searchParams.get('week');
    if (paramWeek) {
      setSelectedWeek(paramWeek);
      setOpenCards(prev => ({ ...prev, [paramWeek]: true }));
    }
  }, [searchParams]);

  const toggleWeekCard = (wNum) => {
    setOpenCards(prev => ({
      ...prev,
      [wNum]: !prev[wNum]
    }));
  };

  const filteredWeeks = allWeeks.filter(w => {
    if (selectedWeek && String(w.week) !== selectedWeek) return false;

    const search = searchTerm.toLowerCase().trim();
    if (search) {
      const matchTitle = w.title.toLowerCase().includes(search);
      const matchCoreFocus = (w.coreFocus || '').toLowerCase().includes(search);
      const matchTakeaway = (w.keyTakeaway || '').toLowerCase().includes(search);
      const matchTopic = (w.topics || []).some(t => t.toLowerCase().includes(search));
      const matchResource = (w.resources || []).some(
        r => r.title.toLowerCase().includes(search) || (r.description || '').toLowerCase().includes(search)
      );

      if (!matchTitle && !matchCoreFocus && !matchTakeaway && !matchTopic && !matchResource) {
        return false;
      }
    }

    if (selectedType) {
      const hasType = (w.resources || []).some(r => r.type === selectedType);
      if (!hasType) return false;
    }

    return true;
  });

  return (
    <>
      <div className="page-header">
        <div className="page-header-content">
          <div className="badge badge-blue" style={{ marginBottom: '0.6rem', alignSelf: 'flex-start' }}>
            <UiIcon name={courseMeta.icon || 'book'} /> {courseMeta.name}
          </div>
          <h1>
            <UiIcon name="book" className="page-title-icon" /> Study Materials
          </h1>
          <p>Week-wise topics, key concepts, and curated reference resources for {courseMeta.name}</p>
        </div>
      </div>

      <main className="main-content">
        {/* EXAM STRATEGY BANNER */}
        {examStrategy && (
          <div className="exam-strategy-banner">
            <div className="exam-strategy-header">
              <div className="exam-strategy-icon">
                <UiIcon name="lightbulb" />
              </div>
              <div>
                <div className="exam-strategy-title">{examStrategy.title || 'Study Strategy for the Exam'}</div>
                <div className="exam-strategy-subtitle">
                  {courseMeta.name} — NPTEL Certification
                </div>
              </div>
            </div>

            <div className="exam-strategy-points">
              {(examStrategy.points || []).map((pt, i) => {
                const iconName = i === 0 ? 'target' : 'lightbulb';
                const badgeText = i === 0 ? '80% Exam Questions' : 'Conceptual Focus';
                const formatted = pt
                  .replace('Assignment Heavy: ', 'Assignment Heavy: ')
                  .replace('Conceptual Application: ', 'Conceptual Application: ');

                return (
                  <div key={i} className="strategy-point">
                    <span className="point-badge">
                      <UiIcon name={iconName} /> {badgeText}
                    </span>
                    <span>{formatted}</span>
                  </div>
                );
              })}
            </div>

            {examStrategy.overviewVideo && (
              <div className="exam-strategy-action">
                <a
                  href={examStrategy.overviewVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ fontSize: '0.48rem', padding: '0.65rem 1.1rem' }}
                >
                  <UiIcon name="play" /> Watch Course Overview Video ↗
                </a>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                  {examStrategy.overviewVideo.description}
                </span>
              </div>
            )}
          </div>
        )}

        {/* FILTER BAR */}
        <div className="filter-bar">
          <div className="search-input-wrapper">
            <span className="search-icon">
              <UiIcon name="search" />
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Search topics, resources…"
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
            {allWeeks.map(w => (
              <option key={w.week} value={w.week}>
                Week {w.week}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
          >
            <option value="">All Resource Types</option>
            <option value="notes">Notes</option>
            <option value="video">Videos</option>
            <option value="reference">References</option>
          </select>
        </div>

        {/* WEEK CARDS */}
        {filteredWeeks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <UiIcon name="search" style={{ width: 36, height: 36 }} />
            </div>
            <h3>No results found</h3>
            <p>Try a different search term or clear the filters</p>
          </div>
        ) : (
          <div>
            {filteredWeeks.map(w => {
              const isOpen = openCards[w.week] || false;
              const resources = selectedType
                ? (w.resources || []).filter(r => r.type === selectedType)
                : w.resources || [];

              return (
                <div key={w.week} className={`week-card ${isOpen ? 'open' : ''}`} id={`week-card-${w.week}`}>
                  <div className="week-header" onClick={() => toggleWeekCard(w.week)}>
                    <div className="week-number">W{w.week}</div>
                    <div className="week-info">
                      <div className="week-title">
                        Week {w.week}: {w.title}
                      </div>
                      <div className="week-meta">
                        {w.topics ? w.topics.length : 0} key topics &nbsp;·&nbsp; {resources.length} resources
                      </div>
                    </div>
                    <span className="week-toggle">▾</span>
                  </div>

                  <div className="week-body">
                    {w.coreFocus && (
                      <div className="week-core-focus">
                        <span className="focus-label">
                          <UiIcon name="target" /> Core Focus
                        </span>
                        <p className="focus-text">{w.coreFocus}</p>
                      </div>
                    )}

                    <div className="topics-section">
                      <div className="subsection-title">
                        <UiIcon name="notes" /> Key Topics
                      </div>
                      <div className="topics-list">
                        {(w.topics || []).map((t, idx) => (
                          <span key={idx} className="badge badge-blue">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {w.keyTakeaway && (
                      <div className="week-key-takeaway">
                        <span className="takeaway-label">
                          <UiIcon name="lightbulb" /> Key Takeaway
                        </span>
                        <p className="takeaway-text">{w.keyTakeaway}</p>
                      </div>
                    )}

                    <div className="resources-section">
                      <div className="subsection-title">
                        <UiIcon name="video" /> Video Lectures & Study Resources
                      </div>
                      {resources.map((r, rIdx) => {
                        const rm = resourceTypeMap[r.type] || { icon: 'notes', label: r.type };
                        const isExternal = r.url && r.url !== '#' && r.url.startsWith('http');

                        return (
                          <div key={rIdx} className="resource-item">
                            <div className={`resource-type-icon ${r.type}`}>
                              <UiIcon name={rm.icon} />
                            </div>
                            <div className="resource-info">
                              <div className="resource-title">{r.title}</div>
                              <div className="resource-desc">{r.description}</div>
                            </div>
                            {isExternal ? (
                              <a
                                href={r.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="resource-link"
                                title={`Open ${rm.label}`}
                              >
                                Watch / Open ↗
                              </a>
                            ) : (
                              <span className="resource-link" style={{ opacity: 0.6 }} title="Study material">
                                Notes
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ marginTop: '1.4rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <Link
                        href={`/quizzes?week=${w.week}`}
                        className="btn btn-primary"
                        style={{ fontSize: '0.48rem', padding: '0.6rem 1rem' }}
                      >
                        <UiIcon name="pen" /> Practice Week {w.week} Assignment Quiz &nbsp;→
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

export default function MaterialsPage() {
  return (
    <Suspense fallback={<div className="main-content text-center mt-3"><p>Loading materials...</p></div>}>
      <MaterialsContent />
    </Suspense>
  );
}
