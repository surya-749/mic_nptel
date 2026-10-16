import questionsData from '@/data/questions.json';
import materialsData from '@/data/materials.json';

export function getQuestionsData() {
  return questionsData;
}

export function getMaterialsData() {
  return materialsData;
}

export function getAssignments() {
  return questionsData.assignments || [];
}

export function getAssignment(id) {
  return (questionsData.assignments || []).find(a => a.id === id);
}

export function getMockTests() {
  return questionsData.mockTests || [];
}

export function getMockTest(id) {
  return (questionsData.mockTests || []).find(m => m.id === id);
}

export function getWeeks() {
  return (materialsData.weeks || []).sort((a, b) => a.week - b.week);
}

export function getExamStrategy() {
  return materialsData.examStrategy || null;
}
