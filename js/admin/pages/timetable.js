/* View/edit any teacher's timetable. Saves are conflict-checked, pinned, and notify the teacher. */
(function () {
  const {Store, UI, Admin, Scheduler, K} = IAFMP, {C, esc} = UI;
  Admin.pages["Timetable"] = {
    view(app) {
      const u = app.ui, names = Store.S.teachers.map(t => t.n);
      if (!u.asel) u.asel = "Ahmed Ali";
      let h = `<h2 class="${C.h2}">Timetable</h2><p class="mb-2"><select class="${C.input}" data-act="pickTeacher">${UI.opts(names, u.asel)}</select></p>` + UI.grid(u.asel, true);
      if (u.ed >= 0 && Store.S.tt[u.ed]) {
        const e = Store.S.tt[u.ed], s = Store.sub(e.sub);
        h += `<div class="${C.card}"><b>Edit: ${esc(s.n)}</b> <select id="ed" class="${C.input}">${UI.idxOpts(K.DAYS, e.d)}</select> <select id="es" class="${C.input}">${UI.idxOpts(K.SLOTS, e.sl)}</select>
          <button class="${C.btn}" data-act="saveSlot">Save</button> <button class="${C.ghost}" data-act="cancelEdit">Cancel</button><br>
          <small class="${C.mu}">Conflicts are blocked. Saved slots become Pinned and the teacher is notified.</small></div>`;
      } else h += `<p class="${C.mu}">Click a lecture to edit it.</p>`;
      return h;
    },
    actions: {
      pickTeacher: (el, app) => { app.ui.asel = el.value; app.ui.ed = -1; },
      editSlot: (el, app) => { app.ui.ed = +el.dataset.i; },
      cancelEdit: (el, app) => { app.ui.ed = -1; },
      saveSlot(el, app) {
        const e = Store.S.tt[app.ui.ed], d = +UI.$("#ed").value, sl = +UI.$("#es").value;
        if (!Scheduler.free(e.t, Store.sub(e.sub), d, sl, e)) { UI.toast("Conflict: the teacher or class is busy at that time"); return false; }
        Object.assign(e, {d, sl, pin: 1});
        Store.notify(e.t, `Admin moved ${Store.sub(e.sub).n} to ${K.DAYS[d]} ${K.SLOTS[sl]}`);
        Store.log(`Edited timetable of ${e.t}`);
        app.ui.ed = -1; UI.toast("Saved and pinned");
      }
    }
  };
})();
