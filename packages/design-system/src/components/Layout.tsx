import React from "react";
import { AestheticOrnaments } from "./AestheticOrnaments";

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  heading?: string;
}

export const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ className = "", children, heading, ...props }, ref) => {
    const classes = [
      "relative",
      "overflow-hidden",
      "border",
      "[border-radius:var(--vde-radius-surface)]",
      "[border-width:var(--vde-border-width)]",
      "[border-color:var(--vde-color-border)]",
      "[background:var(--vde-color-background)]",
      "[color:var(--vde-color-foreground)]",
      "[padding:var(--vde-space-lg)]",
      "[box-shadow:var(--vde-shadow-ambient)]",
      "[backdrop-filter:blur(var(--vde-surface-blur))]",
      // Was `transition-all`, which includes layout properties.
      "[transition-property:background-color,border-color,box-shadow,backdrop-filter]",
      "[transition-duration:var(--vde-motion-duration-normal)]",
      "[transition-timing-function:var(--vde-motion-easing-standard)]",
      "[font-family:var(--vde-font-body)]",
      className,
    ].join(" ");

    return (
      <section ref={ref} className={classes} {...props}>
        <AestheticOrnaments />
        <div className="relative z-10">
          {heading ? (
            <h2 className="[margin-bottom:var(--vde-space-md)] [font-family:var(--vde-font-display)] [line-height:var(--vde-line-height-tight)] [letter-spacing:var(--vde-letter-spacing-tight)] [font-size:var(--vde-font-size-title)]">
              {heading}
            </h2>
          ) : null}
          {children}
        </div>
      </section>
    );
  },
);

Layout.displayName = "Layout";
