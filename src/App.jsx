import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import PullCord from "./components/PullCord";
import GlassLens from "./components/GlassLens";
import WeightWave from "./components/WeightWave";
import RollLinks from "./components/RollLinks";
import Marker from "./components/Marker";
import { Calendar, VocFlow, TrialFlow } from "./components/Pictos";
import {
  EMAIL, RESUME_URL, MENU, PDP_CASE, LINGORA, COPY_LINES, AI_SHORTS, EDITS,
} from "./content";

function useTheme() {
  const [light, setLight] = useState(() => document.documentElement.dataset.theme !== "dark");
  useEffect(() => {
    document.documentElement.dataset.theme = light ? "light" : "dark";
    try { localStorage.setItem("theme", light ? "light" : "dark"); } catch { /* noop */ }
  }, [light]);
  const toggle = useCallback((x, y) => {
    const root = document.documentElement;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.style.setProperty("--vt-x", `${x}px`);
    root.style.setProperty("--vt-y", `${y}px`);
    root.style.setProperty("--vt-r", `${r}px`);
    const flip = () => {
      const next = root.dataset.theme === "dark";
      root.dataset.theme = next ? "light" : "dark";
      flushSync(() => setLight(next));
    };
    if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.startViewTransition(flip);
    } else flip();
  }, []);
  return [light, toggle];
}

function SectionHead({ id, word, kicker, line }) {
  return (
    <header className="sec-head">
      <p className="sec-kicker"><span>{id}</span>{kicker}</p>
      <h2 className="sec-word">{word}</h2>
      <p className="sec-line">{line}</p>
    </header>
  );
}

function Short({ s }) {
  const [playing, setPlaying] = useState(false);
  return (
    <figure className="short">
      <div className="short-frame">
        <video
          src={`/video/${s.file}.mp4`}
          poster={`/img/poster-${s.file}.webp`}
          preload="none"
          playsInline
          controls={playing}
          onPlay={() => setPlaying(true)}
          onEnded={() => setPlaying(false)}
          onClick={(e) => { if (!playing) e.currentTarget.play(); }}
        />
        {!playing && (
          <button
            className="short-play"
            aria-label={`${s.series} ${s.ep} 재생`}
            onClick={(e) => e.currentTarget.previousElementSibling.play()}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" /></svg>
          </button>
        )}
      </div>
      <figcaption>
        <span className="short-series">{s.series} · {s.ep}</span>
        <span className="short-title">{s.title}</span>
      </figcaption>
    </figure>
  );
}

