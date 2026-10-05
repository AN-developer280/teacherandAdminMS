/* Single source of truth. Persists to localStorage so admin/ and teacher/ pages share data. */
(function () {
  const {K} = IAFMP;
  const Store = {
    S: null,
    load() {
      let s = null;
      try { s = JSON.parse(localStorage.getItem(K.KEY)); } catch (e) {}
      if (s) { this.S = s; return s; }
      this.S = IAFMP.seed();
      IAFMP.Scheduler.gen("Ahmed Ali");
      IAFMP.Scheduler.gen("Sara Khan");
      this.save();
      return this.S;
    },
    save()  { try { localStorage.setItem(K.KEY, JSON.stringify(this.S)); } catch (e) {} },
    reset() { localStorage.removeItem(K.KEY); },
    sub:     id => Store.S.subs.find(s => s.id == id),
    teacher: n  => Store.S.teachers.find(t => t.n == n),
    mine:    n  => Store.S.subs.filter(s => s.t == n),
    notify:  (to, m) => Store.S.notes.unshift({to, m}),
    log:     m  => Store.S.audit.unshift(m)
  };
  IAFMP.Store = Store;
})();
