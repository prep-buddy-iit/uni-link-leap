// Update these dates each year. All dates use local time (midnight).
// Format: YYYY-MM-DD
export const JEE_SESSION_1_DATE = "2027-01-24"; // JEE Main Session 1 (Jan)
export const JEE_SESSION_1_LABEL = "Session 1";

export const JEE_SESSION_2_DATE = "2027-04-02"; // JEE Main Session 2 (Apr)
export const JEE_SESSION_2_LABEL = "Session 2";

export const NEET_UG_DATE = "2027-05-02"; // NEET UG (first Sunday of May)
export const NEET_UG_YEAR = 2027;

export type ExamTarget = { date: string; label: string };

export function nextJeeSession(now: Date = new Date()): ExamTarget | null {
  const candidates: ExamTarget[] = [
    { date: JEE_SESSION_1_DATE, label: JEE_SESSION_1_LABEL },
    { date: JEE_SESSION_2_DATE, label: JEE_SESSION_2_LABEL },
  ];
  const today = startOfLocalDay(now);
  const upcoming = candidates
    .map((c) => ({ ...c, d: parseLocalDate(c.date) }))
    .filter((c) => c.d.getTime() >= today.getTime())
    .sort((a, b) => a.d.getTime() - b.d.getTime());
  return upcoming[0] ?? null;
}

export function nextNeetExam(now: Date = new Date()): ExamTarget | null {
  const today = startOfLocalDay(now);
  const d = parseLocalDate(NEET_UG_DATE);
  if (d.getTime() < today.getTime()) return null;
  return { date: NEET_UG_DATE, label: String(NEET_UG_YEAR) };
}

export function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function daysUntil(iso: string, now: Date = new Date()): number {
  const target = parseLocalDate(iso);
  const today = startOfLocalDay(now);
  const ms = target.getTime() - today.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}
