const SHEET_ID = "1-RVydMSNjFLiZ2T2nJHFTzqMWakx-fvHqug_vkSi8Hk";
const SHEET_NAME = "Sheet1";

export async function fetchWords() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;
  const res = await fetch(url);
  const text = await res.text();

  const rows = text.trim().split("\n").slice(1);
  return rows
    .map(row => {
      const cols = [];
      let cur = "", inQuote = false;
      for (const ch of row) {
        if (ch === '"') inQuote = !inQuote;
        else if (ch === ',' && !inQuote) { cols.push(cur.trim()); cur = ""; }
        else cur += ch;
      }
      cols.push(cur.trim());
      const [fr, ko, ja, zh, en, theme, example_fr, example_ko, example_ja, example_zh, example_en] = cols;
      return { fr, ko, ja, zh, en, theme, example_fr, example_ko, example_ja, example_zh, example_en };
    })
    .filter(w => w.fr && w.theme);
}