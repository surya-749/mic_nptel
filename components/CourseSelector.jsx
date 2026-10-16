'use client';

import { useState, useRef, useEffect } from 'react';
import { useCourse } from '@/components/CourseContext';
import { useToast } from '@/components/ToastContext';
import UiIcon from '@/components/UiIcon';
import { useRouter, usePathname } from 'next/navigation';

export default function CourseSelector() {
  const { currentCourse, setCourse, courses, courseMeta } = useCourse();
  const { showToast } = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectCourse = (courseId) => {
    if (courseId === currentCourse) {
      setDropdownOpen(false);
      return;
    }

    setCourse(courseId);
    setDropdownOpen(false);
    const targetMeta = courses.find(c => c.id === courseId);
    showToast(`Switched course to: ${targetMeta ? targetMeta.name : courseId}`, 'success');

    // If on a specific quiz or mock test page with ?id=..., navigate back to the main list of that section
    if (pathname === '/quizzes') {
      router.push('/quizzes');
    } else if (pathname === '/mock-tests') {
      router.push('/mock-tests');
    }
  };

  return (
    <div className="course-selector-wrapper" ref={dropdownRef}>
      {/* Desktop Quick Tabs */}
      <div className="course-tabs-desktop" role="tablist" aria-label="Select NPTEL Course">
        <span className="course-tabs-label">
          <UiIcon name="gradCap" /> Course:
        </span>
        {courses.map((course) => {
          const isActive = course.id === currentCourse;
          return (
            <button
              key={course.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelectCourse(course.id)}
              className={`course-tab-btn ${isActive ? 'active' : ''}`}
              title={`Switch to ${course.name}`}
            >
              <UiIcon name={course.icon || 'book'} className="tab-icon" />
              <span className="tab-text">{course.shortName || course.name}</span>
              {isActive && <span className="tab-active-dot" />}
            </button>
          );
        })}
      </div>

      {/* Mobile/Compact Dropdown Trigger */}
      <div className="course-dropdown-mobile">
        <button
          type="button"
          className="course-dropdown-btn"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
          aria-label="Select course"
        >
          <span className="dropdown-btn-prefix">Course:</span>
          <UiIcon name={courseMeta.icon || 'book'} className="dropdown-btn-icon" />
          <span className="dropdown-btn-title">{courseMeta.shortName || courseMeta.name}</span>
          <UiIcon name="chevronDown" className={`dropdown-chevron ${dropdownOpen ? 'open' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="course-dropdown-menu" role="menu">
            <div className="dropdown-menu-header">Select NPTEL Course</div>
            {courses.map((course) => {
              const isActive = course.id === currentCourse;
              return (
                <button
                  key={course.id}
                  type="button"
                  role="menuitem"
                  className={`course-dropdown-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectCourse(course.id)}
                >
                  <div className="item-icon-box">
                    <UiIcon name={course.icon || 'book'} />
                  </div>
                  <div className="item-details">
                    <div className="item-title">{course.name}</div>
                    <div className="item-meta">
                      {course.totalWeeks} Weeks · {course.totalQuestions} Questions
                    </div>
                  </div>
                  {isActive && (
                    <div className="item-check">
                      <UiIcon name="checkCircle" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
