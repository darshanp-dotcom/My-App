export function yyyymmdd(d = new Date()) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return Number(`${yyyy}${mm}${dd}`);
}

export function formatDateLabel(dateNum: number) {
  const s = String(dateNum);
  if (s.length !== 8) return s;
  const yyyy = s.slice(0, 4);
  const mm = s.slice(4, 6);
  const dd = s.slice(6, 8);
  return `${mm}/${dd}/${yyyy}`;
}

