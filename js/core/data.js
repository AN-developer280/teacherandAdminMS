/* Constants + demo seed data. Replace seed() with API calls when a backend exists. */
window.IAFMP = {};
IAFMP.K = {
  KEY: "iafmp_state_v1",
  MAX_CH: 12,
  DAYS: ["Mon","Tue","Wed","Thu","Fri"],
  SLOTS: ["2:00–2:40","2:40–3:20","3:40–4:20","4:20–5:00"],
  OUTLINE: ["Introduction","Core Concepts","Methods I","Methods II","Midterm Revision","Advanced Topics","Case Study","Final Revision"],
  STUDENTS: ["Ayesha","Bilal","Chand","Dania","Emaan","Farhan","Gul","Hira","Imran","Jawad"]
};
IAFMP.seed = () => ({
  depts: ["CS","IT","English","Math"],
  subs: [
    {id:1,d:"CS",sem:1,n:"Programming Fundamentals",ch:3},
    {id:2,d:"CS",sem:1,n:"Calculus",ch:3},
    {id:3,d:"CS",sem:2,n:"Networking",ch:3},
    {id:4,d:"CS",sem:2,n:"Discrete Mathematics",ch:3,t:"Ahmed Ali"},
    {id:5,d:"CS",sem:3,n:"Data Structures",ch:3},
    {id:6,d:"IT",sem:3,n:"Databases",ch:3},
    {id:7,d:"IT",sem:1,n:"Web Technologies",ch:3},
    {id:8,d:"English",sem:1,n:"Functional English",ch:3,t:"Sara Khan"},
    {id:9,d:"Math",sem:2,n:"Linear Algebra",ch:3}
  ],
  teachers: [
    {n:"Areeba",s:"Active",dev:1,done:0},
    {n:"Ahmed Ali",s:"Active",dev:2,done:1},
    {n:"Sara Khan",s:"Active",dev:1,done:1}
  ],
  tt: [], plan: {}, reqs: [], notes: [], audit: [],
  ann: [{t:"Welcome",m:"Please select your subjects before the 15th.",a:"All"}]
});
