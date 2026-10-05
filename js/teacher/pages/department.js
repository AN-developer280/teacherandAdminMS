/* Subject selection: department cards -> semester-wise checkboxes -> Done (locks subjects, generates timetable + tracker). */
(function () {
  const {Store, UI, Teacher, K, Scheduler} = IAFMP, {C, esc} = UI;
  Teacher.pages["Department"] = {
    view(app) {
      const S = Store.S, me = Teacher.me, u = app.ui, pick = u.pick = u.pick || [];
      if (!u.dept) {
        return `<h2 class="${C.h2}">Welcome, ${esc(me)}</h2><p class="${C.mu}">Choose a department</p><div class="flex gap-2.5 flex-wrap">` +
          S.depts.map(d => {
            const avail = S.subs.filter(s => s.d == d && !s.t).length, yours = S.subs.filter(s => s.d == d && s.t == me).length;
            return `<div class="${C.card} w-40 cursor-pointer hover:border-blue-500" data-act="openDept" data-d="${d}"><b>${d}</b><br><span class="${C.mu}">${avail} available</span> ${yours ? UI.chip(yours + " selected") : ""}</div>`;
          }).join("") + "</div>";
      }
      let h = `<a class="text-blue-600 cursor-pointer" data-act="openDept" data-d="">← Departments</a><h2 class="${C.h2}">${esc(u.dept)} Department</h2>`;
      for (let n = 1; n <= 8; n++) {
        const list = S.subs.filter(s => s.d == u.dept && s.sem == n); if (!list.length) continue;
        h += `<h3 class="${C.h3}">Semester ${n}</h3>` + list.map(s => {
          const taken = s.t && s.t != me, mine = s.t == me;
          return `<label class="flex items-center gap-2 p-2 border border-slate-200 rounded-lg mb-1.5 bg-white ${taken ? "opacity-60" : ""}">
            <input type="checkbox" data-act="pick" data-id="${s.id}" ${taken || mine ? "disabled" : ""} ${mine || pick.includes(s.id) ? "checked" : ""}>
            <span class="flex-1">${esc(s.n)} <small class="${C.mu}">${s.ch} CH</small></span>
            <span class="${C.mu}">${taken ? "Taken by " + esc(s.t) : mine ? "Yours" : "Available"}</span></label>`;
        }).join("");
      }
      return h + `<p class="${C.mu}">Workload limit: ${K.MAX_CH} credit hours.</p><button class="${C.btn}" data-act="done">Done (${pick.length} selected)</button>`;
    },
    actions: {
      openDept: (el, app) => { app.ui.dept = el.dataset.d; },
      pick(el, app) {
        const id = +el.dataset.id, u = app.ui; u.pick = u.pick || [];
        if (el.checked) {
          const total = Teacher.mine().reduce((a, x) => a + x.ch, 0) + u.pick.reduce((a, i) => a + Store.sub(i).ch, 0) + Store.sub(id).ch;
          if (total > K.MAX_CH) { UI.toast(`Workload limit: maximum ${K.MAX_CH} credit hours`); return; }
          u.pick.push(id);
        } else u.pick = u.pick.filter(i => i != id);
      },
      done(el, app) {
        const me = Teacher.me, pick = app.ui.pick || [];
        if (!pick.length) { UI.toast("Select at least one subject"); return false; }
        pick.forEach(i => { const s = Store.sub(i); if (!s.t) s.t = me; });   // first come, first served: never overwrite
        Store.teacher(me).done = 1;
        const fail = Scheduler.gen(me);
        Store.notify(me, "Your timetable and Syllabus Tracker are ready");
        Store.notify("Admin", `${me} selected ${pick.length} subject(s). Timetable ${fail.length ? "has a problem" : "generated"}.`);
        Store.log(`${me} confirmed ${pick.length} subject(s)`);
        app.ui.pick = []; app.ui.dept = ""; app.page = "Timetable";
        UI.toast(fail.length ? "Some lectures could not be placed" : "Timetable and Syllabus Tracker generated");
      }
    }
  };
})();
