'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCourses, getCourse, DEFAULT_COURSE_ID } from '@/lib/data';

const CourseContext = createContext({
  currentCourse: DEFAULT_COURSE_ID,
  courseMeta: getCourse(DEFAULT_COURSE_ID),
  courses: getCourses(),
  setCourse: () => {}
});

const STORAGE_KEY = 'nptel_selected_course';

export function CourseProvider({ children }) {
  const [currentCourse, setCurrentCourseState] = useState(DEFAULT_COURSE_ID);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'incubation' || saved === 'public-speaking')) {
        setCurrentCourseState(saved);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const setCourse = (newCourseId) => {
    if (newCourseId !== 'incubation' && newCourseId !== 'public-speaking') return;
    setCurrentCourseState(newCourseId);
    try {
      localStorage.setItem(STORAGE_KEY, newCourseId);
      // Trigger a storage event for multi-tab sync if needed
      window.dispatchEvent(new Event('course-changed'));
    } catch (e) {
      console.error(e);
    }
  };

  const courseMeta = getCourse(currentCourse);
  const courses = getCourses();

  return (
    <CourseContext.Provider
      value={{
        currentCourse,
        courseMeta,
        courses,
        setCourse,
        isLoaded: mounted
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const ctx = useContext(CourseContext);
  if (!ctx) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return ctx;
}
