(function () {
  const {Store, UI, Admin} = IAFMP, {C, esc} = UI;
  Admin.pages["Requests & Leaves"] = {
    view: () => `<h2 class="${C.h2}">Requests &amp; Leaves</h2>` + (Store.S.reqs.map(r => {
      let sub = "";
      if (r.type == "Leave" && r.s == "Pending") {   // substitute suggestion: least-loaded active teacher
        const o = Store.S.teachers.filter(t => t.n != r.t && t.s == "Active").sort((a, b) => Store.S.tt.filter(x => x.t == a.n).length - Store.S.tt.filter(x => x.t == b.n).length)[0];
        if (o) sub = `<br><small class="${C.mu}">Suggested substitute: ${esc(o.n)}</small>`;
      }
      return `<div class="${C.card}"><b>${esc(r.t)}</b> · ${r.type}: ${esc(r.txt)} ${UI.chip(r.s, r.s == "Approved" ? "ok" : r.s == "Rejected" ? "er" : "")}${sub}` +
        (r.s == "Pending" ? `<br><button class="${C.btn}" data-act="decide" data-id="${r.id}" data-s="Approved">Approve</button> <button class="${C.red}" data-act="decide" data-id="${r.id}" data-s="Rejected">Reject</button>` : "") + "</div>";
    }).join("") || `<p class="${C.mu}">No requests yet.</p>`),
    actions: {
      decide(el) {
        const r = Store.S.reqs.find(x => x.id == el.dataset.id); r.s = el.dataset.s;
        Store.notify(r.t, `Your ${r.type} was ${r.s}`); Store.log(`${r.s} ${r.type} of ${r.t}`);
      }
    }
  };
})();
