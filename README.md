# IAFMP Portal (HTML + Tailwind + JS)

Open `index.html` in a browser (internet needed once for the Tailwind CDN). No build step, no server.

```
index.html              role chooser + "Reset demo data"
admin/index.html        admin app    (loads core + js/admin)
teacher/index.html      teacher app  (loads core + js/teacher)
css/styles.css          small custom CSS
js/core/                shared by both sides
  data.js               constants + seed data
  store.js              state + localStorage (shared between admin and teacher pages)
  scheduler.js          timetable generation, conflict check, syllabus %
  ui.js                 Tailwind class presets (C), helpers, app shell + event routing
js/admin/pages/*.js     one file per admin menu item
js/teacher/pages/*.js   one file per teacher menu item
```

## How to change things
- **Add a page**: create `js/<side>/pages/x.js` registering `Side.pages["Name"] = {view(app), actions}`, add its `<script>` tag to that side's `index.html`, and add the name to `order` in `js/<side>/app.js`.
- **Buttons**: use `data-act="actionName"` in the HTML; define `actionName(el, app)` in the same page's `actions`. The page re-renders and saves automatically (return `false` to skip).
- **Look and feel**: edit the `C` class presets in `js/core/ui.js`.
- **Real backend later**: replace `Store.load/save` and `IAFMP.seed` with API calls; the pages don't need to change much.
