import { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { markdownToHtml } from "../../utils/markdown";

const WIDGETS = [
  {
    label: "🌊 배너",
    md: "![header](https://capsule-render.vercel.app/api?type=waving&color=auto&height=200&section=header&text=YOUR_NAME&fontSize=70)",
  },
  {
    label: "🏷 배지",
    md: "![Badge](https://img.shields.io/badge/label-message-blue)",
  },
  {
    label: "📊 Stats",
    md: "![Stats](https://github-readme-stats.vercel.app/api?username=YOUR_ID&show_icons=true&theme=default)",
  },
  {
    label: "🔥 Streak",
    md: "![Streak](https://github-readme-streak-stats.herokuapp.com/?user=YOUR_ID)",
  },
  {
    label: "🧑‍💻 Top Langs",
    md: "![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=YOUR_ID&layout=compact)",
  },
  {
    label: "📈 Activity",
    md: "![Activity](https://github-readme-activity-graph.vercel.app/graph?username=YOUR_ID&theme=github-compact)",
  },
  {
    label: "🏆 Trophies",
    md: "![Trophies](https://github-profile-trophy.vercel.app/?username=YOUR_ID&row=1)",
  },
];

const FORMATS = [
  { label: "H1", block: "# 제목" },
  { label: "H2", block: "## 제목" },
  { label: "B", wrap: ["**", "**", "굵게"] },
  { label: "I", wrap: ["*", "*", "기울임"] },
  { label: "‹›", wrap: ["`", "`", "코드"] },
  { label: "• 목록", block: "- 항목" },
  { label: "🔗", wrap: ["[", "](https://)", "텍스트"] },
];

const SECTIONS = [
  { label: "🧑 About", block: "## 🙋 About Me\n\n> 한 줄 소개를 작성하세요.\n\n- 🔭 현재 작업 중: **PROJECT**\n- 🌱 배우는 중: **SKILL**\n- 📫 연락처: **EMAIL**" },
  { label: "🛠 Stack", block: "## 🛠 Tech Stack\n\n![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)\n![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)\n![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)" },
  { label: "📌 Projects", block: "## 📌 Projects\n\n| 이름 | 설명 | 기술 |\n|---|---|---|\n| [PROJECT](https://github.com/YOUR_ID/PROJECT) | 설명 | React |\n" },
  { label: "📝 Blog", block: "## 📝 Latest Blog Posts\n\n<!-- BLOG-POST-LIST:START -->\n<!-- BLOG-POST-LIST:END -->" },
];

const DEFAULT_MD = `# 👋 Hi, I'm YOUR_NAME

![header](https://capsule-render.vercel.app/api?type=waving&color=auto&height=200&section=header&text=YOUR_NAME&fontSize=70)

## 🛠 Tech Stack

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 📊 GitHub Stats

![Stats](https://github-readme-stats.vercel.app/api?username=YOUR_ID&show_icons=true)
`;

const MD_KEY = "gitggu-markdown";
const USER_KEY = "gitggu-user";

export default function Editor() {
  const [md, setMd] = useState(() => localStorage.getItem(MD_KEY) ?? DEFAULT_MD);
  const [user, setUser] = useState(() => localStorage.getItem(USER_KEY) ?? "");
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState("edit"); // "edit" | "preview" (모바일 전용)
  const taRef = useRef(null);

  useEffect(() => localStorage.setItem(MD_KEY, md), [md]);
  useEffect(() => localStorage.setItem(USER_KEY, user), [user]);

  const fillUser = (s) =>
    user ? s.replaceAll("YOUR_ID", user).replaceAll("YOUR_NAME", user) : s;

  const insertBlock = (snippet) => {
    const ta = taRef.current;
    const pos = ta ? ta.selectionStart : md.length;
    const before = md.slice(0, pos);
    const after = md.slice(pos);
    const lead = before && !before.endsWith("\n") ? "\n" : "";
    const tail = after.startsWith("\n") || after === "" ? "" : "\n";
    const chunk = lead + snippet + "\n" + tail;
    const next = before + chunk + after;
    setMd(next);
    const caret = (before + chunk).length;
    requestAnimationFrame(() => {
      ta?.focus();
      ta?.setSelectionRange(caret, caret);
    });
  };

  const applyWrap = (beforeM, afterM, placeholder) => {
    const ta = taRef.current;
    const s = ta ? ta.selectionStart : md.length;
    const e = ta ? ta.selectionEnd : md.length;
    const selected = md.slice(s, e) || placeholder;
    const next = md.slice(0, s) + beforeM + selected + afterM + md.slice(e);
    setMd(next);
    const selStart = s + beforeM.length;
    requestAnimationFrame(() => {
      ta?.focus();
      ta?.setSelectionRange(selStart, selStart + selected.length);
    });
  };

  // Tab 키 → 들여쓰기(공백 2개), Shift+Tab → 줄 앞 공백 제거
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key !== "Tab") return;
      e.preventDefault();
      const ta = e.target;
      const s = ta.selectionStart;
      const e2 = ta.selectionEnd;
      if (e.shiftKey) {
        // 앞 공백 2개 제거
        const lineStart = md.lastIndexOf("\n", s - 1) + 1;
        const beforeLine = md.slice(0, lineStart);
        const line = md.slice(lineStart);
        if (line.startsWith("  ")) {
          const next = beforeLine + line.slice(2);
          setMd(next);
          requestAnimationFrame(() => ta.setSelectionRange(Math.max(s - 2, lineStart), Math.max(e2 - 2, lineStart)));
        }
      } else {
        const next = md.slice(0, s) + "  " + md.slice(e2);
        setMd(next);
        requestAnimationFrame(() => ta.setSelectionRange(s + 2, s + 2));
      }
    },
    [md]
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const download = () => {
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    if (window.confirm("현재 내용이 사라집니다. 기본 템플릿으로 초기화할까요?")) {
      const tmpl = fillUser(DEFAULT_MD);
      setMd(tmpl);
    }
  };

  return (
    <Wrap>
      <TitleBar>
        <h1>GitGGu</h1>
        <span>GitHub 프로필 · README 에디터</span>
        <UserField>
          <span>@</span>
          <input
            value={user}
            onChange={(e) => setUser(e.target.value.trim())}
            placeholder="GitHub 아이디"
            aria-label="GitHub username"
            spellCheck={false}
          />
        </UserField>
      </TitleBar>

      <Toolbar>
        <Group>
          {FORMATS.map((f) => (
            <Btn key={f.label} onClick={() => f.wrap ? applyWrap(...f.wrap) : insertBlock(f.block)}>
              {f.label}
            </Btn>
          ))}
        </Group>
        <Divider />
        <Group style={{ flexWrap: "wrap" }}>
          {WIDGETS.map((w) => (
            <Btn key={w.label} onClick={() => insertBlock(fillUser(w.md))}>{w.label}</Btn>
          ))}
        </Group>
        <Divider />
        <Group>
          {SECTIONS.map((s) => (
            <Btn key={s.label} onClick={() => insertBlock(fillUser(s.block))}>{s.label}</Btn>
          ))}
        </Group>
        <Right>
          <Btn onClick={reset} title="기본 템플릿으로 초기화">↺</Btn>
          <Btn onClick={download} title="README.md 저장">⬇ 저장</Btn>
          <CopyBtn onClick={copy}>{copied ? "복사됨 ✓" : "📋 복사"}</CopyBtn>
        </Right>
      </Toolbar>

      {/* 모바일용 탭 */}
      <TabBar>
        <TabBtn $active={tab === "edit"} onClick={() => setTab("edit")}>편집</TabBtn>
        <TabBtn $active={tab === "preview"} onClick={() => setTab("preview")}>미리보기</TabBtn>
      </TabBar>

      <Panes>
        <EditArea
          ref={taRef}
          value={md}
          onChange={(e) => setMd(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          aria-label="markdown editor"
          $hidden={tab === "preview"}
        />
        <Preview
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(md) }}
          $hidden={tab === "edit"}
        />
      </Panes>
    </Wrap>
  );
}

