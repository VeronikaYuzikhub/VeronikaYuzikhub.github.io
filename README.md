# Veronika Yuzik - Portfolio

TypeScript + Vite + Three.js portfolio website.

## Project structure

```
portfolio/
├── index.html                  - HTML shell (no content - JS renders everything)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.ts                 - Entry point - boots everything
    │
    ├── types/
    │   └── index.ts            - All TypeScript interfaces
    │
    ├── data/
    │   └── index.ts            - ALL CONTENT IS HERE - edit to update site
    │
    ├── styles/
    │   ├── variables.css       - Design tokens (colors, fonts, radius)
    │   ├── global.css          - Reset, layout, shared components
    │   └── components.css      - Per-component styles
    │
    ├── utils/
    │   ├── cursor.ts           - Custom cursor with lagging ring
    │   ├── theme.ts            - Light/dark toggle + localStorage
    │   └── router.ts           - SPA navigation (no page reloads)
    │
    ├── scenes/
    │   ├── background.ts       - Three.js: low-poly shapes + particle cloud
    │   └── loading.ts          - Canvas: flower bloom loading animation
    │
    └── components/
        ├── Nav.ts              - Top nav pills + side slide-out menu
        ├── Lightbox.ts         - Full-screen gallery viewer
        ├── Footer.ts           - Shared footer
        └── pages/
            ├── HomePage.ts         - Hero + featured project preview
            ├── WorksPage.ts        - Projects with stacked photos + expand
            ├── RoadmapPage.ts      - Career timeline
            ├── SkillsPage.ts       - Tech stack + languages
            ├── CertificatesPage.ts - Certificates grid
            └── AboutPage.ts        - Bio + contact info
```

## Setup

```bash
# 1. Open the portfolio folder in VS Code

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Open http://localhost:5173
```

## How to edit content

**All content** (projects, skills, roadmap, certificates) lives in one file:

```
src/data/index.ts
```

Edit that file - the site updates automatically.

## Adding a new project

In `src/data/index.ts`, add an object to the `PROJECTS` array:

```ts
{
  id: 'my-project',
  index: '004',
  title: 'My',
  titleAccent: 'Project',
  role: 'Full-Stack · TypeScript',
  shortDesc: 'Short description shown on the card.',
  fullDesc: 'Full description shown when expanded. Can be long.',
  stack: ['TypeScript', 'React', 'PostgreSQL'],
  images: [
    { src: '', alt: 'Screenshot 1' },   // replace src with real image path
    { src: '', alt: 'Screenshot 2' },
  ],
  githubUrl: 'https://github.com/...',
}
```

## Replacing emoji placeholders with real images

In `WorksPage.ts`, the `stack-photo` div renders `img.src` as text (emoji).
Replace with `<img src="${img.src}" alt="${img.alt}" />` once you have real screenshots.

## Build for production

```bash
npm run build
# Output goes to /dist - upload to any static host (Vercel, Netlify, GitHub Pages)
```
