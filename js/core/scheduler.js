/* Timetable + syllabus plan logic (client-side stand-in for the OR-Tools service). */
(function () {
  const {K, Store} = IAFMP;
  const Scheduler = {
    // true if teacher t and the class (dept+semester of s) are both free at day d / slot sl
    free(t, s, d, sl, ignore) {
      return !Store.S.tt.some(x => {
        const xs = Store.sub(x.sub);
        return x !== ignore && x.d == d && x.sl == sl && (x.t == t || (xs.d == s.d && xs.sem == s.sem));
      });
    },
    // place every unscheduled subject of teacher t (one lecture per credit hour, spread over days)
    gen(t) {
      const S = Store.S, fail = [];
      S.subs.filter(s => s.t == t && !S.tt.some(x => x.sub == s.id)).forEach(s => {
        const used = [];
        for (let k = 0; k < s.ch; k++) {
          let best = null;
          for (let d = 0; d < 5; d++) {
            if (used.includes(d)) continue;
            const load = S.tt.filter(x => x.t == t && x.d == d).length;
            for (let sl = 0; sl < 4; sl++)
              if (this.free(t, s, d, sl)) { if (!best || load < best.load) best = {d, sl, load}; break; }
          }
          if (best) { S.tt.push({t, sub: s.id, d: best.d, sl: best.sl, pin: 0}); used.push(best.d); }
          else fail.push(s.n);
        }
        if (!S.plan[s.id]) S.plan[s.id] = K.OUTLINE.map(x => ({tp: s.n + ": " + x, s: "pending"}));
      });
      return fail;
    },
    // overall syllabus completion % for a teacher
    pct(t) {
      let done = 0, all = 0;
      Store.mine(t).forEach(s => (Store.S.plan[s.id] || []).forEach(l => { all++; if (l.s == "done") done++; }));
      return all ? Math.round(done * 100 / all) : 0;
    }
  };
  IAFMP.Scheduler = Scheduler;
})();
