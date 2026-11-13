// CARE pictograms: the shape of each deliverable, redrawn without client data.

export function Calendar() {
  const days = ["M", "T", "W", "T", "F"];
  const filled = { "0-0": "a", "0-2": "b", "1-1": "a", "1-3": "b", "1-4": "a", "2-0": "b", "2-2": "a", "2-4": "b", "3-1": "a", "3-3": "a" };
  return (
    <svg className="picto" viewBox="0 0 240 150" role="img" aria-label="주간 콘텐츠 캘린더 구조">
      <rect x="1" y="1" width="238" height="148" rx="10" className="p-frame" />
      {days.map((d, i) => (
        <text key={i} x={46 + i * 40} y="22" className="p-label" textAnchor="middle">{d}</text>
      ))}
      {[0, 1, 2, 3].map((r) => (
        <g key={r}>
          <rect x="10" y={34 + r * 27} width="16" height="16" rx="3" className="p-soft" />
          {days.map((_, c) => {
            const f = filled[`${r}-${c}`];
            return (
              <rect key={c} x={30 + c * 40} y={34 + r * 27} width="32" height="16" rx="4"
                className={f === "a" ? "p-accent" : f === "b" ? "p-ink" : "p-line"} />
            );
          })}
        </g>
      ))}
    </svg>
  );
}

export function VocFlow() {
  return (
    <svg className="picto" viewBox="0 0 240 150" role="img" aria-label="댓글 수집, 감성 분석, 리포트 공유 흐름">
      <rect x="1" y="1" width="238" height="148" rx="10" className="p-frame" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={16 + (i % 2) * 6} y={30 + i * 22} width="46" height="14" rx="7" className="p-soft" />
      ))}
      <path d="M74 75h20" className="p-arrow" />
      <circle cx="122" cy="75" r="26" className="p-line" />
      <path d="M122 75 L122 49 A26 26 0 0 1 145 87 Z" className="p-accent" />
      <path d="M122 75 L145 87 A26 26 0 0 1 105 95 Z" className="p-ink" />
      <path d="M152 75h18" className="p-arrow" />
      <rect x="176" y="40" width="50" height="70" rx="6" className="p-line" />
      <rect x="184" y="52" width="34" height="5" rx="2.5" className="p-ink" />
      <rect x="184" y="64" width="26" height="5" rx="2.5" className="p-soft" />
      <rect x="184" y="84" width="6" height="16" rx="2" className="p-soft" />
      <rect x="194" y="78" width="6" height="22" rx="2" className="p-accent" />
      <rect x="204" y="88" width="6" height="12" rx="2" className="p-soft" />
      <text x="40" y="136" textAnchor="middle" className="p-label">수집</text>
      <text x="122" y="136" textAnchor="middle" className="p-label">감성 분석</text>
      <text x="201" y="136" textAnchor="middle" className="p-label">리포트</text>
    </svg>
  );
}

export function TrialFlow() {
  const dots = [];
  for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) dots.push([18 + c * 9, 34 + r * 12]);
  return (
    <svg className="picto" viewBox="0 0 240 150" role="img" aria-label="지원자 800명에서 40명 선정, 배송 2개월에서 1주로">
      <rect x="1" y="1" width="238" height="148" rx="10" className="p-frame" />
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" className="p-soft" />)}
      <path d="M86 70 L110 58 L110 82 Z" className="p-ink" />
      {[0, 1].map((r) => [0, 1].map((c) => (
        <circle key={`${r}${c}`} cx={128 + c * 12} cy={62 + r * 14} r="4.5" className="p-accent" />
      )))}
      <path d="M156 70h14" className="p-arrow" />
      <rect x="176" y="54" width="30" height="24" rx="3" className="p-line" />
      <path d="M206 62h10l8 8v8h-18z" className="p-line" />
      <circle cx="184" cy="82" r="4" className="p-ink" />
      <circle cx="214" cy="82" r="4" className="p-ink" />
      <text x="45" y="120" textAnchor="middle" className="p-label">800</text>
      <text x="134" y="120" textAnchor="middle" className="p-label">40</text>
      <text x="200" y="120" textAnchor="middle" className="p-label">2개월 → 1주</text>
    </svg>
  );
}
