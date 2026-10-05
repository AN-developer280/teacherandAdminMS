(function () {
  const {Store, UI, Teacher} = IAFMP, {C, esc} = UI;
  Teacher.pages["Announcements"] = {
    view: () => `<h2 class="${C.h2}">Announcements</h2>` +
      Store.S.ann.map(a => `<div class="${C.card}"><b>${esc(a.t)}</b> ${UI.chip(a.a)}<br>${esc(a.m)}</div>`).join("")
  };
})();
