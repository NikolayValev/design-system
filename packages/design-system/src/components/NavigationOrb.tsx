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
  variant: 'museum' | 'brutalist' | 'orbital';
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
  if (visionId === 'museum') {
    return {
      variant: 'museum',
    };
  }

  if (visionId === 'brutalist' || visionId === 'swiss_international') {
    return {
      variant: 'brutalist',
    };
  }

  return {
    variant: 'orbital',
  };
}

const ITEM_TRANSLATE_OPEN_CLASSES = [
  'group-data-[open=true]/orb:[transform:translateY(-56px)_scale(1)]',
  'group-data-[open=true]/orb:[transform:translateY(-112px)_scale(1)]',
  'group-data-[open=true]/orb:[transform:translateY(-168px)_scale(1)]',
  'group-data-[open=true]/orb:[transform:translateY(-224px)_scale(1)]',
  'group-data-[open=true]/orb:[transform:translateY(-280px)_scale(1)]',
  'group-data-[open=true]/orb:[transform:translateY(-336px)_scale(1)]',
  'group-data-[open=true]/orb:[transform:translateY(-392px)_scale(1)]',
  'group-data-[open=true]/orb:[transform:translateY(-448px)_scale(1)]',
] as const;

const ITEM_DELAY_OPEN_CLASSES = [
  'group-data-[open=true]/orb:[transition-delay:0ms]',
  'group-data-[open=true]/orb:[transition-delay:55ms]',
  'group-data-[open=true]/orb:[transition-delay:110ms]',
  'group-data-[open=true]/orb:[transition-delay:165ms]',
  'group-data-[open=true]/orb:[transition-delay:220ms]',
  'group-data-[open=true]/orb:[transition-delay:275ms]',
  'group-data-[open=true]/orb:[transition-delay:330ms]',
  'group-data-[open=true]/orb:[transition-delay:385ms]',
] as const;

function classForIndex<T extends readonly string[]>(classes: T, index: number): T[number] {
  const clamped = Math.max(0, Math.min(index, classes.length - 1));
  return classes[clamped] as T[number];
}

