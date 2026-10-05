(function () {
  const {Store, UI, Teacher, K} = IAFMP, {C, esc} = UI;
  const WD = (d => d > 4 ? 0 : d)((new Date().getDay() + 6) % 7);   // today's weekday index (weekend -> Mon)
  Teacher.pages["Home"] = {
    view() {
      const me = Teacher.me, t = Store.teacher(me);
      const today = Store.S.tt.filter(x => x.t == me && x.d == WD).sort((a, b) => a.sl - b.sl);
      return `<h2 class="${C.h2}">Welcome, ${esc(me)}</h2>
        ${t.done ? "" : `<div class="${C.warn}">You have not selected subjects yet. <a class="text-blue-600 cursor-pointer underline" data-act="go" data-p="Department">Go to Department</a></div>`}
        <div class="flex gap-2.5 flex-wrap">${UI.stat("Subjects", Teacher.mine().length)}${UI.stat("Lectures / week", Store.S.tt.filter(x => x.t == me).length)}${UI.stat("Syllabus done", IAFMP.Scheduler.pct(me) + "%")}</div>
        <h3 class="${C.h3}">Today (${K.DAYS[WD]})</h3>` +
        (today.length ? today.map(e => { const s = Store.sub(e.sub); return `<div class="${C.card}"><b>${K.SLOTS[e.sl]}</b> · ${esc(s.n)} <span class="${C.mu}">${s.d} Sem ${s.sem}</span></div>`; }).join("") : `<p class="${C.mu}">No classes today.</p>`);
    }
  };
})();
