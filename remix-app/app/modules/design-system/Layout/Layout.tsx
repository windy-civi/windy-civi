/**
 * Layout related components
 */

import { classNames } from "~app/modules/design-system/styles";

interface StyleComponent {
  style?: React.CSSProperties;
  className?: React.HTMLAttributes<HTMLElement>["className"];
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
    className={classNames(
      "grid grid-cols-1 lg:grid-cols-[minmax(300px,_500px)_1fr]",
      className
    )}
    style={style}
  >
    {children}
  </section>
);