export const NavigationOrb = React.forwardRef<HTMLDivElement, NavigationOrbProps>(
  ({ className = '', defaultOpen = false, floating = true, items, label = 'Navigation', onNavigate, ...props }, ref) => {
    const { activeVision } = useVision();
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const physics = resolvePhysics(activeVision.id);
    const hasCustomPosition = hasPositionClass(className);
    const positionClasses = hasCustomPosition ? '' : floating ? 'fixed bottom-6 right-6 z-50' : 'relative';

    const close = (restoreFocus: boolean): void => {
      setIsOpen(false);
      if (restoreFocus) {
        triggerRef.current?.focus();
      }
    };

    const handleSelect = (item: NavigationOrbItem): void => {
      item.onSelect?.();
      onNavigate?.(item);
      // Following a link moves focus anyway; only restore for in-page actions.
      close(!item.href);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>): void => {
      if (event.key === 'Escape' && isOpen) {
        event.stopPropagation();
        close(true);
      }
    };

    /*
     * When closed the items stay mounted so the open transition has something to
     * animate, but they must not be reachable. `inert` removes the subtree from
     * the accessibility tree and from the focus order in one attribute — the
     * previous `aria-hidden` + `tabIndex={-1}` pair left visible-but-transparent
     * controls in the DOM and disagreed with itself about whether they existed.
     * React 19 types `inert`; this package still builds against React 18 types.
     */
    const inertWhenClosed = (isOpen ? {} : { inert: '' }) as React.HTMLAttributes<HTMLUListElement>;

    const classes = [
      positionClasses,
      'pointer-events-none',
      'min-h-12 min-w-12',
      className,
    ].join(' ');

    const itemMotionClasses =
      physics.variant === 'museum'
        ? '[transition-duration:var(--vde-motion-duration-slow)] [transition-timing-function:linear]'
        : physics.variant === 'brutalist'
          ? '[transition-duration:0ms] [transition-timing-function:linear]'
          : '[transition-duration:var(--vde-nav-orb-bounce-duration)] [transition-timing-function:var(--vde-nav-orb-bounce-easing)]';

    const buttonMotionClasses =
      physics.variant === 'museum'
        ? '[transition-duration:var(--vde-motion-duration-slow)] [transition-timing-function:linear]'
        : physics.variant === 'brutalist'
          ? '[transition-duration:0ms] [transition-timing-function:linear]'
          : '[transition-duration:var(--vde-nav-orb-bounce-duration)] [transition-timing-function:var(--vde-nav-orb-bounce-easing)]';

    return (
      <nav
        ref={ref}
        aria-label={label}
        className={`group/orb ${classes}`}
        data-open={isOpen}
        data-vde-component="navigation-orb"
        onKeyDown={handleKeyDown}
        {...props}
      >
        <ul className="pointer-events-none absolute bottom-0 right-0 m-0 list-none p-0" {...inertWhenClosed}>
          {items.map((item, index) => {
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
              '[padding-inline:var(--vde-space-sm)]',
              // Was `text-xs` — 12px on a control the user has to hit and read.
              '[font-size:var(--vde-font-size-ui)]',
              '[line-height:var(--vde-line-height-ui)]',
              'font-medium',
              // This component previously had no focus styles at all, on the
              // trigger or on any item.
              'focus-visible:[outline:2px_solid_var(--vde-color-ring)]',
              'focus-visible:[outline-offset:2px]',
              '[font-family:var(--vde-font-body)]',
              '[border-color:var(--vde-color-border)]',
              '[background:var(--vde-color-surface)]',
              '[color:var(--vde-color-surface-foreground)]',
              '[box-shadow:var(--vde-shadow-ambient)]',
              '[transform:translateY(0)_scale(0.72)]',
              classForIndex(ITEM_TRANSLATE_OPEN_CLASSES, index),
              '[opacity:0]',
              'group-data-[open=true]/orb:[opacity:1]',
              '[transition-property:transform,opacity]',
              itemMotionClasses,
              '[transition-delay:0ms]',
              classForIndex(ITEM_DELAY_OPEN_CLASSES, index),
              'whitespace-nowrap',
            ].join(' ');

            if (item.href) {
              return (
                <li key={item.id}>
                  <a className={itemClasses} href={item.href} onClick={() => handleSelect(item)}>
                    {item.label}
                  </a>
                </li>
              );
            }

            return (
              <li key={item.id}>
                <button className={itemClasses} onClick={() => handleSelect(item)} type="button">
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>

        <button
          ref={triggerRef}
          aria-expanded={isOpen}
          aria-label={label}
          className={[
            'pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border text-lg',
            'focus-visible:[outline:2px_solid_var(--vde-color-ring)]',
            'focus-visible:[outline-offset:2px]',
            '[font-family:var(--vde-font-display)] [border-color:var(--vde-color-border)] [background:var(--vde-color-accent)] [color:var(--vde-color-accent-foreground)] [box-shadow:var(--vde-shadow-hard)]',
            '[transition-property:transform]',
            buttonMotionClasses,
            physics.variant === 'orbital' ? 'group-data-[open=true]/orb:[transform:scale(1.06)]' : '',
            physics.variant !== 'orbital' ? 'group-data-[open=true]/orb:[transform:scale(1)]' : '',
          ].join(' ')}
          onClick={() => setIsOpen(current => !current)}
          type="button"
        >
          <span
            className={[
              '[transform:rotate(0deg)]',
              'group-data-[open=true]/orb:[transform:rotate(45deg)]',
              '[transition-property:transform]',
              buttonMotionClasses,
            ].join(' ')}
          >
            +
          </span>
        </button>
      </nav>
    );
  }
);

NavigationOrb.displayName = 'NavigationOrb';
