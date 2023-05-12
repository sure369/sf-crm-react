import React, { useState, useEffect } from "react";

const useViewport = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 760;
  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  // Return the width so we can use it in our components
  return { width, breakpoint };
};

export default useViewport;

// const width = window.innerWidth;
// const mobileWidth = width < 1063;
// const mobileView = mobileWidth ? 12 : 6;
