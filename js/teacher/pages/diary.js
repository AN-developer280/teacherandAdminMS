/* Lecture diary: submit ticks the next pending topic; "missed" pushes the topic to the next slot. */
(function () {
  const {Store, UI, Teacher} = IAFMP, {C, esc} = UI;
  const TODAY = new Date().toISOString().slice(0, 10);
  const nextIdx = pl => pl.findIndex(x => x.s == "pending");
  Teacher.pages["Teacher Diary"] = {
    view(app) {
      const list = Teacher.mine().filter(s => Store.S.plan[s.id]);
      if (!list.length) return `<h2 class="${C.h2}">Teacher Diary</h2>` + Teacher.none();
      let h = `<h2 class="${C.h2}">Teacher Diary</h2>` + Teacher.subSel(app, list);
      const pl = Store.S.plan[app.ui.sel], i = nextIdx(pl);
      h += i < 0 ? `<div class="${C.card}">All lectures completed.</div>` :
        `<div class="${C.card}"><small class="${C.mu}">Lecture ${i + 1} of ${pl.length}</small><h3 class="font-semibold mb-2">Today's topic: ${esc(pl[i].tp)}</h3>
         <input id="hw" class="${C.input}" placeholder="Homework (optional)">
         <p class="mt-2"><button class="${C.btn}" data-act="submitDiary">Submit Diary</button> <button class="${C.ghost}" data-act="missLecture">Lecture missed</button></p>
         <small class="${C.mu}">The diary opens during the lecture only. On submit, the tracker ticks this topic.</small></div>`;
      return h + `<h3 class="${C.h3}">History</h3>` + (pl.filter(x => x.s == "done").map(x => `<div class="${C.card}">${x.dt} · ${esc(x.tp)}${x.hw ? " · HW: " + esc(x.hw) : ""}</div>`).join("") || `<p class="${C.mu}">No entries yet.</p>`);
    },
    actions: {
      submitDiary(el, app) {
        const pl = Store.S.plan[app.ui.sel], i = nextIdx(pl); if (i < 0) return false;
        Object.assign(pl[i], {s: "done", dt: TODAY, hw: (UI.$("#hw") || {}).value || ""});
        Store.notify("Admin", `${Teacher.me} submitted diary: ${pl[i].tp}`);
        UI.toast("Diary submitted. Topic marked Done");
      },
      missLecture(el, app) {
        const pl = Store.S.plan[app.ui.sel], i = nextIdx(pl); if (i < 0) return false;
        pl[i].s = "miss"; pl.splice(i + 1, 0, {tp: pl[i].tp, s: "pending"});
        Store.notify("Admin", `${Teacher.me} missed a lecture: outline shifted to next slot`);
        UI.toast("Marked missed. Topic moved to the next slot");
      }
    }
  };
})();
