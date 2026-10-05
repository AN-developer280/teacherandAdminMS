/* Teacher-side shared helpers. Pages register themselves on Teacher.pages. */
(function () {
  const {Store, UI} = IAFMP, {C} = UI;
  const Teacher = {
    me: "Areeba",                       // demo login; a real login would set this
    pages: {},
    mine: () => Store.mine(Teacher.me),
    none: () => `<div class="${C.warn}">No subjects yet. Choose them from Department first.</div>`,
    // subject dropdown used by Attendance and Diary
    subSel(app, list) {
      if (!list.some(s => s.id == app.ui.sel)) app.ui.sel = list[0].id;
      return `<p><select data-act="selSub" class="${C.input}">${list.map(s => `<option value="${s.id}" ${s.id == app.ui.sel ? "selected" : ""}>${UI.esc(s.n)} (${s.d} Sem ${s.sem})</option>`).join("")}</select></p>`;
    },
    actions: { selSub: (el, app) => { app.ui.sel = +el.value; app.ui.sum = null; app.ui.pres = []; } }
  };
  IAFMP.Teacher = Teacher;
})();
