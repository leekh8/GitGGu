![header](https://capsule-render.vercel.app/api?type=waving&color=auto&height=120&section=header&text=GitGGu&fontSize=70)

# GitGGu — GitHub Decoration Editor

> A web editor that turns plain Markdown into a decorated GitHub profile / README — point-and-click instead of hand-writing badge URLs and layout.

## Why

Dressing up a GitHub profile or repo README means hand-assembling capsule-render banners, shields.io badges, stat cards, and table layouts by hand — tedious and easy to get wrong. GitGGu makes that **accessible to everyone** through a friendly editor: compose visually, get clean Markdown out.

## Status

🔵 **Prototype** — frontend-first. The React editor with **live Markdown preview**, a widget gallery (banners / badges / stat cards), and copy-to-clipboard is working; the backend / persistence layer below is planned, not yet wired.

## Stack

**Implemented (`frontend/`)**
- React 18, React Router 6, styled-components
- **Vite 5** (migrated from CRA on 2026-07-13), Vitest + Testing Library

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

- [x] Live Markdown preview alongside the editor
- [x] Template / widget gallery (capsule-render banners, shields badges, stat cards)
- [x] Copy-to-clipboard of the generated Markdown
- [ ] Export / download the generated Markdown as a file
- [ ] Wire the planned backend for saving & sharing layouts

## Changelog

### 2026-07-13 — CRA → Vite 현대화
- 빌드/개발 서버 `react-scripts` → **Vite 5**, 테스트 러너 → **Vitest**
- JSX 포함 파일 9개를 `.jsx`로 정리, `public/index.html` → 루트 `index.html`, `reportWebVitals`·`web-vitals` 제거
- README 상태 동기화(라이브 프리뷰·위젯·복사는 이미 구현됨). 검증: 빌드·테스트 통과 + dev 서버 라이브 렌더 확인

---
![footer](https://capsule-render.vercel.app/api?type=waving&color=auto&height=120&section=footer)
