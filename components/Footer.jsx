'use client';

import { useCourse } from '@/components/CourseContext';

export default function Footer() {
  const { courseMeta } = useCourse();

  return (
    <footer className="footer">
      <p>
        NPTEL Prep — {courseMeta ? courseMeta.name : 'NPTEL Certification'} &nbsp;|&nbsp;
        Study materials & quizzes based on NPTEL curriculum &nbsp;|&nbsp;
        <a href="https://nptel.ac.in" target="_blank" rel="noopener noreferrer">
          nptel.ac.in
        </a>
      </p>
    </footer>
  );
}
