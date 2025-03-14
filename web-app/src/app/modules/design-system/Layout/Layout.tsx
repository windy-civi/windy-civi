/**
 * Layout related components
 */

import { classNames } from "~app/modules/design-system/styles";

interface StyleComponent {
  style?: React.CSSProperties;
  className?: React.HTMLAttributes<HTMLElement>["className"];
  children?: React.ReactNode;
}

export const Container: React.FC<StyleComponent> = ({
  children,
  style,
  className,
}) => (
  <div className={className} style={{ ...(style || {}) }}>
    {children}
  </div>
);

export const Grid: React.FC<StyleComponent> = ({
  children,
  style,
  className,
}) => (
  <section
    /**
     * Grid layout that stacks vertically on mobile (1 column) and shows a
     * 2-column layout on desktop with:
     * - Left column: Min 300px, max 500px width
     * - Right column: Takes remaining space (1fr)
     */
    className={classNames(
      "grid grid-cols-1 lg:grid-cols-[minmax(300px,_500px)_1fr]",
      className,
    )}
    style={style}
  >
    {children}
  </section>
);
