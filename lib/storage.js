'use client';

export function saveProgress(key, data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('nptel_' + key, JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
}

export function loadProgress(key) {
  if (typeof window === 'undefined') return null;
  try {
    const s = localStorage.getItem('nptel_' + key);
    return s ? JSON.parse(s) : null;
  } catch (e) {
    return null;
  }
}

export function clearProgress(key) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('nptel_' + key);
  } catch (e) {}
}

export function getScoreGrade(percent) {
  if (percent >= 80) return { label: 'Excellent!', cls: 'excellent', icon: 'award' };
  if (percent >= 60) return { label: 'Good Job!', cls: 'good', icon: 'checkCircle' };
  if (percent >= 40) return { label: 'Keep Practising', cls: 'average', icon: 'book' };
  return { label: 'Needs Improvement', cls: 'poor', icon: 'info' };
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
