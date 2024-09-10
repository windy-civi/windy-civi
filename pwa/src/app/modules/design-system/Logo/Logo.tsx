import civiLogo from "~/app-shell/assets/civi-temp-logo.png";

export const Logo = () => {
  return (
    <img
      src={civiLogo}
      alt="Windy Civi Logo"
      className="h-8"
      style={{
        filter: "brightness(0) invert(1)",
      }}
    />
  );
};
