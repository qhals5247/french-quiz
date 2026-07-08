import { useState, useEffect } from "react";
import { fetchWords } from "./words";

const C = {
  blue: "#002395", blueLight: "#e8ecf8", bluePale: "#f0f3fb",
  white: "#ffffff", red: "#ED2939", redPale: "#fff5f5",
  gray: "#6b7280", grayLight: "#f3f4f6", grayBorder: "#e5e7eb",
  text: "#111827", textMid: "#374151",
  green: "#059669", greenPale: "#ecfdf5",
};
const font = "system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif";
const outer = { minHeight: "100vh", background: "linear-gradient(160deg, #002395 0%, #001a70 50%, #c0001e 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: font, padding: 16 };
const card = { background: C.white, borderRadius: 20, padding: 28, maxWidth: 480, width: "100%", boxShadow: "0 16px 48px rgba(0,0,0,0.25)", borderTop: `4px solid ${C.blue}` };
const primaryBtn = { background: C.blue, color: C.white, border: "none", borderRadius: 12, padding: "13px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", display: "block", fontFamily: font };
const triBar = (
  <div style={{ display: "flex", height: 6, borderRadius: 4, overflow: "hidden", marginBottom: 20 }}>
    <div style={{ flex: 1, background: C.blue }} />
    <div style={{ flex: 1, background: C.white, border: `1px solid ${C.grayBorder}` }} />
    <div style={{ flex: 1, background: C.red }} />
  </div>
);

const UI = {
  ko: {
    title: "Quiz de Vocabulaire", subtitle: "학습할 주제를 선택하세요",
    selectAll: "전체 선택", clearAll: "전체 해제", selected: "선택된 단어", start: "퀴즈 시작 →", words: "단어",
    learnLabel: "단어", exampleLabel: "예문", learnBtn: "외웠어요! 문제 풀기 →", listenBtn: "🔈 발음 듣기", listenAgain: "🔈 다시 듣기",
    question: "프랑스어로?", placeholder: "프랑스어로 입력하세요...", hint: "le/la/les/l' 없이 입력해도 정답으로 인정됩니다",
    confirm: "확인 ↵", correct: "정답!", wrong: "오답", skip: "⏭ 모름", stop: "✕ 중단", restart: "🔄",
    stopConfirm: "퀴즈를 중단하고 처음으로 돌아갈까요?",
    phaseA: "📖 단계A", phaseB: "🔁 단계B",
    wrongReveal: "❌ 오답 / 모름", correctAnswer: "정답", repeatNote: "📌 다시 퀴즈에 나옵니다",
    nextBtn: "다음으로 →", reviewNote: "📌 복습 퀴즈에 다시 나옵니다",
    reviewTime: "복습 시간!", reviewDesc: "넘어가거나 틀린 단어 ", reviewDesc2: "개를 다시 풀어볼까요?",
    reviewStart: "복습 시작 →", skipResult: "결과 분석 보기 📊",
    doneTitle: "퀴즈 완료!", restartBtn: "다시 시작", changeTheme: "주제 변경 ←",
    statsTitle: "📊 단어 분석 결과", statsDesc: "개 단어 기록",
    goodGroup: "거의 맞추는 단어", midGroup: "절반 정도 맞추는 단어", badGroup: "거의 틀리는 단어",
    goodDesc: "75% 이상", midDesc: "40~74%", badDesc: "39% 이하", noWords: "해당 단어 없음",
    loading: "단어 불러오는 중...", errorDesc: "구글 시트 ID나 공개 설정을 확인해주세요.", retry: "다시 시도",
    langSelect: "언어 선택",
  },
  ja: {
    title: "Quiz de Vocabulaire", subtitle: "テーマを選んでください",
    selectAll: "全て選択", clearAll: "全て解除", selected: "選択した単語", start: "クイズ開始 →", words: "単語",
    learnLabel: "単語", exampleLabel: "例文", learnBtn: "覚えた！問題を解く →", listenBtn: "🔈 発音を聞く", listenAgain: "🔈 もう一度聞く",
    question: "フランス語で？", placeholder: "フランス語で入力...", hint: "le/la/les/l' なしでも正解と認められます",
    confirm: "確認 ↵", correct: "正解！", wrong: "不正解", skip: "⏭ わからない", stop: "✕ 中断", restart: "🔄",
    stopConfirm: "クイズを中断して最初に戻りますか？",
    phaseA: "📖 ステップA", phaseB: "🔁 ステップB",
    wrongReveal: "❌ 不正解 / わからない", correctAnswer: "正解", repeatNote: "📌 またクイズに出ます",
    nextBtn: "次へ →", reviewNote: "📌 復習クイズに再登場",
    reviewTime: "復習タイム！", reviewDesc: "スキップまたは間違えた単語 ", reviewDesc2: "個をもう一度",
    reviewStart: "復習開始 →", skipResult: "結果を見る 📊",
    doneTitle: "クイズ完了！", restartBtn: "もう一度", changeTheme: "テーマ変更 ←",
    statsTitle: "📊 単語分析", statsDesc: "個の単語を記録",
    goodGroup: "ほぼ正解", midGroup: "半分くらい正解", badGroup: "ほぼ間違え",
    goodDesc: "75%以上", midDesc: "40〜74%", badDesc: "39%以下", noWords: "該当なし",
    loading: "読み込み中...", errorDesc: "シートIDや設定を確認してください", retry: "再試行",
    langSelect: "言語選択",
  },
  zh: {
    title: "Quiz de Vocabulaire", subtitle: "请选择主题",
    selectAll: "全选", clearAll: "全部取消", selected: "已选单词", start: "开始测验 →", words: "个单词",
    learnLabel: "单词", exampleLabel: "例句", learnBtn: "记住了！开始答题 →", listenBtn: "🔈 听发音", listenAgain: "🔈 再听一次",
    question: "用法语怎么说？", placeholder: "请用法语输入...", hint: "不输入 le/la/les/l' 也算正确",
    confirm: "确认 ↵", correct: "正确！", wrong: "错误", skip: "⏭ 不会", stop: "✕ 停止", restart: "🔄",
    stopConfirm: "要停止测验并返回首页吗？",
    phaseA: "📖 阶段A", phaseB: "🔁 阶段B",
    wrongReveal: "❌ 错误 / 不会", correctAnswer: "正确答案", repeatNote: "📌 将再次出现在测验中",
    nextBtn: "下一个 →", reviewNote: "📌 将在复习中再次出现",
    reviewTime: "复习时间！", reviewDesc: "跳过或答错的单词共 ", reviewDesc2: "个，再来一次？",
    reviewStart: "开始复习 →", skipResult: "查看结果 📊",
    doneTitle: "测验完成！", restartBtn: "重新开始", changeTheme: "更换主题 ←",
    statsTitle: "📊 单词分析", statsDesc: "个单词已记录",
    goodGroup: "几乎都对", midGroup: "大约一半对", badGroup: "几乎都错",
    goodDesc: "75%以上", midDesc: "40~74%", badDesc: "39%以下", noWords: "没有符合条件的单词",
    loading: "加载中...", errorDesc: "请检查设置", retry: "重试",
    langSelect: "选择语言",
  },
  en: {
    title: "Quiz de Vocabulaire", subtitle: "Select topics to study",
    selectAll: "Select All", clearAll: "Clear All", selected: "Selected words", start: "Start Quiz →", words: " words",
    learnLabel: "Word", exampleLabel: "Example", learnBtn: "Got it! Take the quiz →", listenBtn: "🔈 Listen", listenAgain: "🔈 Listen again",
    question: "In French?", placeholder: "Type in French...", hint: "Answers without le/la/les/l' are accepted",
    confirm: "Check ↵", correct: "Correct!", wrong: "Wrong", skip: "⏭ Skip", stop: "✕ Quit", restart: "🔄",
    stopConfirm: "Stop the quiz and go back?",
    phaseA: "📖 Phase A", phaseB: "🔁 Phase B",
    wrongReveal: "❌ Wrong / Don't know", correctAnswer: "Answer", repeatNote: "📌 Will appear again in the quiz",
    nextBtn: "Next →", reviewNote: "📌 Will appear again in review",
    reviewTime: "Review Time!", reviewDesc: "You skipped or got wrong ", reviewDesc2: " words. Try again?",
    reviewStart: "Start Review →", skipResult: "See Results 📊",
    doneTitle: "Quiz Complete!", restartBtn: "Restart", changeTheme: "Change Topics ←",
    statsTitle: "📊 Word Analysis", statsDesc: " words recorded",
    goodGroup: "Almost always correct", midGroup: "About half correct", badGroup: "Almost always wrong",
    goodDesc: "75%+", midDesc: "40–74%", badDesc: "≤39%", noWords: "No words",
    loading: "Loading...", errorDesc: "Check your Sheet ID or sharing settings.", retry: "Retry",
    langSelect: "Language",
  },
};

const THEME_GROUPS = {
  ko: [
    { label: "🩺 신체 & 건강", themes: ["Le corps et la santé"] },
    { label: "👤 인생 & 개인생활", themes: ["La vie personnelle"] },
    { label: "🎭 문화 & 여가", themes: ["La culture et les loisirs"] },
    { label: "🧠 기억 & 감각", themes: ["La mémoire et les sens"] },
    { label: "🌿 환경", themes: ["L'environnement"] },
    { label: "🛍 소비", themes: ["La consommation"] },
    { label: "🏠 주거", themes: ["Le logement"] },
    { label: "🍽 음식 & 요리", themes: ["Les aliments"] },
  ],
  ja: [
    { label: "🩺 身体・健康", themes: ["Le corps et la santé"] },
    { label: "👤 人生・個人生活", themes: ["La vie personnelle"] },
    { label: "🎭 文化・余暇", themes: ["La culture et les loisirs"] },
    { label: "🧠 記憶・感覚", themes: ["La mémoire et les sens"] },
    { label: "🌿 環境", themes: ["L'environnement"] },
    { label: "🛍 消費", themes: ["La consommation"] },
    { label: "🏠 住居", themes: ["Le logement"] },
    { label: "🍽 食べ物・料理", themes: ["Les aliments"] },
  ],
  zh: [
    { label: "🩺 身体与健康", themes: ["Le corps et la santé"] },
    { label: "👤 人生与个人生活", themes: ["La vie personnelle"] },
    { label: "🎭 文化与休闲", themes: ["La culture et les loisirs"] },
    { label: "🧠 记忆与感官", themes: ["La mémoire et les sens"] },
    { label: "🌿 环境", themes: ["L'environnement"] },
    { label: "🛍 消费", themes: ["La consommation"] },
    { label: "🏠 住宅", themes: ["Le logement"] },
    { label: "🍽 食物与烹饪", themes: ["Les aliments"] },
  ],
  en: [
    { label: "🩺 Body & Health", themes: ["Le corps et la santé"] },
    { label: "👤 Personal Life", themes: ["La vie personnelle"] },
    { label: "🎭 Culture & Leisure", themes: ["La culture et les loisirs"] },
    { label: "🧠 Memory & Senses", themes: ["La mémoire et les sens"] },
    { label: "🌿 Environment", themes: ["L'environnement"] },
    { label: "🛍 Consumption", themes: ["La consommation"] },
    { label: "🏠 Housing", themes: ["Le logement"] },
    { label: "🍽 Food & Cooking", themes: ["Les aliments"] },
  ],
};

// TTS
function speakFrench(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const trySpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find(v => v.lang === "fr-FR" && v.name.includes("Google")) || voices.find(v => v.lang === "fr-FR") || voices.find(v => v.lang.startsWith("fr"));
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "fr-FR"; utt.rate = 0.85;
    if (frVoice) utt.voice = frVoice;
    window.speechSynthesis.speak(utt);
  };
  if (window.speechSynthesis.getVoices().length === 0) window.speechSynthesis.onvoiceschanged = trySpeak;
  else trySpeak();
}

