/* Pick a class (dept + semester) and a day/slot to see who is teaching what. */
(function () {
  const {Store, UI, Admin, K} = IAFMP, {C, esc} = UI;
  Admin.pages["Live Classes"] = {
    view(app) {
      const L = app.ui.lv = app.ui.lv || {d: "CS", sem: 2, day: 0, sl: 0};
      const e = Store.S.tt.find(x => { const s = Store.sub(x.sub); return x.d == L.day && x.sl == L.sl && s.d == L.d && s.sem == L.sem; }), s = e && Store.sub(e.sub);
      const sel = (k, inner) => `<select class="${C.input}" data-act="lvSet" data-k="${k}">${inner}</select> `;
      return `<h2 class="${C.h2}">Live Classes</h2><div class="${C.card}">${sel("d", UI.opts(Store.S.depts, L.d))}${sel("sem", [1,2,3,4,5,6,7,8].map(n => `<option ${n == L.sem ? "selected" : ""}>${n}</option>`).join(""))}${sel("day", UI.idxOpts(K.DAYS, L.day))}${sel("sl", UI.idxOpts(K.SLOTS, L.sl))}</div>` +
        (e ? `<div class="${C.card}"><b>${esc(s.n)}</b><br>Teacher: ${esc(e.t)}<br>${K.SLOTS[e.sl]} · ${L.d} Semester ${L.sem}</div>` : `<div class="${C.card}">Class is free at this time.</div>`);
    },
    actions: { lvSet: (el, app) => { app.ui.lv[el.dataset.k] = el.dataset.k == "d" ? el.value : +el.value; } }
  };
})();
