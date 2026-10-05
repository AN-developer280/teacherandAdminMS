(function () {
  const {Store, UI, Admin} = IAFMP, {C, esc} = UI;
  Admin.pages["Audit Log"] = {
    view: () => `<h2 class="${C.h2}">Audit Log</h2>` + (Store.S.audit.map(a => `<div class="${C.card}">${esc(a)}</div>`).join("") || `<p class="${C.mu}">No actions yet.</p>`)
  };
})();
