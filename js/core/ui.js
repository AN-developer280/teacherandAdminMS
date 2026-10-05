/* Shared UI helpers, Tailwind class presets, and the tiny app shell (nav + event delegation). */
(function () {
  const {K, Store} = IAFMP;
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

  // Reusable Tailwind class strings: change the look of the whole app here.
  const C = {
    card:  "bg-white border border-slate-200 rounded-xl p-3 mb-2.5",
    btn:   "bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3.5 py-1.5",
    ghost: "border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg px-3.5 py-1.5",
    red:   "bg-red-600 hover:bg-red-700 text-white rounded-lg px-3.5 py-1.5",
    input: "border border-slate-300 rounded-lg px-2 py-1.5 bg-white max-w-full",
    mu:    "text-slate-500",
    h2:    "text-xl font-semibold text-blue-900 mb-3",
    h3:    "font-semibold mt-4 mb-2",
    th:    "border border-slate-200 bg-blue-50 p-2 text-left",
    td:    "border border-slate-200 p-2 align-top",
    warn:  "bg-amber-100 text-amber-900 rounded-lg p-2.5 mb-3"
  };

  const UI = {
    $, esc, C,
    toast(m) {
      const t = $("#toast"); t.textContent = m; t.classList.remove("hidden");
      clearTimeout(UI._h); UI._h = setTimeout(() => t.classList.add("hidden"), 2800);
    },
    stat: (l, v) => `<div class="${C.card} flex-1 min-w-[120px] flex flex-col"><b class="text-2xl text-blue-900">${v}</b><span class="${C.mu}">${l}</span></div>`,
    chip: (t, c = "") => `<span class="inline-block px-2 rounded-full text-xs ${c=="ok"?"bg-green-100 text-green-700":c=="er"?"bg-red-100 text-red-700":"bg-blue-50 text-blue-900"}">${esc(t)}</span>`,
    bar:  p => `<div class="h-2 rounded bg-slate-200 overflow-hidden"><i class="block h-full bg-green-600" style="width:${p}%"></i></div>`,
    opts: (a, v) => a.map(x => `<option ${x == v ? "selected" : ""}>${esc(x)}</option>`).join(""),
    idxOpts: (a, v) => a.map((x, i) => `<option value="${i}" ${i == v ? "selected" : ""}>${x}</option>`).join(""),
    // weekly grid for one teacher; editable => cells carry data-act="editSlot"
    grid(t, editable) {
      let h = `<div class="overflow-x-auto"><table class="w-full bg-white border-collapse"><tr><th class="${C.th}"></th>${K.DAYS.map(d => `<th class="${C.th}">${d}</th>`).join("")}</tr>`;
      for (let sl = 0; sl < 4; sl++) {
        h += `<tr><th class="${C.th}">${K.SLOTS[sl]}</th>`;
        for (let d = 0; d < 5; d++) {
          const e = Store.S.tt.find(x => x.t == t && x.d == d && x.sl == sl), s = e && Store.sub(e.sub);
          h += `<td class="${C.td} min-w-[110px] h-14 ${e && editable ? "cursor-pointer hover:bg-blue-50" : ""}" ${e && editable ? `data-act="editSlot" data-i="${Store.S.tt.indexOf(e)}"` : ""}>` +
               (e ? `<b>${esc(s.n)}</b><br><small class="${C.mu}">${s.d} · Sem ${s.sem}${e.pin ? " · Pinned" : ""}</small>` : "") + "</td>";
        }
        h += "</tr>";
      }
      return h + `</table></div><p class="${C.mu}">4 lectures per day; a short break falls between lectures 2 and 3.</p>`;
    },

    /* createApp: renders sidebar + current page, routes [data-act] clicks/changes to page actions.
       pages = { "Page name": { view(app) => html, actions: { name(el, app) } } }
       An action may return false to skip the re-render. State is saved after every action. */
    createApp({pages, home, subtitle, guard, actions = {}}) {
      document.body.insertAdjacentHTML("beforeend", '<div id="toast" class="hidden fixed left-1/2 bottom-5 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-lg z-50"></div>');
      const root = $("#app"), app = {page: home(), ui: {}, actions: Object.assign({}, actions)};
      Object.values(pages).forEach(p => Object.assign(app.actions, p.actions || {}));
      app.actions.go = el => { app.page = el.dataset.p; app.ui.ed = -1; };
      app.render = () => {
        const g = guard && guard(app);
        if (g) { root.innerHTML = g; return; }
        root.innerHTML = `<div class="flex flex-col md:flex-row min-h-screen">
          <nav class="md:w-52 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0">
            <div class="hidden md:block px-2 mb-3"><h1 class="font-bold text-blue-900">IAFMP</h1><small class="${C.mu}">${esc(subtitle)}</small></div>
            ${Object.keys(pages).map(n => `<a data-act="go" data-p="${esc(n)}" class="px-3 py-2 rounded-lg cursor-pointer whitespace-nowrap ${n == app.page ? "bg-blue-600 text-white" : "hover:bg-blue-50"}">${esc(n)}</a>`).join("")}
            <a href="../index.html" class="px-3 py-2 rounded-lg hover:bg-blue-50 whitespace-nowrap md:mt-auto">Logout</a>
          </nav>
          <main class="flex-1 p-4 md:p-5 min-w-0">${pages[app.page].view(app)}</main></div>`;
      };
      const handle = ev => {
        const el = ev.target.closest("[data-act]"); if (!el) return;
        const isField = /^(SELECT|INPUT)$/.test(el.tagName);
        if (isField !== (ev.type == "change")) return;   // fields act on change, everything else on click
        const fn = app.actions[el.dataset.act];
        if (fn && fn(el, app) !== false) { Store.save(); app.render(); }
      };
      document.addEventListener("click", handle);
      document.addEventListener("change", handle);
      window.addEventListener("storage", e => { if (e.key == K.KEY) { Store.load(); app.render(); } }); // other tab changed data
      app.render();
      return app;
    }
  };
  IAFMP.UI = UI;
})();
