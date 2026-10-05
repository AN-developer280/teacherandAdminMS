/* Admin can reassign any subject; the old timetable slots are removed and the new teacher's are generated. */
(function () {
  const {Store, UI, Admin, Scheduler} = IAFMP, {C, esc} = UI;
  Admin.pages["Subject Assignment"] = {
    view: () => `<h2 class="${C.h2}">Subject Assignment</h2><div class="overflow-x-auto"><table class="w-full bg-white border-collapse"><tr>${["Subject","Dept","Sem","Teacher"].map(h => `<th class="${C.th}">${h}</th>`).join("")}</tr>` +
      Store.S.subs.map(s => `<tr><td class="${C.td}">${esc(s.n)}</td><td class="${C.td}">${s.d}</td><td class="${C.td}">${s.sem}</td>
        <td class="${C.td}"><select class="${C.input}" data-act="reassign" data-id="${s.id}"><option value="">Unassigned</option>${UI.opts(Store.S.teachers.map(t => t.n), s.t)}</select></td></tr>`).join("") + "</table></div>",
    actions: {
      reassign(el) {
        const s = Store.sub(el.dataset.id), t = el.value;
        Store.S.tt = Store.S.tt.filter(x => x.sub != s.id);
        s.t = t || undefined;
        if (t) { Scheduler.gen(t); Store.notify(t, `Admin assigned you ${s.n}`); }
        Store.log(`Reassigned ${s.n} to ${t || "nobody"}`);
      }
    }
  };
})();
