(function () {
  const {Store, UI, Admin} = IAFMP, {C, esc} = UI;
  Admin.pages["Dashboard"] = {
    view() {
      const S = Store.S, assigned = S.subs.filter(s => s.t).length, pend = S.reqs.filter(r => r.s == "Pending").length;
      return `<h2 class="${C.h2}">Admin Dashboard</h2><div class="flex gap-2.5 flex-wrap">${UI.stat("Teachers", S.teachers.length)}${UI.stat("Departments", S.depts.length)}${UI.stat("Subjects", S.subs.length)}${UI.stat("Assigned", assigned)}${UI.stat("Pending requests", pend)}</div>
        <h3 class="${C.h3}">Department-wise assignment</h3>` +
        S.depts.map(d => { const l = S.subs.filter(s => s.d == d), a = l.filter(s => s.t).length; return `<div class="${C.card}">${d} <span class="${C.mu}">${a}/${l.length}</span>${UI.bar(a * 100 / l.length)}</div>`; }).join("") +
        `<h3 class="${C.h3}">Alerts</h3>` + (S.teachers.filter(t => !t.done).map(t => `<div class="${C.card}">${esc(t.n)} has not selected subjects yet</div>`).join("") || `<p class="${C.mu}">No alerts.</p>`) +
        `<h3 class="${C.h3}">Notifications</h3>` + (S.notes.filter(n => n.to == "Admin").slice(0, 6).map(n => `<div class="${C.card}">${esc(n.m)}</div>`).join("") || `<p class="${C.mu}">Nothing yet.</p>`);
    }
  };
})();