// 성공음
function playSuccess() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq; osc.type = "sine";
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.2);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.2);
    });
  } catch(e) {}
}

// 유틸
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
function getMeaning(word, lang) { return word[lang] || word.ko; }
function getExample(word, lang) { return word[`example_${lang}`] || word.example_ko; }

// 예문 빈칸
function maskExample(exampleFr, wordFr) {
  const base = wordFr.replace(/^(le |la |les |l'|un |une |se |s')/i, "").trim();
  const parts = base.split(" ");
  let result = exampleFr;
  parts.forEach(w => {
    if (w.length < 3) return;
    const root = w.length > 5 ? w.slice(0, -2) : w;
    const clean = root.replace(/[.*+?^${}()|[\]\\]/g, ".");
    result = result.replace(new RegExp(clean + "[a-zéèêëàâäîïôöùûüç]*", "gi"), "___");
  });
  return result;
}

// ── 언어 선택 ──────────────────────────────────────────
function LangPicker({ onSelect }) {
  const langs = [
    { code: "ko", label: "한국어", flag: "🇰🇷" },
    { code: "ja", label: "日本語", flag: "🇯🇵" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
    { code: "en", label: "English", flag: "🇺🇸" },
  ];
  return (
    <div style={outer}>
      <div style={{ ...card, textAlign: "center", maxWidth: 380 }}>
        {triBar}
        <div style={{ fontSize: 40, marginBottom: 10 }}>🇫🇷</div>
        <h2 style={{ color: C.blue, margin: "0 0 6px", fontSize: 22 }}>Quiz de Vocabulaire</h2>
        <p style={{ color: C.gray, fontSize: 14, marginBottom: 24 }}>언어를 선택하세요 / Select your language</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {langs.map(l => (
            <button key={l.code} onClick={() => onSelect(l.code)}
              style={{ ...primaryBtn, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontSize: 16, padding: 14 }}>
              <span style={{ fontSize: 22 }}>{l.flag}</span>{l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 결과 화면 ─────────────────────────────────────────
function StatsScreen({ stats, allWords, lang, onRestart, onBack }) {
  const t = UI[lang];
  const good = [], mid = [], bad = [];
  Object.entries(stats).forEach(([fr, s]) => {
    const word = allWords.find(w => w.fr === fr);
    if (!word) return;
    const g = getGroup(s.correct, s.total);
    const pct = Math.round((s.correct / s.total) * 100);
    const item = { ...word, pct };
    if (g === "good") good.push(item);
    else if (g === "mid") mid.push(item);
    else bad.push(item);
  });
  const groups = [
    { key: "good", label: t.goodGroup, emoji: "🟢", color: C.green, pale: C.greenPale, border: "#6ee7b7", items: good, desc: t.goodDesc },
    { key: "mid", label: t.midGroup, emoji: "🟡", color: "#d97706", pale: "#fffbeb", border: "#fcd34d", items: mid, desc: t.midDesc },
    { key: "bad", label: t.badGroup, emoji: "🔴", color: C.red, pale: C.redPale, border: "#fca5a5", items: bad, desc: t.badDesc },
  ];
  const [open, setOpen] = useState({ good: true, mid: true, bad: true });
  return (
    <div style={outer}>
      <div style={{ ...card, maxWidth: 520, padding: 24 }}>
        {triBar}
        <h2 style={{ color: C.blue, textAlign: "center", margin: "0 0 6px", fontSize: 20 }}>{t.statsTitle}</h2>
        <p style={{ color: C.gray, textAlign: "center", fontSize: 13, marginBottom: 20 }}>{Object.keys(stats).length}{t.statsDesc}</p>
        {groups.map(g => (
          <div key={g.key} style={{ marginBottom: 12, border: `2px solid ${g.border}`, borderRadius: 14, overflow: "hidden" }}>
            <div onClick={() => setOpen(o => ({ ...o, [g.key]: !o[g.key] }))}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: g.pale, cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span>{g.emoji}</span>
                <span style={{ fontWeight: 700, fontSize: 13, color: g.color }}>{g.label}</span>
                <span style={{ fontSize: 11, color: g.color, opacity: 0.7 }}>({g.desc})</span>
              </div>
              <span style={{ background: g.color, color: C.white, borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>
                {g.items.length}{lang === "ko" ? "개" : ""} {open[g.key] ? "▲" : "▼"}
              </span>
            </div>
            {open[g.key] && g.items.length > 0 && (
              <div style={{ background: C.white, padding: "6px 12px" }}>
                {g.items.map((w, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 4px", borderBottom: i < g.items.length - 1 ? `1px solid ${C.grayBorder}` : "none" }}>
                    <div>
                      <span style={{ fontWeight: 600, color: C.blue, fontSize: 13 }}>{w.fr}</span>
                      <span style={{ color: C.gray, fontSize: 12, marginLeft: 8 }}>{getMeaning(w, lang)}</span>
                    </div>
                    <span style={{ background: g.pale, color: g.color, borderRadius: 20, padding: "2px 8px", fontSize: 12, fontWeight: 700 }}>{w.pct}%</span>
                  </div>
                ))}
              </div>
            )}
            {open[g.key] && g.items.length === 0 && (
              <div style={{ padding: "10px 14px", color: C.gray, fontSize: 13, textAlign: "center" }}>{t.noWords}</div>
            )}
          </div>
        ))}
        <button onClick={onRestart} style={primaryBtn}>{t.restartBtn}</button>
        <button onClick={onBack} style={{ ...primaryBtn, background: C.grayLight, color: C.gray, marginTop: 8 }}>{t.changeTheme}</button>
      </div>
    </div>
  );
}

// ── 주제 선택 ─────────────────────────────────────────
function ThemePicker({ allWords, lang, onStart, onChangeLang }) {
  const t = UI[lang];
  const groups = THEME_GROUPS[lang];
  const allThemes = Array.from(new Set(allWords.map(w => w.theme)));
  const [selected, setSelected] = useState(new Set());

  const toggleGroup = themes => {
    const allOn = themes.every(th => selected.has(th));
    setSelected(prev => { const s = new Set(prev); themes.forEach(th => allOn ? s.delete(th) : s.add(th)); return s; });
  };
  const count = allWords.filter(w => selected.has(w.theme)).length;
  const knownThemes = groups.flatMap(g => g.themes);
  const extraThemes = allThemes.filter(th => !knownThemes.includes(th));
  const displayGroups = extraThemes.length > 0 ? [...groups, { label: "➕ Extra", themes: extraThemes }] : groups;

  return (
    <div style={outer}>
      <div style={{ ...card, maxWidth: 520 }}>
        {triBar}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 26 }}>🇫🇷</div>
            <h2 style={{ margin: "4px 0 2px", color: C.blue, fontSize: 20, fontWeight: 700 }}>{t.title}</h2>
            <p style={{ color: C.gray, margin: 0, fontSize: 13 }}>{t.subtitle}</p>
          </div>
          <button onClick={onChangeLang} style={{ background: C.blueLight, color: C.blue, border: "none", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            🌐 {t.langSelect}
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 12 }}>
          <button onClick={() => setSelected(new Set(allThemes))} style={{ background: C.blueLight, color: C.blue, border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{t.selectAll}</button>
          <button onClick={() => setSelected(new Set())} style={{ background: C.grayLight, color: C.gray, border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{t.clearAll}</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 380, overflowY: "auto" }}>
          {displayGroups.map(g => {
            const allOn = g.themes.every(th => selected.has(th));
            const someOn = g.themes.some(th => selected.has(th));
            const wc = allWords.filter(w => g.themes.includes(w.theme)).length;
            return (
              <div key={g.label} onClick={() => toggleGroup(g.themes)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 12, border: `2px solid ${allOn ? C.blue : someOn ? "#93a8d8" : C.grayBorder}`, background: allOn ? C.blue : someOn ? C.blueLight : C.grayLight, cursor: "pointer" }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: allOn ? C.white : C.blue }}>{g.label}</span>
                <span style={{ fontSize: 12, color: allOn ? "rgba(255,255,255,0.85)" : C.blue, fontWeight: 600 }}>{allOn ? "✓" : someOn ? "…" : "○"} {wc}{t.words}</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 14, padding: "10px 16px", background: C.blueLight, borderRadius: 12, textAlign: "center", color: C.blue, fontWeight: 600, fontSize: 14 }}>
          {t.selected}: <b style={{ fontSize: 18 }}>{count}</b>
        </div>
        <button onClick={() => count > 0 && onStart(selected)} style={{ ...primaryBtn, marginTop: 12, opacity: count === 0 ? 0.4 : 1, cursor: count === 0 ? "not-allowed" : "pointer" }}>{t.start}</button>
      </div>
    </div>
  );
}

// ── 퀴즈 ─────────────────────────────────────────────
function Quiz({ allWords, selectedThemes, lang, onBack }) {
  const t = UI[lang];
  const initDeck = () => shuffle(allWords.filter(w => selectedThemes.has(w.theme)));

  const [deck, setDeck] = useState(() => initDeck());
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState("learn"); // "learn" | "quiz" | "reveal"
  const [phase, setPhase] = useState("A"); // "A" | "B" | "done"
  const [input, setInput] = useState("");
  const [status, setStatus] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [wrongWords, setWrongWords] = useState([]);
  const [bDeck, setBDeck] = useState([]);
  const [bIdx, setBIdx] = useState(0);
  const [bWrong, setBWrong] = useState([]);
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
    setDeck(initDeck()); setIdx(0); setStep("learn"); setPhase("A");
    setInput(""); setStatus(null); setScore(0); setStreak(0);
    setWrongWords([]); setBDeck([]); setBIdx(0); setBWrong([]); setStats({});
  };

  // learn 단계 진입 시 자동 발음
  useEffect(() => {
    if (step === "learn") {
      const cur = phase === "A" ? deck[idx] : null;
      if (!cur) return;
      const t1 = setTimeout(() => speak(cur.fr), 400);
      const t2 = setTimeout(() => { if (cur.example_fr) speak(cur.example_fr); }, 1800);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [idx, step, phase]);

  const currentA = deck[idx];
  const currentB = bDeck[bIdx];
  const current = phase === "A" ? currentA : currentB;
  const pct = phase === "A"
    ? (deck.length ? Math.round((idx / deck.length) * 100) : 0)
    : (bDeck.length ? Math.round((bIdx / bDeck.length) * 100) : 0);
  const isB = phase === "B";

  // 단계A 다음
  const goNextA = () => {
    const nextIdx = idx + 1;
    if (nextIdx >= deck.length) {
      if (wrongWords.length > 0) {
        setBDeck(shuffle(wrongWords)); setBIdx(0); setBWrong([]);
        setStep("quiz"); setPhase("B"); setInput(""); setStatus(null);
      } else { setPhase("done"); }
    } else {
      setIdx(nextIdx); setStep("learn"); setInput(""); setStatus(null);
    }
  };

  // 단계B 다음
  const goNextB = () => {
    const nextIdx = bIdx + 1;
    if (nextIdx >= bDeck.length) {
      if (bWrong.length > 0) {
        setBDeck(shuffle(bWrong)); setBIdx(0); setBWrong([]);
        setStep("quiz"); setInput(""); setStatus(null);
      } else { setPhase("done"); }
    } else {
      setBIdx(nextIdx); setStep("quiz"); setInput(""); setStatus(null);
    }
  };

  const goNext = isB ? goNextB : goNextA;

  // 단계A 퀴즈
  const checkA = () => {
    if (!input.trim() || status) return;
    const correct = currentA.fr.split(" = ").some(opt => normalize(input) === normalize(opt));
    recordStat(currentA.fr, correct);
    if (correct) {
      setScore(s => s + 1); setStreak(s => s + 1); setStatus("correct");
      playSuccess();
      setTimeout(() => goNextA(), 900);
    } else {
      setStreak(0); setWrongWords(prev => [...prev, currentA]); setStatus("wrong");
      setTimeout(() => { setStep("reveal"); speak(currentA.fr); }, 400);
    }
  };

  // 단계B 퀴즈
  const checkB = () => {
    if (!input.trim() || status) return;
    const correct = currentB.fr.split(" = ").some(opt => normalize(input) === normalize(opt));
    recordStat(currentB.fr, correct);
    if (correct) {
      setScore(s => s + 1); setStreak(s => s + 1); setStatus("correct");
      playSuccess();
      setTimeout(() => goNextB(), 900);
    } else {
      setStreak(0); setBWrong(prev => [...prev, currentB]); setStatus("wrong");
      setTimeout(() => { setStep("reveal"); speak(currentB.fr); }, 400);
    }
  };

  const check = isB ? checkB : checkA;

  const skipWord = () => {
    if (status) return;
    if (isB) setBWrong(prev => [...prev, currentB]);
    else setWrongWords(prev => [...prev, currentA]);
    setStep("reveal");
    speak(current.fr);
  };

  if (phase === "done") return <StatsScreen stats={stats} allWords={allWords} lang={lang} onRestart={restart} onBack={onBack} />;

  // 공통 헤더
  const Header = () => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => { if (window.confirm(t.stopConfirm)) onBack(); }}
          style={{ background: C.grayLight, border: "none", color: C.gray, cursor: "pointer", fontSize: 13, fontWeight: 600, padding: "5px 10px", borderRadius: 8 }}>{t.stop}</button>
        <span style={{ background: isB ? "#fef3c7" : C.blueLight, color: isB ? "#92400e" : C.blue, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
          {isB ? `${t.phaseB} ${bIdx + 1}/${bDeck.length}` : `${t.phaseA} ${idx + 1}/${deck.length}`}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => setMuted(m => !m)} style={{ background: "none", border: "none", fontSize: 16, cursor: "pointer" }}>{muted ? "🔇" : "🔊"}</button>
        <span style={{ background: C.bluePale, color: C.blue, borderRadius: 20, padding: "4px 10px", fontSize: 13, fontWeight: 700 }}>🔥{streak} ✅{score}</span>
      </div>
    </div>
  );

  const ProgressBar = () => (
    <div style={{ background: C.grayLight, borderRadius: 8, height: 8, marginBottom: 18, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, background: isB ? "#f59e0b" : C.blue, height: "100%", borderRadius: 8, transition: "width 0.4s" }} />
    </div>
  );

  // 단계A 학습
  if (phase === "A" && step === "learn") return (
    <div style={outer}>
      <div style={{ ...card, borderTop: `4px solid ${C.blue}` }}>
        <Header /><ProgressBar />
        <div style={{ background: C.bluePale, border: `1.5px solid #c5cfe8`, borderRadius: 16, padding: 24, textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: C.gray, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{t.learnLabel}</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: C.blue, marginBottom: 4 }}>{current?.fr}</div>
          <div style={{ fontSize: 18, color: C.textMid, marginBottom: 14 }}>{getMeaning(current, lang)}</div>
          <button onClick={() => { speak(current?.fr); setTimeout(() => { if (current?.example_fr) speak(current.example_fr); }, 1400); }}
            style={{ background: C.blueLight, border: "none", borderRadius: 20, padding: "6px 16px", fontSize: 13, cursor: "pointer", color: C.blue, fontWeight: 600 }}>
            {t.listenBtn}
          </button>
        </div>
        {current?.example_fr && (
          <div style={{ background: "#f8faff", border: `1px solid #c5cfe8`, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: C.blue, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{t.exampleLabel}</div>
            <div style={{ fontSize: 14, color: C.blue, fontStyle: "italic", marginBottom: 4 }}>{current.example_fr}</div>
            <div style={{ fontSize: 13, color: C.gray }}>{getExample(current, lang)}</div>
          </div>
        )}
        <button onClick={() => { setStep("quiz"); setInput(""); setStatus(null); }} style={primaryBtn}>{t.learnBtn}</button>
      </div>
    </div>
  );

  // 정답 공개 (A·B 공통)
  if (step === "reveal") return (
    <div style={outer}>
      <div style={{ ...card, borderTop: `4px solid ${C.red}` }}>
        <Header /><ProgressBar />
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <span style={{ background: C.redPale, color: C.red, borderRadius: 20, padding: "5px 16px", fontSize: 13, fontWeight: 700 }}>{t.wrongReveal}</span>
        </div>
        <div style={{ background: C.bluePale, border: `1.5px solid #c5cfe8`, borderRadius: 16, padding: 24, textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: C.gray, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{t.correctAnswer}</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: C.blue, marginBottom: 4 }}>{current?.fr}</div>
          <div style={{ fontSize: 16, color: C.textMid, marginBottom: 14 }}>{getMeaning(current, lang)}</div>
          <button onClick={() => { speakFrench(current?.fr); setTimeout(() => { if (current?.example_fr) speakFrench(current.example_fr); }, 1400); }}
            style={{ background: C.blueLight, border: "none", borderRadius: 20, padding: "6px 16px", fontSize: 13, cursor: "pointer", color: C.blue, fontWeight: 600 }}>
            {t.listenAgain}
          </button>
        </div>
        {current?.example_fr && (
          <div style={{ background: "#f8faff", border: `1px solid #c5cfe8`, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: C.blue, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{t.exampleLabel}</div>
            <div style={{ fontSize: 14, color: C.blue, fontStyle: "italic", marginBottom: 4 }}>{current.example_fr}</div>
            <div style={{ fontSize: 13, color: C.gray }}>{getExample(current, lang)}</div>
          </div>
        )}
        <div style={{ textAlign: "center", color: C.gray, fontSize: 13, marginBottom: 14 }}>{isB ? t.repeatNote : t.reviewNote}</div>
        <button onClick={goNext} style={primaryBtn}>{t.nextBtn}</button>
      </div>
    </div>
  );

  // 퀴즈 (A·B 공통)
  const inputBorder = status === "correct" ? "#10b981" : status === "wrong" ? C.red : C.grayBorder;
  const inputBg = status === "correct" ? C.greenPale : status === "wrong" ? C.redPale : C.white;

  return (
    <div style={outer}>
      <div style={{ ...card, borderTop: `4px solid ${isB ? "#f59e0b" : C.blue}` }}>
        <Header /><ProgressBar />
        <div style={{ background: C.bluePale, border: `1.5px solid #c5cfe8`, borderRadius: 16, padding: "18px 20px", textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: C.gray, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{t.question}</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.blue, marginBottom: 12 }}>{getMeaning(current, lang)}</div>
          {current?.example_fr && (
            <div style={{ borderTop: `1px solid #c5cfe8`, paddingTop: 10 }}>
              <div style={{ fontSize: 13, color: C.blue, fontStyle: "italic", marginBottom: 3 }}>
                {maskExample(current.example_fr, current.fr)}
              </div>
              <div style={{ fontSize: 12, color: C.gray }}>{getExample(current, lang)}</div>
            </div>
          )}
        </div>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") check(); }}
          disabled={!!status} placeholder={t.placeholder}
          style={{ width: "100%", boxSizing: "border-box", padding: "14px 16px", border: `2px solid ${inputBorder}`, borderRadius: 12, fontSize: 17, outline: "none", background: inputBg, color: C.text, transition: "all 0.2s", fontFamily: font }}
          autoFocus
        />
        {status === "correct" && (
          <div style={{ marginTop: 10, padding: 12, borderRadius: 12, background: C.greenPale, textAlign: "center" }}>
            <span style={{ color: C.green, fontWeight: 700 }}>✅ {t.correct} <i>{current.fr}</i></span>
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button onClick={check} disabled={!!status} style={{ ...primaryBtn, flex: 1, padding: "13px", opacity: status ? 0.5 : 1 }}>{t.confirm}</button>
          <button onClick={skipWord} disabled={!!status}
            style={{ background: C.grayLight, color: C.gray, border: `2px solid ${C.grayBorder}`, borderRadius: 12, padding: "13px 14px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: font, opacity: status ? 0.5 : 1 }}>{t.skip}</button>
          <button onClick={restart}
            style={{ background: C.grayLight, color: C.gray, border: "none", borderRadius: 12, padding: "13px 14px", fontSize: 14, cursor: "pointer" }}>{t.restart}</button>
        </div>
      </div>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 12 }}>{t.hint}</p>
    </div>
  );
}

// ── 메인 ─────────────────────────────────────────────
export default function App() {
  const [words, setWords] = useState(null);
  const [error, setError] = useState(false);
  const [lang, setLang] = useState(null);
  const [selectedThemes, setSelectedThemes] = useState(null);

  useEffect(() => { fetchWords().then(setWords).catch(() => setError(true)); }, []);

  if (error) return (
    <div style={outer}>
      <div style={{ ...card, textAlign: "center" }}>
        <div style={{ fontSize: 44 }}>⚠️</div>
        <h2 style={{ color: C.red }}>Error</h2>
        <p style={{ color: C.gray }}>Please check your Google Sheet ID or sharing settings.</p>
        <button onClick={() => window.location.reload()} style={primaryBtn}>Retry</button>
      </div>
    </div>
  );

  if (!words) return (
    <div style={{ ...outer }}>
      <div style={{ fontSize: 44 }}>🇫🇷</div>
      <p style={{ color: "white", fontSize: 18, marginTop: 16, fontFamily: font }}>Loading...</p>
    </div>
  );

  if (!lang) return <LangPicker onSelect={setLang} />;
  if (!selectedThemes) return <ThemePicker allWords={words} lang={lang} onStart={t => setSelectedThemes(t)} onChangeLang={() => setLang(null)} />;
  return <Quiz allWords={words} selectedThemes={selectedThemes} lang={lang} onBack={() => setSelectedThemes(null)} />;
}