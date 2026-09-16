import React from "react";

export interface FeatureTileProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: React.ReactNode;
  icon?: React.ReactNode;
  summary: React.ReactNode;
}

/**
 * FeatureTile - presentational block for feature grids and section highlights.
 *
 * The icon sits on the same line as the heading rather than in a bordered tile
 * stacked above it. The stacked-tile arrangement pushed the heading down the card
 * and gave a decorative container more visual weight than the words it introduced;
 * inline, the icon reads as a marker for the heading, which is what it is.
 */
export const FeatureTile = React.forwardRef<HTMLDivElement, FeatureTileProps>(
  ({ className = "", heading, icon, summary, ...props }, ref) => {
    const classes = [
      "group",
      "relative",
      "overflow-hidden",
      "border",
      "[border-color:var(--vde-color-border)]",
      "[border-width:var(--vde-border-width)]",
      "[border-radius:var(--vde-radius-surface)]",
      "[background:var(--vde-color-surface)]",
      "[color:var(--vde-color-surface-foreground)]",
      "[box-shadow:var(--vde-shadow-ambient)]",
      "[padding:var(--vde-space-lg)]",
      // Was `transition-all`, which animates layout properties and can stutter.
      "[transition-property:transform,border-color,box-shadow]",
      "[transition-duration:var(--vde-motion-duration-normal)]",
      "[transition-timing-function:var(--vde-motion-easing-standard)]",
      "hover:-translate-y-1",
      className,
    ].join(" ");

    return (
      <article ref={ref} className={classes} {...props}>
        <h3 className="flex items-center font-semibold [gap:var(--vde-space-xs)] [font-size:var(--vde-font-size-title)] [font-family:var(--vde-font-display)] [line-height:var(--vde-line-height-tight)]">
          {icon ? (
            <span
              aria-hidden="true"
              className="inline-flex shrink-0 items-center justify-center [color:var(--vde-color-accent)]"
            >
              {icon}
            </span>
          ) : null}
          {heading}
        </h3>

        <p className="[margin-top:var(--vde-space-sm)] [max-width:var(--vde-measure)] [font-size:var(--vde-font-size-body)] [color:var(--vde-color-muted-foreground)] [line-height:var(--vde-line-height-relaxed)]">
          {summary}
        </p>
      </article>
    );
  },
);

FeatureTile.displayName = "FeatureTile";
