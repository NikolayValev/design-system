import React from "react";

export interface EditorialHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "massive";
  writingMode?: "horizontal" | "vertical";
}

const sizeClassMap: Record<
  NonNullable<EditorialHeaderProps["size"]>,
  string
> = {
  sm: "[font-size:clamp(1.4rem,_2vw,_1.8rem)]",
  md: "[font-size:clamp(1.9rem,_3.5vw,_2.8rem)]",
  lg: "[font-size:clamp(2.6rem,_5.2vw,_4rem)]",
  massive:
    "[font-size:var(--vde-editorial-massive-size,_clamp(4rem,_11vw,_10rem))]",
};

export const EditorialHeader = React.forwardRef<
  HTMLHeadingElement,
  EditorialHeaderProps
>(
  (
    {
      as = "h1",
      size = "lg",
      writingMode = "horizontal",
      className = "",
      ...props
    },
    ref,
  ) => {
    const Tag = as;

    const classes = [
      "relative",
      "inline-block",
      "max-w-full",
      sizeClassMap[size],
      writingMode === "vertical"
        ? "[writing-mode:vertical-rl] [text-orientation:mixed]"
        : "[writing-mode:horizontal-tb] [text-orientation:initial]",
      // Every treatment below used to be an `isMuseum` / `isBrutalist` / `isImmersive`
      // branch inside this component, which contradicted the rule Button.tsx states
      // for the whole library: read only `--vde-*`, never branch on the theme. The
      // branches are now tokens, so a new vision restyles this header without
      // touching the component.
      "[margin-block:var(--vde-editorial-margin-block)]",
      "[margin-inline:var(--vde-editorial-margin-inline)]",
      "[color:var(--vde-editorial-color)]",
      "[background:var(--vde-editorial-background)]",
      "[padding-inline:var(--vde-editorial-padding-inline)]",
      "[padding-block:var(--vde-editorial-padding-block)]",
      "[text-transform:var(--vde-editorial-text-transform)]",
      "[text-shadow:var(--vde-editorial-glow)]",
      "[font-weight:var(--vde-editorial-weight)]",
      "[letter-spacing:var(--vde-editorial-tracking)]",
      "[font-family:var(--vde-font-display)]",
      "[line-height:var(--vde-line-height-tight)]",
      // Was `transition-all`, which animates layout properties too.
      "[transition-property:color,background-color,text-shadow,letter-spacing]",
      "[transition-duration:var(--vde-motion-duration-normal)]",
      "[transition-timing-function:var(--vde-motion-easing-standard)]",
      className,
    ].join(" ");

    return (
      <Tag
        ref={ref}
        className={classes}
        data-vde-component="editorial-header"
        {...props}
      />
    );
  },
);

EditorialHeader.displayName = "EditorialHeader";