/* ── Styled Components ── */

const Wrap = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: var(--gh-fg-default);
`;

const TitleBar = styled.header`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  h1 { margin: 0; font-size: 28px; color: var(--gh-fg-emphasis); }
  span { color: var(--gh-fg-muted); font-size: 14px; }
`;

const UserField = styled.label`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid var(--gh-border-default);
  border-radius: 6px;
  padding: 4px 8px;
  background: var(--gh-canvas-default);
  span { color: var(--gh-fg-muted); font-weight: 600; }
  input { border: none; outline: none; font-size: 13px; width: 110px; }
  &:focus-within { border-color: var(--gh-accent-fg); box-shadow: 0 0 0 2px var(--gh-accent-ring); }
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border: 1px solid var(--gh-border-default);
  border-radius: 8px 8px 0 0;
  background: var(--gh-canvas-subtle);
`;

const Group = styled.div`display: flex; gap: 4px;`;
const Right = styled.div`margin-left: auto; display: flex; gap: 4px;`;
const Divider = styled.div`width: 1px; align-self: stretch; background: var(--gh-border-default); margin: 0 4px;`;

const Btn = styled.button`
  border: 1px solid var(--gh-border-default);
  background: var(--gh-canvas-default);
  border-radius: 6px;
  padding: 5px 10px;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  &:hover { background: var(--gh-canvas-hover); }
  &:focus-visible { outline: 2px solid var(--gh-accent-fg); outline-offset: 1px; }
