(function () {
  const {Store, UI, Teacher} = IAFMP, {C, esc} = UI;
  Teacher.pages["Notifications"] = {
    view: () => `<h2 class="${C.h2}">Notifications</h2>` +
      (Store.S.notes.filter(n => n.to == Teacher.me).map(n => `<div class="${C.card}">${esc(n.m)}</div>`).join("") || `<p class="${C.mu}">Nothing yet.</p>`)
  };
})();
