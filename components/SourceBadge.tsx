'use client';

interface SourceBadgeProps {
  source: string;
}

export default function SourceBadge({ source }: SourceBadgeProps) {
  return (
    <span className="source-badge">
      {source}
    </span>
  );
}
