import React from 'react';
import { useVision } from '../vde-core';

export interface NavigationOrbItem {
  href?: string;
  id: string;
  label: string;
  onSelect?: () => void;
}

export interface NavigationOrbProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  floating?: boolean;
  items: NavigationOrbItem[];
  label?: string;
  onNavigate?: (item: NavigationOrbItem) => void;
}

interface OrbPhysics {
  buttonDuration: string;
  easing: string;
  itemDuration: string;
  overshootScale: number;
  staggerMs: number;
}

const POSITION_CLASSES = new Set(['static', 'fixed', 'absolute', 'relative', 'sticky']);

function hasPositionClass(className: string): boolean {
  if (!className.trim()) {
    return false;
  }

  return className
    .trim()
    .split(/\s+/)
    .some(token => {
      const tokenParts = token.split(':');
      const variantToken = tokenParts[tokenParts.length - 1] ?? token;
      return POSITION_CLASSES.has(variantToken.startsWith('!') ? variantToken.slice(1) : variantToken);
    });
}

function resolvePhysics(visionId: string): OrbPhysics {
  if (visionId === 'museum' || visionId === 'the_archive') {
    return {
      buttonDuration: 'var(--vde-motion-duration-slow)',
      easing: 'linear',
      itemDuration: 'var(--vde-motion-duration-slow)',
      overshootScale: 1,
      staggerMs: 85,
    };
  }

  if (visionId === 'brutalist' || visionId === 'raw_data' || visionId === 'swiss_international') {
    return {
      buttonDuration: '0ms',
      easing: 'linear',
      itemDuration: '0ms',
      overshootScale: 1,
      staggerMs: 0,
    };
  }

  return {
    buttonDuration: 'var(--vde-nav-orb-bounce-duration, 420ms)',
    easing: 'var(--vde-nav-orb-bounce-easing, cubic-bezier(0.2, 1.1, 0.28, 1.28))',
    itemDuration: 'var(--vde-nav-orb-bounce-duration, 420ms)',
    overshootScale: 1.06,
    staggerMs: 55,
  };
}

export const NavigationOrb = React.forwardRef<HTMLDivElement, NavigationOrbProps>(
  ({ className = '', defaultOpen = false, floating = true, items, label = 'Navigation', onNavigate, style, ...props }, ref) => {
    const { activeVision } = useVision();
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    const physics = resolvePhysics(activeVision.id);
    const hasCustomPosition = hasPositionClass(className);
    const positionClasses = hasCustomPosition ? '' : floating ? 'fixed bottom-6 right-6 z-50' : 'relative';

    const handleSelect = (item: NavigationOrbItem): void => {
      item.onSelect?.();
      onNavigate?.(item);
      setIsOpen(false);
    };

    const classes = [
      positionClasses,
      'pointer-events-none',
      'min-h-12 min-w-12',
      className,
    ].join(' ');

    return (
      <nav ref={ref} aria-label={label} className={classes} data-vde-component="navigation-orb" style={style} {...props}>
        <ul aria-hidden={!isOpen} className="pointer-events-none absolute bottom-0 right-0 m-0 list-none p-0">
          {items.map((item, index) => {
            const distance = (index + 1) * 56;
            const itemStyle: React.CSSProperties = {
              transform: isOpen ? `translateY(-${distance}px) scale(1)` : 'translateY(0) scale(0.72)',
              opacity: isOpen ? 1 : 0,
              transitionProperty: 'transform, opacity',
              transitionDuration: physics.itemDuration,
              transitionTimingFunction: physics.easing,
              transitionDelay: isOpen ? `${index * physics.staggerMs}ms` : '0ms',
            };

            const itemClasses = [
              isOpen ? 'pointer-events-auto' : 'pointer-events-none',
              'absolute',
              'bottom-0',
              'right-0',
              'inline-flex',
              'h-10',
              'min-w-10',
              'items-center',
              'justify-center',
              'rounded-full',
              'border',
              'px-3',
              'text-xs',
              'font-medium',
              '[font-family:var(--vde-font-body)]',
              '[border-color:var(--vde-color-border)]',
              '[background:var(--vde-color-surface)]',
              '[color:var(--vde-color-surface-foreground)]',
              '[box-shadow:var(--vde-shadow-ambient)]',
              'whitespace-nowrap',
            ].join(' ');

            if (item.href) {
              return (
                <li key={item.id}>
                  <a
                    aria-hidden={!isOpen}
                    className={itemClasses}
                    href={item.href}
                    onClick={() => handleSelect(item)}
                    style={itemStyle}
                    tabIndex={isOpen ? 0 : -1}
                  >
                    {item.label}
                  </a>
                </li>
              );
            }

            return (
              <li key={item.id}>
                <button
                  aria-hidden={!isOpen}
                  className={itemClasses}
                  onClick={() => handleSelect(item)}
                  style={itemStyle}
                  tabIndex={isOpen ? 0 : -1}
                  type="button"
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>

        <button
          aria-expanded={isOpen}
          aria-label={label}
          className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border text-lg [font-family:var(--vde-font-display)] [border-color:var(--vde-color-border)] [background:var(--vde-color-accent)] [color:var(--vde-color-accent-foreground)] [box-shadow:var(--vde-shadow-hard)]"
          onClick={() => setIsOpen(current => !current)}
          style={{
            transform: isOpen ? `scale(${physics.overshootScale})` : 'scale(1)',
            transitionProperty: 'transform',
            transitionDuration: physics.buttonDuration,
            transitionTimingFunction: physics.easing,
          }}
          type="button"
        >
          <span
            style={{
              transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
              transitionProperty: 'transform',
              transitionDuration: physics.buttonDuration,
              transitionTimingFunction: physics.easing,
            }}
          >
            +
          </span>
        </button>
      </nav>
    );
  }
);

NavigationOrb.displayName = 'NavigationOrb';
