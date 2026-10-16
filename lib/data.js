import coursesData from '@/data/courses.json';
import incubationQuestions from '@/data/questions.json';
import incubationMaterials from '@/data/materials.json';
import publicSpeakingQuestions from '@/data/public-speaking-questions.json';
import publicSpeakingMaterials from '@/data/public-speaking-materials.json';

const COURSES_DATA = {
  incubation: {
    meta: coursesData.find(c => c.id === 'incubation') || coursesData[0],
    questions: incubationQuestions,
    materials: incubationMaterials
  },
  'public-speaking': {
    meta: coursesData.find(c => c.id === 'public-speaking') || coursesData[1],
    questions: publicSpeakingQuestions,
    materials: publicSpeakingMaterials
  }
};

export const DEFAULT_COURSE_ID = 'incubation';

export function getCourses() {
  return coursesData;
}

export function getCourse(courseId = DEFAULT_COURSE_ID) {
  return COURSES_DATA[courseId]?.meta || COURSES_DATA[DEFAULT_COURSE_ID].meta;
}

export function getQuestionsData(courseId = DEFAULT_COURSE_ID) {
  return COURSES_DATA[courseId]?.questions || COURSES_DATA[DEFAULT_COURSE_ID].questions;
}

export function getMaterialsData(courseId = DEFAULT_COURSE_ID) {
  return COURSES_DATA[courseId]?.materials || COURSES_DATA[DEFAULT_COURSE_ID].materials;
}

export function getAssignments(courseId = DEFAULT_COURSE_ID) {
  const qData = getQuestionsData(courseId);
  return qData.assignments || [];
}

export function getAssignment(id, courseId) {
  if (courseId && COURSES_DATA[courseId]) {
    const found = (COURSES_DATA[courseId].questions.assignments || []).find(a => a.id === id);
    if (found) return found;
  }
  // Fallback: check all courses so direct links work seamlessly
  for (const cid of Object.keys(COURSES_DATA)) {
    const found = (COURSES_DATA[cid].questions.assignments || []).find(a => a.id === id);
    if (found) return found;
  }
  return null;
}

export function getMockTests(courseId = DEFAULT_COURSE_ID) {
  const qData = getQuestionsData(courseId);
  return qData.mockTests || [];
}

export function getMockTest(id, courseId) {
  if (courseId && COURSES_DATA[courseId]) {
    const found = (COURSES_DATA[courseId].questions.mockTests || []).find(m => m.id === id);
    if (found) return found;
  }
  // Fallback: check all courses
  for (const cid of Object.keys(COURSES_DATA)) {
    const found = (COURSES_DATA[cid].questions.mockTests || []).find(m => m.id === id);
    if (found) return found;
  }
  return null;
}

export function getWeeks(courseId = DEFAULT_COURSE_ID) {
  const mData = getMaterialsData(courseId);
  return (mData.weeks || []).slice().sort((a, b) => a.week - b.week);
}

export function getExamStrategy(courseId = DEFAULT_COURSE_ID) {
  const mData = getMaterialsData(courseId);
  return mData.examStrategy || null;
}

/**
 * Checks if user answer matches the correct answer.
 * Supports both single-choice (number) and multiple-choice (number[]).
 */
export function isAnswerCorrect(userAnswer, correctAnswer) {
  if (userAnswer === undefined || userAnswer === null) return false;
  if (Array.isArray(correctAnswer)) {
    if (!Array.isArray(userAnswer)) return false;
    if (userAnswer.length !== correctAnswer.length) return false;
    const sortedUser = [...userAnswer].sort((a, b) => a - b);
    const sortedCorrect = [...correctAnswer].sort((a, b) => a - b);
    return sortedUser.every((val, idx) => val === sortedCorrect[idx]);
  }
  return userAnswer === correctAnswer;
}
