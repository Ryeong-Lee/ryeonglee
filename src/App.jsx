import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import PullCord from "./components/PullCord";
import GlassLens from "./components/GlassLens";
import WeightWave from "./components/WeightWave";
import RollLinks from "./components/RollLinks";
import Marker from "./components/Marker";
import { Calendar, VocFlow, TrialFlow } from "./components/Pictos";
import {
  EMAIL, RESUME_URL, NAV, STICKERS, POSTING, TABS, PDP_CASE, LINGORA, AMORE,
  COPY_LINES, AI_SHORTS, EDITS, CES,
} from "./content";

function useTheme() {
  const [light, setLight] = useState(() => document.documentElement.dataset.theme === "light");
  useEffect(() => {
    try { localStorage.setItem("theme", light ? "light" : "dark"); } catch { /* noop */ }
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", light ? "#f6f4ef" : "#111111");
  }, [light]);
  const toggle = useCallback((x, y) => {
    const root = document.documentElement;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.style.setProperty("--vt-x", `${x}px`);
    root.style.setProperty("--vt-y", `${y}px`);
    root.style.setProperty("--vt-r", `${r}px`);
    const flip = () => {
      const next = root.dataset.theme !== "light";
      root.dataset.theme = next ? "light" : "dark";
      flushSync(() => setLight(next));
    };
    if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.startViewTransition(flip);
    } else flip();
  }, []);
  return [light, toggle];
}

/* ---------- small pieces ---------- */

function Accordion({ org, title, period, open: initial = true, children }) {
  const [open, setOpen] = useState(initial);
  return (
    <article className={`acc ${open ? "is-open" : ""}`}>
      <button className="acc-head" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="acc-org">{org}</span>
        <span className="acc-title">{title}</span>
        {period && <span className="acc-period">{period}</span>}
        <svg className="acc-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6" /></svg>
      </button>
      <div className="acc-body" hidden={!open}>{children}</div>
    </article>
  );
}

function Col({ label, children, className = "" }) {
  return (
    <div className={`col ${className}`}>
      <p className="col-label">{label}</p>
      {children}
    </div>
  );
}

