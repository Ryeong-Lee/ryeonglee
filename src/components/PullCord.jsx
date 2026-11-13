import { useEffect, useRef } from "react";
import { S, tune, step, clamp, after, register } from "../lib/motion";

// Pull Cord: a salon lamp on a wire with a cord you can really pull.
// The cord is a chain of weighted points kept at length by soft links. Held, the
// bead follows the pointer until the cord is tight, then stretches like rubber
// and tugs the lamp. A pull past the click turns the light off or on, and the
// whole page changes theme in a circle that opens from the bulb.
// When idle it gives itself a small tug (never far enough to click) as a hint.

const SHADE = 66, AX = 34, AY = SHADE - 3;
const N = 12, SEG = 9, L = N * SEG;
const CLICK = 22, MAXS = 54;

export default function PullCord({ isLight, onToggle }) {
  const sceneRef = useRef(null);
  const grabRef = useRef(null);
  const els = useRef({});
  const lightRef = useRef(isLight);
  const toggleRef = useRef(onToggle);
  toggleRef.current = onToggle;
  lightRef.current = isLight;

  useEffect(() => {
    const scene = sceneRef.current, grab = grabRef.current, o = els.current;
    const WIRE = matchMedia("(max-width: 760px)").matches ? 18 : 72;
    o.hint.style.top = `${WIRE + SHADE + L + 34}px`;
    const TH = S(0, 46, 3), TUG = S(0, 300, 13), BP = S(1, 420, 13);
    tune(TH, 46, 3); tune(TUG, 300, 13); tune(BP, 420, 13);
    const HX = S(0, 210, 22), HY = S(0, 210, 22);
    const K = S(1, 300, 17); tune(K, 300, 17);
    let armed = true, held = null, ghost = false, gentle = false, stretch = 0, lean = 0;
    let clock = 0, userUntil = 0, side = 1, W = 0, H = 0, visible = true;
    const pts = [];

    const anchor = () => {
      const c = Math.cos(TH.x), s = Math.sin(TH.x), y = WIRE + TUG.x + AY;
      return [W / 2 + AX * c - y * s, AX * s + y * c];
    };
    const bulbAt = () => {
      const c = Math.cos(TH.x), s = Math.sin(TH.x), y = WIRE + TUG.x + 63;
      return [W / 2 - y * s, y * c];
    };
    function measure() {
      W = scene.clientWidth; H = scene.clientHeight;
      if (!pts.length) {
        const [ax, ay] = anchor();
        for (let i = 0; i <= N; i++) pts.push({ x: ax, y: ay + i * SEG, vx: 0, vy: 0 });
      }
    }
    measure();

    function flip() {
      BP.x = lightRef.current ? 0.8 : 1.35; TUG.v += 150;
      const r = scene.getBoundingClientRect();
      const [bx, by] = bulbAt();
      after(0.1, () => toggleRef.current?.(r.left + bx, r.top + by));
    }

    const pin = () => (held ? [held.x, held.y] : ghost ? [HX.x, HY.x] : null);
    function pull(soft) {
      if (ghost || held) return;
      const b = pts[N];
      ghost = true; gentle = soft; armed = !soft; side = -side;
      HX.x = b.x; HY.x = b.y; HX.v = b.vx; HY.v = b.vy;
      const [ax, ay] = anchor();
      HX.t = ax + side * (soft ? 18 : 26);
      HY.t = ay + (soft ? L - 6 : L + 64);
      after(soft ? 0.7 : 1.1, () => { ghost = false; });
    }

    const local = (e) => {
      const r = scene.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    const down = (e) => {
      const [x, y] = local(e), b = pts[N];
      held = { id: e.pointerId, x: b.x, y: b.y, ox: b.x - x, oy: b.y - y, moved: 0, sx: x, sy: y, flipped: false };
      ghost = false; gentle = false; armed = true; userUntil = clock + 9;
      try { grab.setPointerCapture(e.pointerId); } catch { /* noop */ }
      grab.classList.add("is-held");
    };
    const move = (e) => {
      if (!held || e.pointerId !== held.id) return;
      const [x, y] = local(e);
      held.x = x + held.ox; held.y = y + held.oy;
      held.moved = Math.max(held.moved, Math.hypot(x - held.sx, y - held.sy));
      userUntil = clock + 9;
    };
    const drop = (e) => {
      if (!held || e.pointerId !== held.id) return;
      const tap = held.moved < 5 && !held.flipped && e.type === "pointerup";
      held = null;
      grab.classList.remove("is-held");
      if (tap) pull(false);
    };
    const key = (e) => { if (!e.detail) { userUntil = clock + 9; pull(false); } };
    grab.addEventListener("pointerdown", down);
    grab.addEventListener("pointermove", move);
    grab.addEventListener("pointerup", drop);
    grab.addEventListener("pointercancel", drop);
    grab.addEventListener("click", key);

    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(scene);

    let alive = true;
    (function hint() {
      if (!alive) return;
      if (visible && clock >= userUntil && !held && !ghost) pull(true);
      after(5.5, hint);
    })();

    const unregister = register({
      active: () => visible,
      frame(dt) {
        clock += dt;
        [TH, TUG, BP, HX, HY, K].forEach((s) => step(s, dt));
        if (dt <= 0) return;
        const [ax, ay] = anchor(), p = pin(), b = pts[N];
        let px = 0, py = 0;
        stretch = 0; lean = 0;
        if (p) {
          const dx = p[0] - ax, dy = p[1] - ay, d = Math.hypot(dx, dy) || 1;
          const over = Math.max(0, d - L), give = MAXS * (1 - Math.exp(-over / 70)), r = Math.min(d, L) + give;
          px = ax + (dx / d) * r; py = ay + (dy / d) * r;
          stretch = give; lean = over > 0 ? dx / d : 0;
          if (over > 0) { K.x = K.t = r / L; K.v = 0; }
          if (armed && !gentle && give > CLICK) {
            armed = false; flip();
            if (held) held.flipped = true; else after(0.12, () => { ghost = false; });
          }
        }
        if (!p || !stretch) K.t = 1;
        const seg = SEG * Math.max(1, K.x);
        TUG.t = stretch * 0.22;
        TH.t = clamp((-lean * stretch) / MAXS * 0.5, -0.3, 0.3);

        const prev = pts.map((q) => [q.x, q.y]);
        for (let i = 1; i <= N; i++) {
          const q = pts[i], k = Math.exp(-(i === N ? 1.1 : 2.4) * dt);
          q.vy += 2600 * dt; q.vx *= k; q.vy *= k;
          const sp = Math.hypot(q.vx, q.vy);
          if (sp > 2600) { q.vx *= 2600 / sp; q.vy *= 2600 / sp; }
          q.x += q.vx * dt; q.y += q.vy * dt;
        }
        for (let it = 0; it < 8; it++) {
          pts[0].x = ax; pts[0].y = ay;
          if (p) { b.x = px; b.y = py; }
          for (let i = 0; i < N; i++) {
            const a = pts[i], c = pts[i + 1], dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy) || 1e-6, f = ((d - seg) / d) * 0.5;
            const wa = i === 0 ? 0 : 1, wc = i + 1 === N ? (p ? 0 : 0.3) : 1, sum = wa + wc || 1;
            a.x += (dx * f * wa) / sum * 2; a.y += (dy * f * wa) / sum * 2;
            c.x -= (dx * f * wc) / sum * 2; c.y -= (dy * f * wc) / sum * 2;
          }
        }
        pts[0].x = ax; pts[0].y = ay;
        if (p) { b.x = px; b.y = py; }
        for (let i = 1; i <= N; i++) {
          pts[i].vx = (pts[i].x - prev[i][0]) / dt;
          pts[i].vy = (pts[i].y - prev[i][1]) / dt;
        }
      },
      render() {
        if (scene.clientWidth !== W || scene.clientHeight !== H) measure();
        const th = TH.x, tug = TUG.x, b = pts[N], e = pts[N - 1];
        let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
        for (let i = 1; i < N; i++)
          d += `Q${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)} ${((pts[i].x + pts[i + 1].x) / 2).toFixed(1)} ${((pts[i].y + pts[i + 1].y) / 2).toFixed(1)}`;
        d += `L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
        const ang = Math.atan2(e.x - b.x, b.y - e.y);
        const wl = WIRE + tug - 4;
        o.lamp.style.transform = `rotate(${th.toFixed(4)}rad)`;
        o.wire.setAttribute("d", `M${(W / 2).toFixed(1)} -4L${(W / 2 - Math.sin(th) * wl).toFixed(2)} ${(Math.cos(th) * wl).toFixed(2)}`);
        o.head.style.transform = `translateY(${(WIRE + tug).toFixed(2)}px)`;
        o.bulb.style.transform = `scale(${BP.x.toFixed(4)})`;
        o.rope.setAttribute("d", d);
        o.bead.style.transform = `translate(${b.x.toFixed(2)}px,${b.y.toFixed(2)}px) rotate(${ang.toFixed(4)}rad)`;
        grab.style.transform = `translate(${b.x.toFixed(2)}px,${b.y.toFixed(2)}px)`;
      },
    });
    return () => { alive = false; unregister(); io.disconnect(); };
  }, []);

  const set = (k) => (el) => { els.current[k] = el; };
  return (
    <div className="cord-scene" ref={sceneRef}>
      <svg className="cord-rope" aria-hidden="true"><path ref={set("wire")} /></svg>
      <div className="cord-lamp" ref={set("lamp")} aria-hidden="true">
        <div className="cord-head" ref={set("head")}>
          <i className="cord-bulb" ref={set("bulb")} />
          <i className="cord-shade" />
          <i className="cord-cap" />
        </div>
      </div>
      <svg className="cord-rope" aria-hidden="true"><path ref={set("rope")} /></svg>
      <i className="cord-bead" ref={set("bead")} aria-hidden="true" />
      <button
        ref={grabRef}
        className="cord-grab"
        role="switch"
        aria-checked={isLight}
        aria-label={isLight ? "조명 끄기 (다크 모드)" : "조명 켜기 (라이트 모드)"}
      />
      <span className="cord-hint" ref={set("hint")} aria-hidden="true">Pull</span>
    </div>
  );
}
