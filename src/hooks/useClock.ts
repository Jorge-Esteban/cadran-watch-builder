import { useEffect, useState } from 'react';

/** Hora local actualizada a 6 Hz: imita el barrido de un calibre a 21 600 A/h. */
export function useClock(live = true) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setNow(new Date()), 1000 / 6);
    return () => window.clearInterval(id);
  }, [live]);

  if (!live) return { h: 10, m: 9, s: 36 }; // pose clásica de catálogo 10:10
  const s = now.getSeconds() + Math.floor(now.getMilliseconds() / (1000 / 6)) / 6;
  const m = now.getMinutes() + s / 60;
  const h = (now.getHours() % 12) + m / 60;
  return { h, m, s };
}
