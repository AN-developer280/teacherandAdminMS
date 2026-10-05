/* Register teachers; Force Logout / Suspend (the teacher app reacts to these immediately). */
(function () {
  const {Store, UI, Admin} = IAFMP, {C, esc} = UI;
  Admin.pages["Teachers"] = {
    view: () => `<h2 class="${C.h2}">Teachers</h2>
      <div class="${C.card}"><input id="nt" class="${C.input}" placeholder="New teacher name"> <button class="${C.btn}" data-act="register">Register</button></div>
      <div class="overflow-x-auto"><table class="w-full bg-white border-collapse"><tr>${["Name","Status","Subjects (dept, semester)","CH","Devices","Control"].map(h => `<th class="${C.th}">${h}</th>`).join("")}</tr>` +
      Store.S.teachers.map((t, i) => {
        const l = Store.mine(t.n);
        return `<tr><td class="${C.td}">${esc(t.n)}</td><td class="${C.td}">${UI.chip(t.s, t.s == "Active" ? "ok" : "er")}</td>
          <td class="${C.td}">${l.map(s => `${s.d} S${s.sem}: ${esc(s.n)}`).join("<br>") || `<span class="${C.mu}">Not selected</span>`}</td>
          <td class="${C.td}">${l.reduce((a, s) => a + s.ch, 0)}</td><td class="${C.td}">${t.dev}</td>
          <td class="${C.td}"><button class="${C.ghost}" data-act="forceLogout" data-i="${i}">Force logout</button> <button class="${C.red}" data-act="toggleSuspend" data-i="${i}">${t.s == "Active" ? "Suspend" : "Activate"}</button></td></tr>`;
      }).join("") + "</table></div>",
    actions: {
      register() {
        const v = UI.$("#nt").value.trim(); if (!v) return false;
        Store.S.teachers.push({n: v, s: "Active", dev: 0, done: 0});
        Store.log("Registered " + v); UI.toast("Activation link sent to " + v);
      },
      forceLogout(el) { const t = Store.S.teachers[+el.dataset.i]; t.dev = 0; Store.log("Force logout: " + t.n); UI.toast("Logged out from all devices"); },
      toggleSuspend(el) {
        const t = Store.S.teachers[+el.dataset.i];
        t.s = t.s == "Active" ? "Suspended" : "Active"; if (t.s == "Suspended") t.dev = 0;
        Store.log(t.s + ": " + t.n);
      }
    }
  };
})();