`;

const CopyBtn = styled(Btn)`
  background: var(--gh-success-emphasis); color: var(--gh-canvas-default); border-color: var(--gh-success-hover); font-weight: 600;
  &:hover { background: var(--gh-success-hover); }
`;

const TabBar = styled.div`
  display: none;
  @media (max-width: 720px) {
    display: flex;
    border: 1px solid var(--gh-border-default);
    border-top: none;
    border-bottom: none;
  }
`;

const TabBtn = styled.button`
  flex: 1;
  padding: 8px;
  border: none;
  background: ${(p) => (p.$active ? "var(--gh-canvas-default)" : "var(--gh-canvas-subtle)")};
  font-size: 13px;
  font-weight: ${(p) => (p.$active ? "600" : "normal")};
  cursor: pointer;
  border-bottom: 2px solid ${(p) => (p.$active ? "var(--gh-accent-fg)" : "transparent")};
`;

const Panes = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 500px;
  border: 1px solid var(--gh-border-default);
  border-top: none;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  @media (max-width: 720px) { grid-template-columns: 1fr; }
`;

const EditArea = styled.textarea`
  border: none;
  border-right: 1px solid var(--gh-border-default);
  padding: 16px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
  resize: none;
  outline: none;
  &:focus-visible { box-shadow: inset 0 0 0 2px var(--gh-accent-ring); }
  @media (max-width: 720px) {
    display: ${(p) => (p.$hidden ? "none" : "block")};
    border-right: none;
    min-height: 300px;
  }
`;

const Preview = styled.div`
  padding: 16px 24px;
  overflow-y: auto;
  line-height: 1.6;
  h1, h2 { border-bottom: 1px solid var(--gh-border-muted); padding-bottom: 0.3em; }
  img { max-width: 100%; }
  code { background: var(--gh-canvas-inset); padding: 0.15em 0.35em; border-radius: 6px; font-size: 85%; }
  pre.cb { background: var(--gh-canvas-subtle); padding: 12px; border-radius: 6px; overflow-x: auto; }
  pre.cb code { background: none; padding: 0; }
  blockquote { margin: 0; padding: 0 1em; color: var(--gh-fg-muted); border-left: 0.25em solid var(--gh-border-default); }
  a { color: var(--gh-accent-fg); }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid var(--gh-border-default); padding: 6px 12px; }
  th { background: var(--gh-canvas-subtle); font-weight: 600; }
  @media (max-width: 720px) {
    display: ${(p) => (p.$hidden ? "none" : "block")};
    min-height: 300px;
  }
`;
