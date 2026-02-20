import React from 'react';
import { useOptionalVision } from '../vde-core';

export interface AestheticOrnamentsProps {
  className?: string;
}

export function AestheticOrnaments({ className = '' }: AestheticOrnamentsProps): JSX.Element | null {
  const vision = useOptionalVision();
  const ornaments = vision?.activeVision.ornaments;

  if (!ornaments) {
    return null;
  }

  const wrapperClassName = ['pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div aria-hidden="true" className={wrapperClassName}>
      {ornaments.texture ? <span className="absolute inset-0 [background-image:var(--vde-surface-texture)] [opacity:var(--vde-surface-transparency)]" /> : null}
      {ornaments.grain ? (
        <span className="absolute inset-0 bg-black mix-blend-multiply [opacity:var(--vde-surface-grain)]" />
      ) : null}
      {ornaments.glow ? <span className="absolute inset-0 rounded-[inherit] [box-shadow:var(--vde-shadow-neon)]" /> : null}
    </div>
  );
}