function Bullets({ items }) {
  return <ul className="bul">{items.map((t, i) => <li key={i}>{t}</li>)}</ul>;
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
        />
        {!playing && (
          <button className="play" aria-label={`${s.series} ${s.ep} 재생`}
            onClick={(e) => e.currentTarget.previousElementSibling.play()}>
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
          <iframe src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`} title={v.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
        ) : (
          <button className="yt-poster" onClick={() => setOn(true)} aria-label={`${v.title} 재생`}>
            <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" />
            <span className="play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" /></svg></span>
          </button>
        )}
      </div>
      <h4>{v.title}</h4>
      <p className="yt-meta">{v.meta}</p>
      <p className="yt-note">{v.note}</p>
    </article>
  );
}

/* ---------- tab panels ---------- */

function ContentPanel() {
  return (
    <>
      <Accordion org={PDP_CASE.org} title={PDP_CASE.title} period={PDP_CASE.period}>
        <div className="cols">
          <Col label="담당 업무"><Bullets items={PDP_CASE.role} /></Col>
          <Col label="Before → After" className="col-wide">
            <div className="cutlines">
              {PDP_CASE.pairs.map((p) => (
                <div key={p.tag} className="cutline">
                  <p className="cut-tag">{p.tag}</p>
                  <p className="cut-before">{p.before}</p>
                  <p className="cut-after">{p.after}</p>
                </div>
              ))}
            </div>
          </Col>
          <Col label="성과">
            <p className="big"><Marker>{PDP_CASE.metric.value}</Marker></p>
            <p className="big-label">{PDP_CASE.metric.label}</p>
            <figure className="shot">
              <img src="/img/reddit-megathread.webp" alt="LG 공식 Reddit 커뮤니티에 발행한 제품 메가스레드" loading="lazy" />
            </figure>
          </Col>
        </div>
      </Accordion>

      <Accordion org={LINGORA.org} title={LINGORA.title} period={LINGORA.period}>
        <div className="cols">
          <Col label="담당 업무">
            <Bullets items={LINGORA.role} />
            <div className="metric-row">
              {LINGORA.metrics.map((m) => (
                <div key={m.label}>
                  <p className="big"><Marker>{m.value}</Marker></p>
                  <p className="big-label">{m.label}</p>
                </div>
              ))}
            </div>
          </Col>
          <Col label="작업물" className="col-wide2">
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
          </Col>
        </div>
      </Accordion>

      <Accordion org="[카피 샘플]" title="한 줄로 웃게 하고, 한 줄로 움직이게" period="개인 기획 시안">
        <ol className="copylist">
          {COPY_LINES.map((c, i) => (
            <li key={i}>
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
      </Accordion>

      <Accordion org={AMORE.org} title={AMORE.title} period={AMORE.period} open={false}>
        <div className="cols">
          <Col label="담당 업무" className="col-wide"><Bullets items={AMORE.role} /></Col>
          <Col label="결과"><p className="result">{AMORE.result}</p></Col>
        </div>
      </Accordion>
    </>
  );
}

function VideoPanel() {
  return (
    <>
      <Accordion org="[AI 숏폼]" title="정보형 숏폼 시리즈 4편" period="기획 · 제작 100% · 링크드인 게시">
        <p className="acc-lead">AI 도구로 제작 과정을 설계해, 1분 안팎의 정보형 숏폼을 혼자 기획하고 만들었습니다.</p>
        <div className="shorts">{AI_SHORTS.map((s) => <Short key={s.file} s={s} />)}</div>
      </Accordion>
      <Accordion org="[직접 편집]" title="촬영 구성부터 그래픽까지 손으로 다듬은 영상">
        <div className="yts">{EDITS.map((v) => <YouTube key={v.id} v={v} />)}</div>
      </Accordion>
      <Accordion org={CES.org} title={CES.title} period={CES.period} open={false}>
        <div className="cols">
          <Col label="담당 업무" className="col-wide"><Bullets items={CES.role} /></Col>
        </div>
      </Accordion>
    </>
  );
}

function OpsPanel() {
  return (
    <>
      <p className="acc-lead on-panel">고객사 내부 자료는 공개하지 않고, 어떤 구조로 만들었는지만 다시 그렸습니다.</p>
      <Accordion org="[LG CNS]" title="주간 운영 · 분석 · 체험단" period="2026 · 글로벌 마케팅 인턴 (고객사 LG전자)">
        <div className="care-grid">
          <div className="care-card">
            <Calendar />
            <h4>주간 콘텐츠 캘린더</h4>
            <p>발행 계획과 주간 성과를 한 장에 묶어, 고객사 정기 보고에 사용했습니다.</p>
          </div>
          <div className="care-card">
            <VocFlow />
            <h4>VoC 감성분석 리포트</h4>
            <p>매주 댓글 약 <b>2,000건</b>·게시물 약 <b>100건</b>을 수집해 감성을 분석하고 브랜드 리포트로 정리했습니다. 리포트는 LG전자 마케팅·영업·PR·상품기획팀에 공유되었습니다.</p>
          </div>
          <div className="care-card">
            <TrialFlow />
            <h4>체험단 운영</h4>
            <p>지원자 <b>800명</b> 중 <b>40명</b>을 AI 기반으로 선정해 선정 시간을 절반 이하로 줄이고, 배송 기간을 <b>2개월 → 1주</b>로 단축했습니다.</p>
          </div>
        </div>
      </Accordion>
    </>
  );
}

/* ---------- page ---------- */

export default function App() {
  const [light, toggle] = useTheme();
  const [tab, setTab] = useState(0);
  const openTab = (id) => {
    setTab(TABS.findIndex((t) => t.id === id));
    document.getElementById("file")?.scrollIntoView({ behavior: "smooth" });
  };
  const t = TABS[tab];

  return (
    <>
      <a className="skip" href="#match">본문으로 건너뛰기</a>
      <header className="topbar">
        <a href="#top" className="brand">LEE CHAERYEONG<small>CAREER FILE</small></a>
        <nav className="topnav" aria-label="Sections">
          {NAV.map((m) => <a key={m.href} href={m.href}>{m.label}</a>)}
        </nav>
      </header>

      <main id="top">
        {/* ---------- HERO ---------- */}
        <section className="hero">
          <div className="hero-lamp"><PullCord isLight={light} onToggle={toggle} /></div>
          <div className="stickers" aria-hidden="true">
            {STICKERS.map((s, i) => (
              <span key={i} className={`sticker st-${i} tone-${s.tone}`} style={{ "--rot": `${s.rot}deg` }}>
                <b>{s.text}</b><small>{s.sub}</small>
              </span>
            ))}
          </div>
          <div className="hero-inner">
            <p className="eyebrow">Internship Application · Marketing (New Brand)</p>
            <h1 className="hero-title">Life Is Too Short<br />for <em>Boring</em> Content.</h1>
            <p className="hero-intro">
              말과 글에 능한 마케터, <b>이채령</b>입니다.<br />
              그래서 더더욱, <Marker delay={300}>수치로 증명</Marker>합니다.
            </p>
            <div className="hero-ctas">
              <a className="btn btn-red" href="#match">지원 직무와 맞춰보기 →</a>
              <a className="btn btn-ghost" href="#file">커리어 파일 열기 →</a>
            </div>
          </div>
          <p className="scroll-cue" aria-hidden="true">Scroll Down</p>
        </section>

        {/* ---------- MATCH ---------- */}
        <section id="match" className="sec">
          <h2 className="sec-title">모집 분야 안내<span>, 지원자 버전</span></h2>
          <p className="sec-sub">로레알 코리아가 찾는 일과, 제가 이미 해 본 일을 한 줄씩 맞춰 보았습니다.</p>

          <div className="pill-tabs" aria-hidden="true">
            <span className="on">MARKETING &amp; BUSINESS</span>
            <span>GLOBAL MARKETING</span>
            <span>SCIENCE &amp; ENGINEERING</span>
          </div>

          <article className="acc is-open posting">
            <div className="acc-head static">
              <span className="acc-org">{POSTING.division}</span>
              <span className="acc-title">{POSTING.title}</span>
              <span className="acc-badge">MATCH 7/7</span>
            </div>
            <div className="acc-body">
              <div className="cols">
                <Col label="담당 업무 → 제가 해 본 일" className="col-wide">
                  <ul className="match">
                    {POSTING.duties.map((d, i) => (
                      <li key={i}>
                        <span className="m-duty">{d.duty}</span>
                        <button className="m-proof" onClick={() => openTab(d.go)}>
                          {d.proof}<span aria-hidden="true"> ↗</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </Col>
                <Col label="인턴 프로젝트">
                  <p className="proj">{POSTING.project.title}</p>
                  <p className="proj-sub">이 프로젝트에 바로 가져갈 수 있는 것</p>
                  <Bullets items={POSTING.project.ready} />
                </Col>
                <Col label="자격 요건">
                  <ul className="quals">
                    {POSTING.quals.map((q, i) => (
                      <li key={i}>
                        <span className="check" aria-hidden="true">✓</span>
                        <span><span className="q">{q.q}</span><span className="a">{q.a}</span></span>
                      </li>
                    ))}
                  </ul>
                </Col>
              </div>
            </div>
          </article>
        </section>

        {/* ---------- CAREER FILE ---------- */}
        <section id="file" className="sec">
          <h2 className="sec-title serif">Open my Career File</h2>
          <p className="sec-sub">파일을 하나씩 열어 보세요. 각 파일에 담당 업무와 결과물, 성과를 정리했습니다.</p>

          <RollLinks
            className="folder-tabs"
            label="Career file tabs"
            autoplay={false}
            active={tab}
            items={TABS.map((x, i) => ({ label: x.label, tone: x.tone, num: false, onClick: () => setTab(i) }))}
          />
          <div className={`folder tone-${t.tone}`}>
            <div className="folder-lead">
              <h3>{t.lead.split("\n").map((l, i) => <span key={i}>{l}<br /></span>)}</h3>
              <p className="tags">{t.tags}</p>
            </div>
            <div className="folder-body">
              {t.id === "content" && <ContentPanel />}
              {t.id === "video" && <VideoPanel />}
              {t.id === "ops" && <OpsPanel />}
            </div>
          </div>
        </section>

        {/* ---------- CONTACT ---------- */}
        <section id="contact" className="sec contact">
          <WeightWave as="h2" className="contact-title" text="Any Questions?" />
          <p className="contact-line">새 브랜드의 첫 피드, 첫 숏폼, 첫 리포트를 함께 만들고 싶습니다.</p>
          <div className="hero-ctas">
            <a className="btn btn-red btn-mail" href={`mailto:${EMAIL}`}>
              <span>메일 보내기 →</span><small>{EMAIL}</small>
            </a>
            {RESUME_URL && <a className="btn btn-ghost" href={RESUME_URL} target="_blank" rel="noreferrer">이력서 보기 →</a>}
          </div>
        </section>
      </main>

      <div className="fab" aria-label="Quick links">
        <a className="btn btn-red" href={`mailto:${EMAIL}`}>지금 연락하기 →</a>
        <a className="btn btn-dark" href="#match">직무 매칭 보기 →</a>
      </div>

      <footer className="footer">
        <span>© 2026 Lee Chaeryeong</span>
        <span>지원자 개인 포트폴리오이며, 로레알 코리아의 공식 페이지가 아닙니다.</span>
      </footer>
    </>
  );
}
