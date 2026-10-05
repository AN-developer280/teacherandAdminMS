(function () {
  const {UI, Teacher} = IAFMP;
  Teacher.pages["Timetable"] = {
    view: () => `<h2 class="${UI.C.h2}">My Timetable</h2>` + (Teacher.mine().length ? UI.grid(Teacher.me) : Teacher.none())
  };
})();