function YouTube({ v }) {
  const [on, setOn] = useState(false);
  return (
    <article className="yt">
      <div className="yt-frame">
        {on ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`}
            title={v.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button className="yt-poster" onClick={() => setOn(true)} aria-label={`${v.title} 재생`}>
            <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" />
            <span className="yt-play" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" /></svg>
            </span>
          </button>
        )}
      </div>
      <h4>{v.title}</h4>
      <p className="meta">{v.meta}</p>
      <p className="note">{v.note}</p>
    </article>
  );
}

export default function App() {
  const [light, toggle] = useTheme();

  return (
    <>
      <a className="skip" href="#cut">본문으로 건너뛰기</a>
      <header className="topbar">
        <a href="#top" className="brand">Lee Chaeryeong</a>
        <nav className="topnav" aria-label="Sections">
          {MENU.map((m) => <a key={m.href} href={m.href}>{m.label}</a>)}
        </nav>
      </header>

      <main id="top">
        {/* ---------- HERO ---------- */}
        <section className="hero">
          <div className="hero-lamp">
            <PullCord isLight={light} onToggle={toggle} />
          </div>
          <div className="hero-inner">
            <p className="hero-meta">
              <span>Salon Menu</span>
              <span>Marketing (New Brand) Intern Portfolio</span>
            </p>
            <h1 className="hero-title">
              Today&rsquo;s <em>Menu</em>
            </h1>
            <p className="hero-name">이채령</p>
            <p className="hero-intro">
              말과 글에 능한 마케터입니다.<br />
              그래서 더더욱, <Marker delay={300}>수치로 증명</Marker>합니다.
            </p>
            <div className="hero-menu">
              <RollLinks items={MENU} />
            </div>
            <ul className="hero-proof" aria-label="대표 성과">
              <li><b>SOV <Marker delay={500}>+15%</Marker></b><span>제품 메시지 → 커뮤니티 콘텐츠</span></li>
              <li><b><Marker delay={650}>+115%</Marker></b><span>링고라 인스타그램 팔로워</span></li>
              <li><b><Marker delay={800}>2,000</Marker></b><span>매주 분석한 VoC 댓글</span></li>
            </ul>
          </div>
        </section>

        {/* ---------- CUT ---------- */}
        <section id="cut" className="sec">
          <SectionHead id="01" kicker="SNS · Copy" word="CUT" line="짧고 선명하게, 고객이 알아듣는 길이로 다듬습니다." />

          <article className="case case-feature">
            <div className="case-text">
              <p className="case-org">{PDP_CASE.org}<span>{PDP_CASE.period}</span></p>
              <h3>{PDP_CASE.title}</h3>
              {PDP_CASE.body.map((t, i) => <p key={i} className="case-body">{t}</p>)}
              <div className="metric">
                <span className="metric-value"><Marker>{PDP_CASE.metric.value}</Marker> ↑</span>
                <span className="metric-label">{PDP_CASE.metric.label}</span>
              </div>
            </div>
            <div className="cutlines" aria-label="Before and after">
              {PDP_CASE.pairs.map((p) => (
                <div key={p.tag} className="cutline">
                  <p className="cut-tag">{p.tag}</p>
                  <p className="cut-before"><span>Before</span>{p.before}</p>
                  <p className="cut-scissor" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12" /></svg>
                  </p>
                  <p className="cut-after"><span>After</span>{p.after}</p>
                </div>
              ))}
              <figure className="shot">
                <img src="/img/reddit-megathread.webp" alt="LG 공식 Reddit 커뮤니티에 발행한 제품 메가스레드" loading="lazy" />
                <figcaption>r/LG_UserHub에 발행한 제품 메가스레드</figcaption>
              </figure>
            </div>
          </article>

          <article className="case case-lingora">
            <div className="case-text">
              <p className="case-org">{LINGORA.org}<span>{LINGORA.period}</span></p>
              <h3>{LINGORA.title}</h3>
              <p className="case-body">{LINGORA.body}</p>
              <p className="credit">{LINGORA.credit}</p>
              <div className="metric-row">
                {LINGORA.metrics.map((m) => (
                  <div key={m.label} className="metric">
                    <span className="metric-value"><Marker>{m.value}</Marker></span>
                    <span className="metric-label">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="feed">
              <GlassLens label="링고라 인스타툰과 프로모션 배너">
                <div className="feed-grid">
                  <img src="/img/lingora-toon-1.webp" alt="" />
                  <img src="/img/lingora-toon-2.webp" alt="" />
                  <img src="/img/lingora-toon-3.webp" alt="" />
                  <img src="/img/lingora-blog-1.webp" alt="" />
                  <img className="wide" src="/img/lingora-banner-1.webp" alt="" />
                  <img className="wide" src="/img/lingora-banner-2.webp" alt="" />
                </div>
              </GlassLens>
              <p className="hint">돋보기를 움직여 보세요 · 누르면 더 크게</p>
            </div>
          </article>

          <article className="copymenu">
            <div className="copymenu-head">
              <h3>Copy <em>à la carte</em></h3>
              <p>한 줄로 웃게 하고, 한 줄로 움직이게 합니다.</p>
            </div>
            <ol className="copylist">
              {COPY_LINES.map((c, i) => (
                <li key={i}>
                  <span className="copy-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="copy-line">{c.line}</span>
                  <span className="copy-src">{c.src}</span>
                </li>
              ))}
            </ol>
            <div className="copy-shots">
              <img src="/img/copy-mobile-banner.webp" alt="연차는 이월되지 않지만, 후회는 이월됩니다 모바일 배너 시안" loading="lazy" />
              <img src="/img/copy-dong-1.webp" alt="물 2L? 아니요. 컵을 책상에 올려두세요 쇼츠 시안" loading="lazy" />
              <img src="/img/copy-dong-2.webp" alt="수면 8시간? 아니요. 휴대폰을 침대 밖에 두세요 쇼츠 시안" loading="lazy" />
              <img src="/img/copy-dong-3.webp" alt="하루 만 보? 아니요. 한층만 걸어보세요 쇼츠 시안" loading="lazy" />
            </div>
            <p className="fineprint">카피 샘플은 지원 과정에서 직접 기획·제작한 개인 시안입니다.</p>
          </article>
        </section>

        {/* ---------- COLOR ---------- */}
        <section id="color" className="sec">
          <SectionHead id="02" kicker="Video · Short-form" word="COLOR" line="같은 정보도, 브랜드의 톤을 입혀 끝까지 보게 만듭니다." />

          <div className="block-head">
            <h3>AI 숏폼 시리즈</h3>
            <p>AI 도구로 제작 과정을 설계해 1분 안팎의 정보형 숏폼을 만들었습니다. 기획부터 제작까지 100% 직접 맡아 링크드인에 게시했습니다.</p>
          </div>
          <div className="shorts">
            {AI_SHORTS.map((s) => <Short key={s.file} s={s} />)}
          </div>

          <div className="block-head">
            <h3>직접 편집한 영상</h3>
            <p>촬영 구성부터 그래픽, 자막 톤까지 손으로 다듬은 작업입니다.</p>
          </div>
          <div className="yts">
            {EDITS.map((v) => <YouTube key={v.id} v={v} />)}
          </div>
        </section>

        {/* ---------- CARE ---------- */}
        <section id="care" className="sec">
          <SectionHead id="03" kicker="Ops · Report" word="CARE" line="한 번 만들고 끝내지 않고, 매주 손질합니다." />
          <p className="care-note">고객사 내부 자료는 공개하지 않고, 어떤 구조로 만들었는지만 다시 그렸습니다.</p>
          <div className="care-grid">
            <article className="care-card">
              <Calendar />
              <h3>주간 콘텐츠 캘린더</h3>
              <p>발행 계획과 주간 성과를 한 장에 묶어, 고객사 정기 보고에 사용했습니다.</p>
            </article>
            <article className="care-card">
              <VocFlow />
              <h3>VoC 감성분석 리포트</h3>
              <p>매주 댓글 약 <b>2,000건</b>·게시물 약 <b>100건</b>을 수집해 감성을 분석하고, 브랜드 리포트로 정리했습니다. 리포트는 LG전자 마케팅·영업·PR·상품기획팀에 공유되었습니다.</p>
            </article>
            <article className="care-card">
              <TrialFlow />
              <h3>체험단 운영</h3>
              <p>지원자 <b>800명</b> 중 <b>40명</b>을 AI 기반으로 선정해 선정 시간을 절반 이하로 줄이고, 배송 기간을 <b>2개월 → 1주</b>로 단축했습니다.</p>
            </article>
          </div>
        </section>

        {/* ---------- BOOK ---------- */}
        <section id="book" className="sec book">
          <p className="sec-kicker"><span>04</span>Contact</p>
          <WeightWave as="h2" className="book-title" text="Book a session" />
          <p className="book-line">새 브랜드의 첫 피드, 첫 숏폼, 첫 리포트를 함께 만들고 싶습니다.</p>
          <div className="book-actions">
            <a className="btn btn-primary" href={`mailto:${EMAIL}`}>
              <span>예약하기</span><span className="btn-sub">{EMAIL}</span>
            </a>
            {RESUME_URL && (
              <a className="btn" href={RESUME_URL} target="_blank" rel="noreferrer">이력서 보기</a>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>© 2026 Lee Chaeryeong</span>
        <span>CUT · COLOR · CARE</span>
      </footer>
    </>
  );
}
