import type { Style } from "~app/modules/design-system/styles";
import { css, Skin, Spacing } from "~app/modules/design-system/styles";

interface StyleComponent {
  style?: Style.Properties;
}

export const Card: React.FC<StyleComponent> = ({ children, style }) => (
  <div {...css({ ...styles.card, ...(style || {}) })}>{children}</div>
);

export const CardSection: React.FC = ({ children }) => (
  <section style={{ margin: Spacing.FOUR, fontSize: "0.9rem" }}>
    {children}
  </section>
);

export const CardTitle: React.FC = ({ children }) => (
  <h2
    style={{
      fontWeight: "bold",
      padding: Spacing.ZERO,
      marginTop: Spacing.TWO,
      marginBottom: Spacing.TWO,
      fontSize: "1.2rem",
      textAlign: "left",
    }}
  >
    {children}
  </h2>
);

const styles: Style.StyleSheet<"card"> = {
  card: {
    padding: Spacing.FOUR,
    marginTop: Spacing.FOUR,
    marginBottom: Spacing.FOUR,
    background: Skin.White,
    textAlign: "left",
  },
};
