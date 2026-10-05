(function () {
  const {Store, UI, Teacher} = IAFMP, {C, esc} = UI;
  Teacher.pages["Leave & Request"] = {
    view: () => `<h2 class="${C.h2}">Leave &amp; Request</h2>
      <div class="${C.card}"><select id="rt" class="${C.input}">${UI.opts(["Leave","Class resource","Student leave issue","Timetable change"])}</select>
      <input id="rx" class="${C.input} w-1/2" placeholder="Details"> <button class="${C.btn}" data-act="sendReq">Send</button></div>` +
      (Store.S.reqs.filter(r => r.t == Teacher.me).map(r => `<div class="${C.card}">${r.type}: ${esc(r.txt)} ${UI.chip(r.s, r.s == "Approved" ? "ok" : r.s == "Rejected" ? "er" : "")}</div>`).join("") || `<p class="${C.mu}">No requests yet.</p>`),
    actions: {
      sendReq() {
        const type = UI.$("#rt").value, txt = UI.$("#rx").value.trim();
        if (!txt) { UI.toast("Please write the details"); return false; }
        Store.S.reqs.unshift({id: Date.now(), t: Teacher.me, type, txt, s: "Pending"});
        Store.notify("Admin", `New ${type} from ${Teacher.me}`);
        UI.toast("Sent to admin");
      }
    }
  };
})();
