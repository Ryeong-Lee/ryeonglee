import { useEffect, useRef } from "react";
import { S, step, after, register, SPRINGS } from "../lib/motion";

// Roll Links: each letter is a little drum with the letter on it twice.
// On hover the drums turn one after another, so the word rolls over from left
// to right, and the other links step back. Idle, it hovers the links in turn.

const STAGGER = 0.03;

export default function RollLinks({ items, autoplay = true }) {
  const navRef = useRef(null);

  useEffect(() => {
    const nav = navRef.current;
    const links = [...nav.querySelectorAll(".rl")].map((el) => ({
      el,
      on: false,
      letters: [...el.querySelectorAll(".rl-in")].map((inEl) => ({ inEl, s: S(0, ...SPRINGS.roll) })),
    }));
    let pointer = false, auto = 0, autoT = 0.8, visible = false;

    function hover(link) {
      links.forEach((l) => { if (l !== link && l.on) unhover(l); });
      link.on = true;
      link.el.classList.add("on");
      nav.classList.add("hot");
      link.letters.forEach((l, k) => after(k * STAGGER, () => { if (link.on) l.s.t = 1; }));
    }
    function unhover(link) {
      link.on = false;
      link.el.classList.remove("on");
      if (!links.some((l) => l.on)) nav.classList.remove("hot");
      link.letters.forEach((l, k) => after(k * STAGGER, () => { if (!link.on) l.s.t = 0; }));
    }
    const offs = links.map((link) => {
      const enter = () => { pointer = true; hover(link); };
      const out = () => unhover(link);
      link.el.addEventListener("pointerenter", enter);
      link.el.addEventListener("pointerleave", out);
      link.el.addEventListener("focus", enter);
      link.el.addEventListener("blur", out);
      return () => {
        link.el.removeEventListener("pointerenter", enter);
        link.el.removeEventListener("pointerleave", out);
        link.el.removeEventListener("focus", enter);
        link.el.removeEventListener("blur", out);
      };
    });
    const navLeave = () => { pointer = false; autoT = 0.9; };
    nav.addEventListener("pointerleave", navLeave);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(nav);

    const unregister = register({
      active: () => visible,
      frame(dt) {
        if (autoplay && !pointer && (autoT -= dt) <= 0) {
          const cur = links.find((l) => l.on);
          if (cur) { unhover(cur); autoT = 0.35; auto = (auto + 1) % links.length; }
          else { hover(links[auto]); autoT = 1.1; }
        }
        links.forEach((link) => link.letters.forEach((l) => step(l.s, dt)));
      },
      render() {
        links.forEach((link) =>
          link.letters.forEach((l) => { l.inEl.style.transform = `translateY(${(-l.s.x * 50).toFixed(2)}%)`; })
        );
      },
    });
    return () => { unregister(); io.disconnect(); offs.forEach((f) => f()); nav.removeEventListener("pointerleave", navLeave); };
  }, [autoplay]);

  return (
    <nav className="rl-nav" ref={navRef} aria-label="Menu">
      {items.map((it, i) => (
        <a key={it.label} className="rl" href={it.href} aria-label={`${it.label} ${it.note ?? ""}`}>
          <span className="rl-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
          <span className="rl-word" aria-hidden="true">
            {[...it.label].map((ch, k) => (
              <span key={k} className="rl-ch">
                <span className="rl-in"><i>{ch}</i><i>{ch}</i></span>
              </span>
            ))}
          </span>
          <span className="rl-dots" aria-hidden="true" />
          <span className="rl-note" aria-hidden="true">{it.note}</span>
        </a>
      ))}
    </nav>
  );
}
