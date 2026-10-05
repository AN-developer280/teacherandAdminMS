/* Present / Leave / Absent with a confirmation step; unmarked students default to Absent. */
(function () {
  const {UI, Teacher, K} = IAFMP, {C, esc} = UI;
  Teacher.pages["Attendance"] = {
    view(app) {
      const list = Teacher.mine(), u = app.ui; u.pres = u.pres || [];
      if (!list.length) return `<h2 class="${C.h2}">Attendance</h2>` + Teacher.none();
      let h = `<h2 class="${C.h2}">Attendance</h2>` + Teacher.subSel(app, list) +
        `<div class="${C.card}"><b>On leave</b> (approved earlier)<br>Ayesha: fever · Bilal: family event</div>
         <div class="${C.card}"><b>Mark present</b> (the rest become Absent automatically)` +
        K.STUDENTS.slice(2).map((n, i) => `<label class="flex items-center gap-2 p-2 border border-slate-200 rounded-lg mt-1.5"><input type="checkbox" data-act="togglePres" data-i="${i}" ${u.pres.includes(i) ? "checked" : ""}><span>${esc(n)}</span></label>`).join("") + "</div>";
      return h + (u.sum
        ? `<div class="${C.card}"><b>Confirm:</b> ${u.sum} <button class="${C.btn}" data-act="attConfirm">Confirm</button> <button class="${C.ghost}" data-act="attEdit">Edit</button></div>`
        : `<button class="${C.btn}" data-act="attSubmit">Submit</button>`);
    },
    actions: {
      togglePres(el, app) { const i = +el.dataset.i; app.ui.pres = el.checked ? [...app.ui.pres, i] : app.ui.pres.filter(x => x != i); return false; },
      attSubmit: (el, app) => { const p = app.ui.pres.length; app.ui.sum = `${p} Present, 2 Leave, ${K.STUDENTS.length - 2 - p} Absent`; },
      attConfirm: (el, app) => { app.ui.sum = null; UI.toast("Attendance saved"); },
      attEdit: (el, app) => { app.ui.sum = null; }
    }
  };
})();
