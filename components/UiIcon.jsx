'use client';
import { getUiIcon } from '@/lib/icons';

export default function UiIcon({ name, className = '', style }) {
  const svgHtml = getUiIcon(name, className);
  if (!svgHtml) return null;
  return (
    <span
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', verticalAlign: 'middle', ...style }}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
}
