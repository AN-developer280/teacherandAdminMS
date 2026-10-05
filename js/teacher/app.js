/* Teacher entry point. Page order here = menu order. Also enforces admin Force Logout / Suspend. */
(function () {
  const {Store, UI, Teacher} = IAFMP, {C} = UI;
  Store.load();
  const order = ["Home","Department","Timetable","Syllabus Tracker","Attendance","Teacher Diary","Leave & Request","Announcements","Notifications"];
  const pages = {}; order.forEach(n => pages[n] = Teacher.pages[n]);
  const box = (msg, btn = "") => `<div class="max-w-sm mx-auto mt-[12vh] text-center"><h2 class="${C.h2}">${msg}</h2>${btn}</div>`;

  UI.createApp({
    pages, subtitle: Teacher.me,
    home: () => Store.teacher(Teacher.me).done ? "Home" : "Department",
    guard() {
      const t = Store.teacher(Teacher.me);
      if (t.s != "Active") return box("Your account is suspended. Contact the administration.");
      if (!t.dev) return box("Your session was ended by the administration.", `<button class="${C.btn}" data-act="relogin">Log in again</button>`);
    },
    actions: { ...Teacher.actions, relogin: () => { Store.teacher(Teacher.me).dev = 1; } }
  });
})();
