import { useEffect, useRef, useState } from "react";

// Marker: a highlighter stroke drawn under the text when it scrolls into view.
export default function Marker({ children, delay = 0 }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([en]) => { if (en.isIntersecting) { setOn(true); io.disconnect(); } },
      { threshold: 0.8 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <mark ref={ref} className={`marker ${on ? "is-on" : ""}`} style={{ "--d": `${delay}ms` }}>
      {children}
    </mark>
  );
}
