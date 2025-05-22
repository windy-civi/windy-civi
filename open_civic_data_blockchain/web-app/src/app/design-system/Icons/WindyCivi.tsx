import windyCiviLogo from "./windy-civi-logo.png";
import { useState, useEffect, useRef } from "react";

export const Logo = () => {
  return (
    <InvertibleLogo
      logoSrc={windyCiviLogo}
      logoAlt="Windy Civi Logo"
      threshold={100}
    />
  );
};

// Logo component that changes inversion based on background
// code generated
const InvertibleLogo = ({
  logoSrc = "",
  logoAlt = "Logo",
  threshold = 100,
}) => {
  const [inverted, setInverted] = useState(false);
  const logoRef = useRef(null);

  useEffect(() => {
    // Simple scroll-based inversion with throttle
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setInverted(true);
      } else {
        setInverted(false);
      }
    };

    // Throttle scroll handler to run at most every 100ms
    let throttleTimeout: number | null = null;
    const throttledScroll = () => {
      if (!throttleTimeout) {
        throttleTimeout = window.setTimeout(() => {
          handleScroll();
          throttleTimeout = null;
        }, 100);
      }
    };

    window.addEventListener("scroll", throttledScroll);
    // Run once on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (throttleTimeout) {
        window.clearTimeout(throttleTimeout);
      }
    };
  }, [threshold]);

  return (
    <img
      ref={logoRef}
      src={logoSrc}
      alt={logoAlt}
      className="h-8"
      style={{
        filter: inverted
          ? "brightness(0) invert(0)"
          : "brightness(0) invert(1)",
        transition: "filter 0.3s ease",
      }}
    />
  );
};
