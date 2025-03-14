import windyCiviLogo from "./windy-civi-logo.png";

export const Logo = () => {
  return (
    <img
      src={windyCiviLogo}
      alt="Windy Civi Logo"
      className="h-8"
      style={{
        filter: "brightness(0) invert(1)",
      }}
    />
  );
};
