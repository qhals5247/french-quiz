const SHEET_ID = "1-RVydMSNjFLiZ2T2nJHFTzqMWakx-fvHqug_vkSi8Hk";
const SHEET_NAME = "Sheet1";

export async function fetchWords() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;
  const res = await fetch(url);
  const text = await res.text();

  const rows = text.trim().split("\n").slice(1); // 헤더 제외
  return rows
    .map(row => {
      // 쉼표로 분리 (따옴표 안의 쉼표는 무시)
      const cols = [];
      let cur = "", inQuote = false;
      for (const ch of row) {
        if (ch === '"') inQuote = !inQuote;
        else if (ch === ',' && !inQuote) { cols.push(cur.trim()); cur = ""; }
        else cur += ch;
      }
      cols.push(cur.trim());
      const [fr, ko, theme] = cols;
      return { fr, ko, theme };
    })
    .filter(w => w.fr && w.ko && w.theme);
}