![header](https://capsule-render.vercel.app/api?type=waving&color=auto&height=120&section=header&text=GitGGu&fontSize=70)

# GitGGu — GitHub Decoration Editor

> A web editor that turns plain Markdown into a decorated GitHub profile / README — point-and-click instead of hand-writing badge URLs and layout.

## Why

Dressing up a GitHub profile or repo README means hand-assembling capsule-render banners, shields.io badges, stat cards, and table layouts by hand — tedious and easy to get wrong. GitGGu makes that **accessible to everyone** through a friendly editor: compose visually, get clean Markdown out.

## Status

🔵 **Prototype** — frontend-first. Last active 2024-11.
The React editor UI (Editor / MainPage / Header / Logo components) is in place; the backend / persistence layer below is planned, not yet wired.

## Stack

**Implemented (`frontend/`)**
- React 18, React Router 6, styled-components
- create-react-app (react-scripts), Jest + Testing Library

**Planned**
- Backend: Node.js · Express · GraphQL
- DB: MongoDB / Mongoose
- Markdown parsing: marked.js
- Deploy: Docker · Nginx · GCP

## Structure

```
frontend/   React editor (components, pages, assets)
docs/        design notes
```

## Roadmap

- [ ] Live Markdown preview alongside the editor
- [ ] Template / widget gallery (capsule-render banners, shields badges, stat cards)
- [ ] Copy-to-clipboard / export of the generated Markdown
- [ ] Wire the planned backend for saving & sharing layouts

---
![footer](https://capsule-render.vercel.app/api?type=waving&color=auto&height=120&section=footer)
