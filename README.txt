1000 CREATIVE WEB PROJECTS
==========================

WHAT THIS IS
1000 independent front-end concepts. Each folder under projects/ is a complete,
standalone mini-site with its own specialty, layout, visual system and working
interface. No framework, no build step, no dependencies.

EACH PROJECT CONTAINS
  index.html   structure, copy and image references
  style.css    the full design system for that project
  app.js       the project's interface logic (local only)

HOW TO RUN
1. Unzip the archive.
2. Open index.html at the top level — it is a searchable launchpad for all 1000.
3. Or open any projects/<nnnn-name>/index.html directly in a browser.

DESIGN NOTES
- Photography loads from picsum.photos over the network, so projects look best
  online. Fonts come from Google Fonts; system fallbacks keep type readable if
  there is no connection.
- There is no animation and no transition anywhere. Layout, colour, typography
  and image treatment do the work.
- 22 visual systems are distributed across the 1000 projects (Swiss editorial,
  brutalist, aurora, Y2K, art deco, blueprint, cyber HUD, pastel, zine, and so on).
- 5 hero compositions and 3 collection layouts are rotated, plus 31 different
  interactive modules, so neighbouring projects do not repeat.
- Forms, chat, calculators and lists run entirely in the page. Nothing is sent
  anywhere and nothing is stored beyond the session.

CUSTOMISING
Open style.css and change the custom properties at the top (--bg, --ink,
--accent, --font-head). Every rule in the file reads from those tokens, so one
edit re-skins the whole project.
