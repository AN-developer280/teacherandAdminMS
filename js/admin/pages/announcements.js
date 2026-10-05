(function () {
  const {Store, UI, Admin} = IAFMP, {C, esc} = UI;
  Admin.pages["Announcements"] = {
    view: () => `<h2 class="${C.h2}">Announcements</h2>
      <div class="${C.card}"><input id="at" class="${C.input}" placeholder="Title"> <input id="am" class="${C.input} w-2/5" placeholder="Message"> <select id="aa" class="${C.input}">${UI.opts(["All", ...Store.S.depts])}</select> <button class="${C.btn}" data-act="sendAnn">Send</button></div>` +
      Store.S.ann.map(a => `<div class="${C.card}"><b>${esc(a.t)}</b> ${UI.chip(a.a)}<br>${esc(a.m)}</div>`).join(""),
    actions: {
      sendAnn() {
        const t = UI.$("#at").value.trim(), m = UI.$("#am").value.trim();
        if (!t || !m) { UI.toast("Title and message required"); return false; }
        Store.S.ann.unshift({t, m, a: UI.$("#aa").value});
        Store.S.teachers.forEach(x => Store.notify(x.n, "New announcement: " + t));
        Store.log("Announcement: " + t);
      }
    }
  };
})();
