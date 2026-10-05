/* Admin entry point. Page order here = menu order. */
(function () {
  const {Store, UI, Admin} = IAFMP;
  Store.load();
  const order = ["Dashboard","Teachers","Subject Assignment","Timetable","Live Classes","Requests & Leaves","Announcements","Audit Log"];
  const pages = {}; order.forEach(n => pages[n] = Admin.pages[n]);
  UI.createApp({pages, home: () => "Dashboard", subtitle: "Admin"});
})();
