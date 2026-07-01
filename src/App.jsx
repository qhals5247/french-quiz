import { fetchWords } from "./words";
import { useState, useEffect } from "react";

// ── 상수 ──────────────────────────────────────────────
const THEME_GROUPS = [
  { label: "🌿 L'environnement", themes: ["La pollution", "Milieux naturels", "L'environnement", "Agir pour l'environnement"] },
  { label: "🛍 La consommation", themes: ["Consommer", "Le produit", "Les personnes", "Les catégories de produits"] },
  { label: "🏠 Le logement", themes: ["Les types de logement", "Les parties d'un logement", "L'immeuble", "L'annonce immobilière", "Les frais", "Les habitants"] },
  { label: "🛋 Le mobilier et cadre de vie", themes: ["Les meubles", "La décoration", "L'équipement", "La ville"] },
  { label: "🍽 Les aliments", themes: ["Les légumes", "Les légumes secs et céréales", "Les fruits", "Les viandes", "Les poissons", "Les épices", "Les actions culinaires", "Les quantités"] },
];

const C = {
  blue: "#002395", blueLight: "#e8ecf8", bluePale: "#f0f3fb",
  white: "#ffffff", red: "#ED2939", redPale: "#fff5f5",
  gray: "#6b7280", grayLight: "#f3f4f6", grayBorder: "#e5e7eb",
  text: "#111827", textMid: "#374151",
  green: "#059669", greenPale: "#ecfdf5",
  amber: "#b45309", amberPale: "#fffbeb",
};
const font = "system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif";
const outer = { minHeight: "100vh", background: `linear-gradient(160deg, ${C.blue} 0%, #001a70 50%, #c0001e 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: font, padding: 16 };
const card = { background: C.white, borderRadius: 20, padding: 28, maxWidth: 460, width: "100%", boxShadow: "0 16px 48px rgba(0,0,0,0.25)", borderTop: `4px solid ${C.blue}` };
const primaryBtn = { background: C.blue, color: C.white, border: "none", borderRadius: 12, padding: "13px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", display: "block", fontFamily: font };
const triBar = (
  <div style={{ display: "flex", height: 6, borderRadius: 4, overflow: "hidden", marginBottom: 20 }}>
    <div style={{ flex: 1, background: C.blue }} />
    <div style={{ flex: 1, background: C.white, border: `1px solid ${C.grayBorder}` }} />
    <div style={{ flex: 1, background: C.red }} />
  </div>
);

// ── TTS ───────────────────────────────────────────────
let audioPlayer = null;
function speakFrench(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  
  const trySpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    const frVoice = 
      voices.find(v => v.lang === "fr-FR" && v.name.includes("Google")) ||
      voices.find(v => v.lang === "fr-FR") ||
      voices.find(v => v.lang.startsWith("fr"));
    
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "fr-FR";
    utt.rate = 0.85;
    utt.pitch = 1;
    if (frVoice) utt.voice = frVoice;
    window.speechSynthesis.speak(utt);
  };

  // voices가 아직 로딩 안 됐을 때 대비
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = trySpeak;
  } else {
    trySpeak();
  }
}

// ── 유틸 ──────────────────────────────────────────────
function shuffle(arr) {
  let a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function normalize(s) {
  return s.toLowerCase()
    .replace(/[éèêë]/g, "e").replace(/[àâä]/g, "a")
    .replace(/[îï]/g, "i").replace(/[ôö]/g, "o")
    .replace(/[ùûü]/g, "u").replace(/[ç]/g, "c")
    .replace(/^(le |la |les |l'|un |une )/, "").trim();
}
function getGroup(correct, total) {
  if (total === 0) return "skip";
  const r = correct / total;
  if (r >= 0.75) return "good";
  if (r >= 0.4) return "mid";
  return "bad";
}

// ── STATS SCREEN ──────────────────────────────────────
function StatsScreen({ stats, allWords, onRestart, onBack }) {
  const good = [], mid = [], bad = [];
  Object.entries(stats).forEach(([fr, s]) => {
    const word = allWords.find(w => w.fr === fr);
    if (!word) return;
    const g = getGroup(s.correct, s.total);
    const pct = Math.round((s.correct / s.total) * 100);
    const item = { ...word, correct: s.correct, total: s.total, pct };
    if (g === "good") good.push(item);
    else if (g === "mid") mid.push(item);
    else bad.push(item);
  });

  const groups = [
    { key: "good", label: "거의 맞추는 단어", emoji: "🟢", color: C.green, pale: C.greenPale, border: "#6ee7b7", items: good, desc: "75% 이상" },
    { key: "mid", label: "절반 정도 맞추는 단어", emoji: "🟡", color: "#d97706", pale: "#fffbeb", border: "#fcd34d", items: mid, desc: "40~74%" },
    { key: "bad", label: "거의 틀리는 단어", emoji: "🔴", color: C.red, pale: C.redPale, border: "#fca5a5", items: bad, desc: "39% 이하" },
  ];
  const [open, setOpen] = useState({ good: true, mid: true, bad: true });

  return (
    <div style={outer}>
      <div style={{ ...card, maxWidth: 520, padding: 24 }}>
        {triBar}
        <h2 style={{ color: C.blue, textAlign: "center", margin: "0 0 6px", fontSize: 20 }}>📊 단어 분석 결과</h2>
        <p style={{ color: C.gray, textAlign: "center", fontSize: 13, marginBottom: 20 }}>총 {Object.keys(stats).length}개 단어 기록</p>
        {groups.map(g => (
          <div key={g.key} style={{ marginBottom: 14, border: `2px solid ${g.border}`, borderRadius: 14, overflow: "hidden" }}>
            <div onClick={() => setOpen(o => ({ ...o, [g.key]: !o[g.key] }))}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 16px", background: g.pale, cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>{g.emoji}</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: g.color }}>{g.label}</span>
                <span style={{ fontSize: 12, color: g.color, opacity: 0.7 }}>({g.desc})</span>
              </div>
              <span style={{ background: g.color, color: C.white, borderRadius: 20, padding: "2px 10px", fontSize: 13, fontWeight: 700 }}>{g.items.length}개 {open[g.key] ? "▲" : "▼"}</span>
            </div>
            {open[g.key] && g.items.length > 0 && (
              <div style={{ background: C.white, padding: "8px 12px" }}>
                {g.items.map((w, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 4px", borderBottom: i < g.items.length - 1 ? `1px solid ${C.grayBorder}` : "none" }}>
                    <div>
                      <span style={{ fontWeight: 600, color: C.blue, fontSize: 14 }}>{w.fr}</span>
                      <span style={{ color: C.gray, fontSize: 12, marginLeft: 8 }}>{w.ko}</span>
                    </div>
                    <span style={{ background: g.pale, color: g.color, borderRadius: 20, padding: "2px 8px", fontSize: 12, fontWeight: 700, border: `1px solid ${g.border}` }}>{w.pct}%</span>
                  </div>
                ))}
              </div>
            )}
            {open[g.key] && g.items.length === 0 && (
              <div style={{ padding: "12px 16px", color: C.gray, fontSize: 13, textAlign: "center" }}>해당 단어 없음</div>
            )}
          </div>
        ))}
        <button onClick={onRestart} style={primaryBtn}>다시 시작</button>
        <button onClick={onBack} style={{ ...primaryBtn, background: C.grayLight, color: C.gray, marginTop: 8 }}>주제 변경 ←</button>
      </div>
    </div>
  );
}

// ── THEME PICKER ──────────────────────────────────────
function ThemePicker({ allWords, onStart }) {
  const allThemes = Array.from(new Set(allWords.map(w => w.theme)));
  const [selected, setSelected] = useState(new Set());

  const toggle = t => setSelected(prev => { const s = new Set(prev); s.has(t) ? s.delete(t) : s.add(t); return s; });
  const toggleGroup = themes => {
    const allOn = themes.every(t => selected.has(t));
    setSelected(prev => { const s = new Set(prev); themes.every(t => allOn ? s.delete(t) : s.add(t)); return s; });
  };
  const count = allWords.filter(w => selected.has(w.theme)).length;

  // 시트에 새 주제가 추가된 경우 THEME_GROUPS에 없는 것도 자동 표시
  const knownThemes = THEME_GROUPS.flatMap(g => g.themes);
  const extraThemes = allThemes.filter(t => !knownThemes.includes(t));
  const displayGroups = extraThemes.length > 0
    ? [...THEME_GROUPS, { label: "➕ 기타", themes: extraThemes }]
    : THEME_GROUPS;

  return (
    <div style={outer}>
      <div style={{ ...card, maxWidth: 520 }}>
        {triBar}
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}>🇫🇷</div>
          <h2 style={{ margin: 0, color: C.blue, fontSize: 22, fontWeight: 700 }}>Quiz de Vocabulaire</h2>
          <p style={{ color: C.gray, margin: "6px 0 0", fontSize: 14 }}>학습할 주제를 선택하세요</p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 14 }}>
          <button onClick={() => setSelected(new Set(allThemes))} style={{ background: C.blueLight, color: C.blue, border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>전체 선택</button>
          <button onClick={() => setSelected(new Set())} style={{ background: C.grayLight, color: C.gray, border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>전체 해제</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 360, overflowY: "auto", paddingRight: 2 }}>
          {displayGroups.map(g => {
            const allOn = g.themes.every(t => selected.has(t));
            const someOn = g.themes.some(t => selected.has(t));
            const wordCount = allWords.filter(w => g.themes.includes(w.theme)).length;
            return (
              <div key={g.label} style={{ border: `2px solid ${allOn ? C.blue : someOn ? "#93a8d8" : C.grayBorder}`, borderRadius: 14, overflow: "hidden" }}>
                <div onClick={() => toggleGroup(g.themes)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: allOn ? C.blue : someOn ? C.blueLight : C.grayLight, cursor: "pointer", borderRadius: 12 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: allOn ? C.white : C.blue }}>{g.label}</span>
                  <span style={{ fontSize: 13, color: allOn ? "rgba(255,255,255,0.85)" : C.blue, fontWeight: 600 }}>
                    {allOn ? "✓ 선택됨" : someOn ? "일부 선택" : "선택 안 됨"} · {wordCount}단어
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 18, padding: "11px 16px", background: C.blueLight, borderRadius: 12, textAlign: "center", color: C.blue, fontWeight: 600, fontSize: 14 }}>
          선택된 단어: <b style={{ fontSize: 18 }}>{count}</b>개
        </div>
        <button onClick={() => count > 0 && onStart(selected)} style={{ ...primaryBtn, marginTop: 12, opacity: count === 0 ? 0.4 : 1, cursor: count === 0 ? "not-allowed" : "pointer" }}>
          퀴즈 시작 →
        </button>
      </div>
    </div>
  );
}

// ── QUIZ ──────────────────────────────────────────────
function Quiz({ allWords, selectedThemes, onBack }) {
  const initWords = () => shuffle(allWords.filter(w => selectedThemes.has(w.theme)));

  const [deck, setDeck] = useState(() => initWords());
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [skipped, setSkipped] = useState([]);
  const [phase, setPhase] = useState("main");
  const [stats, setStats] = useState({});
  const [muted, setMuted] = useState(false);

  const speak = text => { if (!muted) speakFrench(text); };
  const recordStat = (fr, correct) => {
    setStats(prev => {
      const s = prev[fr] || { correct: 0, total: 0 };
      return { ...prev, [fr]: { correct: s.correct + (correct ? 1 : 0), total: s.total + 1 } };
    });
  };
  const restart = () => {
    setDeck(initWords()); setIdx(0); setInput(""); setStatus(null);
    setScore(0); setStreak(0); setSkipped([]); setPhase("main"); setStats({});
  };

  const current = deck[idx];
  const pct = deck.length ? Math.round((idx / deck.length) * 100) : 0;
  const isReview = phase === "review" || phase === "skip_reveal_review";

  const check = () => {
    if (!input.trim() || status) return;
    const correct = current.fr.split(" = ").some(opt => normalize(input) === normalize(opt));
    setStatus(correct ? "correct" : "wrong");
    recordStat(current.fr, correct);
    if (correct) { setScore(s => s + 1); setStreak(s => s + 1); }
    else { setStreak(0); setSkipped(prev => [...prev, current]); speak(current.fr); }
  };

  const advance = () => {
    const nextIdx = idx + 1;
    if (nextIdx >= deck.length) setPhase(skipped.length > 0 ? "review_intro" : "done");
    else { setIdx(nextIdx); setInput(""); setStatus(null); }
  };

  const skip = () => {
    setSkipped(prev => [...prev, current]);
    speak(current.fr);
    setPhase(isReview ? "skip_reveal_review" : "skip_reveal");
  };

  const afterReveal = () => {
    const nextPhase = phase === "skip_reveal_review" ? "review" : "main";
    const nextIdx = idx + 1;
    if (nextIdx >= deck.length) setPhase(skipped.length > 0 ? "review_intro" : "done");
    else { setPhase(nextPhase); setIdx(nextIdx); setInput(""); setStatus(null); }
  };

  const startReview = () => {
    setDeck(shuffle(skipped)); setSkipped([]);
    setIdx(0); setInput(""); setStatus(null); setPhase("review");
  };

  if (phase === "done") return <StatsScreen stats={stats} allWords={allWords} onRestart={restart} onBack={onBack} />;

  if (phase === "skip_reveal" || phase === "skip_reveal_review") return (
    <div style={outer}>
      <div style={{ ...card, borderTop: `4px solid #f59e0b` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ background: "#fef3c7", color: "#92400e", borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 700 }}>⏭ 넘어간 단어</span>
          <button onClick={() => setMuted(m => !m)} style={{ background: muted ? C.redPale : C.blueLight, border: "none", borderRadius: 20, padding: "5px 12px", fontSize: 13, cursor: "pointer", color: muted ? C.red : C.blue, fontWeight: 700 }}>
            {muted ? "🔇 음소거" : "🔊 소리 켜짐"}
          </button>
        </div>
        <div style={{ background: C.amberPale, border: "2px solid #fcd34d", borderRadius: 16, padding: 28, textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: C.gray, marginBottom: 6 }}>한국어 뜻</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.text, marginBottom: 16 }}>{current?.ko}</div>
          <div style={{ width: "100%", height: 1, background: "#fcd34d", marginBottom: 16 }} />
          <div style={{ fontSize: 13, color: C.gray, marginBottom: 6 }}>프랑스어 정답</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.amber, marginBottom: 12 }}>{current?.fr}</div>
          <button onClick={() => speakFrench(current.fr)} style={{ background: "#fef3c7", border: "2px solid #fcd34d", borderRadius: 20, padding: "6px 18px", fontSize: 14, cursor: "pointer", color: "#92400e", fontWeight: 600, fontFamily: font }}>
            🔈 다시 듣기
          </button>
        </div>
        <div style={{ textAlign: "center", color: C.gray, fontSize: 13, marginBottom: 16 }}>📌 복습 퀴즈에 다시 나옵니다</div>
        <button onClick={afterReveal} style={primaryBtn}>다음으로 →</button>
      </div>
    </div>
  );

  if (phase === "review_intro") return (
    <div style={outer}>
      <div style={card}>
        <div style={{ fontSize: 48, textAlign: "center" }}>🔁</div>
        <h2 style={{ color: C.blue, textAlign: "center", margin: "12px 0 8px" }}>복습 시간!</h2>
        <p style={{ color: C.gray, textAlign: "center", marginBottom: 20 }}>
          넘어가거나 틀린 단어 <b style={{ color: C.red }}>{skipped.length}개</b>를 다시 풀어볼까요?
        </p>
        <div style={{ background: C.bluePale, border: `1px solid #c5cfe8`, borderRadius: 12, padding: 16, marginBottom: 20, maxHeight: 200, overflowY: "auto" }}>
          {skipped.map((w, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < skipped.length - 1 ? `1px solid #dde3f0` : "none" }}>
              <span style={{ color: C.blue, fontWeight: 600 }}>{w.fr}</span>
              <span style={{ color: C.gray }}>{w.ko}</span>
            </div>
          ))}
        </div>
        <button onClick={startReview} style={primaryBtn}>복습 시작 →</button>
        <button onClick={() => setPhase("done")} style={{ ...primaryBtn, background: C.grayLight, color: C.gray, marginTop: 8 }}>결과 분석 보기 📊</button>
      </div>
    </div>
  );

  const inputBorder = status === "correct" ? "#10b981" : status === "wrong" ? C.red : C.grayBorder;
  const inputBg = status === "correct" ? C.greenPale : status === "wrong" ? C.redPale : C.white;

  return (
    <div style={outer}>
      <div style={{ ...card, borderTop: `4px solid ${isReview ? "#f59e0b" : C.blue}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => { if (window.confirm("퀴즈를 중단하고 처음으로 돌아갈까요?")) onBack(); }}
              style={{ background: C.grayLight, border: "none", color: C.gray, cursor: "pointer", fontSize: 13, fontWeight: 600, padding: "5px 10px", borderRadius: 8, fontFamily: font }}>✕ 중단</button>
            {isReview && <span style={{ background: "#fef3c7", color: "#92400e", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>🔁 복습</span>}
            <span style={{ fontSize: 13, color: C.gray, fontWeight: 600 }}>{idx + 1} / {deck.length}</span>
          </div>
          <span style={{ background: C.bluePale, color: C.blue, borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 700 }}>🔥 {streak} | ✅ {score}</span>
        </div>
        <div style={{ background: C.grayLight, borderRadius: 8, height: 8, marginBottom: 20, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, background: isReview ? "#f59e0b" : C.blue, height: "100%", borderRadius: 8, transition: "width 0.4s" }} />
        </div>
        <div style={{ background: C.bluePale, border: `1.5px solid #c5cfe8`, borderRadius: 16, padding: 28, textAlign: "center", marginBottom: 20, minHeight: 90, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 13, color: C.gray, marginBottom: 8 }}>프랑스어로?</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.blue }}>{current?.ko}</div>
        </div>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") status ? advance() : check(); }}
          disabled={!!status} placeholder="프랑스어로 입력하세요..."
          style={{ width: "100%", boxSizing: "border-box", padding: "14px 16px", border: `2px solid ${inputBorder}`, borderRadius: 12, fontSize: 17, outline: "none", background: inputBg, color: C.text, transition: "all 0.2s", fontFamily: font }}
          autoFocus
        />
        {status && (
          <div style={{ marginTop: 10, padding: 12, borderRadius: 12, background: status === "correct" ? C.greenPale : C.redPale, textAlign: "center" }}>
            {status === "correct"
              ? <span style={{ color: C.green, fontWeight: 700 }}>✅ 정답! <i>{current.fr}</i></span>
              : <div><span style={{ color: C.red, fontWeight: 700 }}>❌ 오답</span><div style={{ color: C.red, marginTop: 4 }}>정답: <b style={{ fontSize: 18 }}>{current.fr}</b></div></div>
            }
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {!status ? (
            <>
              <button onClick={check} style={{ ...primaryBtn, flex: 1, padding: "13px" }}>확인 ↵</button>
              <button onClick={skip} style={{ flex: "0 0 auto", background: C.grayLight, color: C.gray, border: `2px solid ${C.grayBorder}`, borderRadius: 12, padding: "13px 14px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: font }}>⏭ 모름</button>
            </>
          ) : (
            <button onClick={advance} style={{ ...primaryBtn, flex: 1, padding: "13px" }}>
              {idx + 1 >= deck.length ? (skipped.length > 0 ? `복습하기 (${skipped.length}개) 🔁` : "결과 분석 보기 📊") : "다음 →"}
            </button>
          )}
          <button onClick={restart} style={{ background: C.grayLight, color: C.gray, border: "none", borderRadius: 12, padding: "13px 14px", fontSize: 14, cursor: "pointer", fontFamily: font }}>🔄</button>
        </div>
      </div>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 12, fontFamily: font }}>le/la/les/l' 없이 입력해도 정답으로 인정됩니다</p>
    </div>
  );
}

// ── 메인 앱 ───────────────────────────────────────────
export default function App() {
  const [words, setWords] = useState(null);
  const [error, setError] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState(null);

  useEffect(() => {
    fetchWords()
      .then(setWords)
      .catch(() => setError(true));
  }, []);

  if (error) return (
    <div style={{ ...outer }}>
      <div style={{ ...card, textAlign: "center" }}>
        <div style={{ fontSize: 48 }}>⚠️</div>
        <h2 style={{ color: C.red }}>단어를 불러오지 못했어요</h2>
        <p style={{ color: C.gray }}>구글 시트 ID나 공개 설정을 확인해주세요.</p>
        <button onClick={() => window.location.reload()} style={primaryBtn}>다시 시도</button>
      </div>
    </div>
  );

  if (!words) return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${C.blue} 0%, #001a70 50%, #c0001e 100%)`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 48 }}>🇫🇷</div>
      <p style={{ color: "white", fontSize: 18, fontFamily: font }}>단어 불러오는 중...</p>
    </div>
  );

  if (!selectedThemes) return <ThemePicker allWords={words} onStart={t => setSelectedThemes(t)} />;
  return <Quiz allWords={words} selectedThemes={selectedThemes} onBack={() => setSelectedThemes(null)} />;
}