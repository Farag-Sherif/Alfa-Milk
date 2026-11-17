import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";

// 1) tiny hook (kept inside for brevity)
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

const Logo = ({ currentLanguageCode, logoClass }) => {
  const isMobileOrTablet = useMediaQuery("(max-width: 768px)");

  // 2) Pick the correct path
  // A) If the image is in PUBLIC folder: public/logo.png
  const logoSrc =`${process.env.PUBLIC_URL || ""}/logo.png`
     console.log(`${process.env.PUBLIC_URL || ""}/logo.png`);

  // B) If you actually need language-specific SVGs, rename files to avoid spaces:
  // const logoSrc = `${process.env.PUBLIC_URL || ""}/${
  //   currentLanguageCode === "ar" ? "zein-ar.svg" : "zein-en.svg"
  // }`;

  return (
    <div className={`${logoClass || ""} mt-0`}>
      <Link to={`${process.env.PUBLIC_URL || ""}/`}>
        <img
          loading="lazy"
          decoding="async"
          src={`${process.env.PUBLIC_URL || ""}/logo.png`}
          alt="Logo"
          style={{
            // objectFit: "cover",
            // Donâ€™t use "!important" in inline styles; itâ€™s ignored.
            maxWidth: 100,
            display: "block",
          }}
         onError={(e) => { if (window.handleImageError) window.handleImageError(e); else { e.target.onerror = null; e.target.src = "/deal.png"; } }} onLoad={(e) => { if (window.handleImageSuccess) window.handleImageSuccess(e); }} />
      </Link>
    </div>
  );
};

Logo.propTypes = {
  logoClass: PropTypes.string,
  currentLanguageCode: PropTypes.string,
};

export default multilanguage(Logo);
