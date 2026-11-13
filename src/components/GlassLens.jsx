import { useEffect, useRef } from "react";
import { S, step, register, SPRINGS, LENS } from "../lib/motion";

// Glass Lens: a round magnifying glass that glides over its content.
// Three copies of the content sit inside the glass, each zoomed a little more
// toward the rim, so the view bends outward like a convex lens. The glass
// follows the pointer on a soft spring with a slight tilt; press to zoom in.
// With no pointer around, it drifts slowly across the content.

const BEND = [1, 1.05, 1.12];

export default function GlassLens({ children, className = "", label }) {
  const wrapRef = useRef(null);
  const lensRef = useRef(null);
  const viewRef = useRef(null);
  const copyRefs = useRef([]);

  useEffect(() => {
    const wrap = wrapRef.current, lens = lensRef.current, view = viewRef.current;
    const size = () => Math.min(LENS.size, wrap.clientWidth * 0.42);
    const X = S(wrap.clientWidth / 2, ...SPRINGS.lensFollow);
    const Y = S(wrap.clientHeight / 2, ...SPRINGS.lensFollow);
    const Z = S(LENS.zoom, ...SPRINGS.lensZoom);
    let px = null, py = null, lastPointer = -1e9, clock = 0, visible = false;

    const local = (e) => {
      const r = wrap.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    const move = (e) => { [px, py] = local(e); lastPointer = performance.now(); };
    const leave = () => { px = null; Z.t = LENS.zoom; };
    const down = (e) => { move(e); Z.t = LENS.press; };
    const up = () => { Z.t = LENS.zoom; };
    wrap.addEventListener("pointermove", move);
    wrap.addEventListener("pointerleave", leave);
    wrap.addEventListener("pointerdown", down);
    addEventListener("pointerup", up);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(wrap);

    const unregister = register({
      active: () => visible,
      frame(dt) {
        clock += dt;
        const w = wrap.clientWidth, h = wrap.clientHeight;
        const idle = px === null || performance.now() - lastPointer > 2500;
        if (idle) {
          X.t = w / 2 + Math.cos(clock * 0.42) * w * 0.3;
          Y.t = h / 2 + Math.sin(clock * 0.84) * h * 0.22;
        } else { X.t = px; Y.t = py; }
        step(X, dt); step(Y, dt); step(Z, dt);
      },
      render() {
        const Ls = size(), x = X.x, y = Y.x;
        const tilt = Math.max(-6, Math.min(6, X.v / 220));
        lens.style.width = lens.style.height = Ls + "px";
        lens.style.transform = `translate(${(x - Ls / 2).toFixed(2)}px,${(y - Ls / 2).toFixed(2)}px) rotate(${tilt.toFixed(2)}deg)`;
        const ox = -(x - Ls / 2), oy = -(y - Ls / 2);
        const origin = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
        copyRefs.current.forEach((c, i) => {
          if (!c) return;
          c.style.width = wrap.clientWidth + "px";
          c.style.transformOrigin = origin;
          c.style.transform = `translate(${ox.toFixed(2)}px,${oy.toFixed(2)}px) scale(${(Z.x * BEND[i]).toFixed(4)})`;
        });
        view.style.transform = `rotate(${(-tilt).toFixed(2)}deg)`;
      },
    });
    return () => {
      unregister(); io.disconnect();
      wrap.removeEventListener("pointermove", move);
      wrap.removeEventListener("pointerleave", leave);
      wrap.removeEventListener("pointerdown", down);
      removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div className={`lens-wrap ${className}`} ref={wrapRef} role="img" aria-label={label}>
      {children}
      <div className="lens" ref={lensRef} aria-hidden="true">
        <div className="lens-view" ref={viewRef}>
          {BEND.map((_, i) => (
            <div key={i} className={`lens-layer l${i}`}>
              <div className="lens-copy" ref={(el) => (copyRefs.current[i] = el)}>
                {children}
              </div>
            </div>
          ))}
        </div>
        <div className="lens-glass" />
      </div>
    </div>
  );
}
