(function () {
  const {Store, UI, Teacher} = IAFMP, {C, esc} = UI;
  Teacher.pages["Syllabus Tracker"] = {
    view() {
      const list = Teacher.mine().filter(s => Store.S.plan[s.id]);
      return `<h2 class="${C.h2}">Syllabus Tracker</h2>` + (list.length ? list.map(s => {
        const pl = Store.S.plan[s.id], done = pl.filter(x => x.s == "done").length, next = pl.findIndex(x => x.s == "pending");
        return `<div class="${C.card}"><b>${esc(s.n)}</b> <span class="${C.mu}">${s.d} Sem ${s.sem}</span> ${UI.chip(done + "/" + pl.length)}${UI.bar(done * 100 / pl.length)}` +
          pl.map((l, i) => `<div>${i + 1}. ${esc(l.tp)} ${l.s == "done" ? UI.chip("Done " + l.dt, "ok") : l.s == "miss" ? UI.chip("Missed", "er") : i == next ? UI.chip("Next") : `<span class="${C.mu}">Upcoming</span>`}</div>`).join("") + "</div>";
      }).join("") : Teacher.none());
    }
  };
})();
