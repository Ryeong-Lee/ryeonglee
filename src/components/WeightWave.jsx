import { useEffect, useRef } from "react";
import { S, step, clamp, register, SPRINGS } from "../lib/motion";

// Weight Wave: each letter's weight is a spring pulled toward a bell curve
// around the pointer, so a swell of bold rolls through the line.
// With nobody pointing, the swell sweeps back and forth by itself.

const LIGHT = 300, BOLD = 820, SPREAD = 0.13;

export default function WeightWave({ text, className = "", as: Tag = "p" }) {
  const ref = useRef(null);
  const chars = [...text];

  useEffect(() => {
    const wave = ref.current;
    const letters = [...wave.querySelectorAll(".ww-ch")].map((el) => ({ el, w: S(LIGHT, ...SPRINGS.wave) }));
    const focus = S(-0.2, ...SPRINGS.waveFocus);
    let hover = false, t = 0, visible = false;
    const move = (e) => {
      const r = wave.getBoundingClientRect();
      hover = true;
      focus.t = (e.clientX - r.left) / r.width;
    };
    const leave = () => { hover = false; t = 0; };
    const zone = wave.parentElement;
    zone.addEventListener("pointermove", move);
    zone.addEventListener("pointerleave", leave);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(wave);

    const unregister = register({
      active: () => visible,
      frame(dt) {
        if (!hover) {
          t += dt;
          focus.t = -0.06 + 1.12 * (0.5 - 0.5 * Math.cos((t * Math.PI * 2) / 4.6));
        }
        step(focus, dt);
        letters.forEach((l) => step(l.w, dt));
      },
      render() {
        const total = wave.offsetWidth || 1;
        const left = letters.length ? letters[0].el.offsetLeft : 0;
        const centres = letters.map((l) => (l.el.offsetLeft - left + l.el.offsetWidth / 2) / total);
        letters.forEach((l, k) => {
          const d = (centres[k] - focus.x) / SPREAD;
          const g = Math.exp(-d * d);
          l.w.t = LIGHT + (BOLD - LIGHT) * g;
          l.el.style.fontWeight = clamp(l.w.x, 100, 900).toFixed(1);
          l.el.style.opacity = (0.42 + 0.58 * clamp((l.w.x - LIGHT) / (BOLD - LIGHT), 0, 1)).toFixed(3);
        });
      },
    });
    return () => {
      unregister(); io.disconnect();
      zone.removeEventListener("pointermove", move);
      zone.removeEventListener("pointerleave", leave);
    };
  }, [text]);

  return (
    <Tag className={`ww ${className}`} ref={ref} aria-label={text}>
      {chars.map((ch, i) => (
        <span key={i} className="ww-ch" aria-hidden="true">{ch}</span>
      ))}
    </Tag>
  );
}
