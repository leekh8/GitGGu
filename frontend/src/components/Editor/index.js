import { useState } from "react";
import styled from "styled-components";
import { markdownToHtml } from "../../utils/markdown";

// GitHub 프로필 꾸미기용 데코 위젯 스니펫 (버튼 클릭 시 에디터에 삽입)
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
    md: "![Stats](https://github-readme-stats.vercel.app/api?username=YOUR_ID&show_icons=true)",
  },
  {
    label: "🔥 Streak",
    md: "![Streak](https://github-readme-streak-stats.herokuapp.com/?user=YOUR_ID)",
  },
  {
    label: "🧑‍💻 Top Langs",
    md: "![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=YOUR_ID&layout=compact)",
  },
];

// 기본 마크다운 서식
const FORMATS = [
  { label: "H1", md: "# 제목" },
  { label: "B", md: "**굵게**" },
  { label: "I", md: "*기울임*" },
  { label: "‹›", md: "`코드`" },
  { label: "• 목록", md: "- 항목" },
  { label: "🔗", md: "[텍스트](https://)" },
];

const DEFAULT_MD = `# 👋 Hi, I'm YOUR_NAME

![header](https://capsule-render.vercel.app/api?type=waving&color=auto&height=200&section=header&text=YOUR_NAME&fontSize=70)

## 🛠 Tech Stack

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 📊 GitHub Stats

![Stats](https://github-readme-stats.vercel.app/api?username=YOUR_ID&show_icons=true)
`;

export default function Editor() {
  const [md, setMd] = useState(DEFAULT_MD);
  const [copied, setCopied] = useState(false);

  const insert = (snippet) =>
    setMd((m) => (m === "" || m.endsWith("\n") ? m : m + "\n") + snippet + "\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard 미지원 환경 무시 */
    }
  };

  return (
    <Wrap>
      <TitleBar>
        <h1>GitGGu</h1>
        <span>GitHub 프로필·README 꾸미기 에디터</span>
      </TitleBar>

      <Toolbar>
        <Group>
          {FORMATS.map((f) => (
            <Btn key={f.label} onClick={() => insert(f.md)}>
              {f.label}
            </Btn>
          ))}
        </Group>
        <Divider />
        <Group>
          {WIDGETS.map((w) => (
            <Btn key={w.label} onClick={() => insert(w.md)}>
              {w.label}
            </Btn>
          ))}
        </Group>
        <CopyBtn onClick={copy}>{copied ? "복사됨 ✓" : "📋 마크다운 복사"}</CopyBtn>
      </Toolbar>

      <Panes>
        <EditArea
          value={md}
          onChange={(e) => setMd(e.target.value)}
          spellCheck={false}
          aria-label="markdown editor"
        />
        <Preview
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(md) }}
        />
      </Panes>
    </Wrap>
  );
}

const Wrap = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #1f2328;
`;

const TitleBar = styled.header`
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;
  h1 {
    margin: 0;
    font-size: 28px;
    color: #24292f;
  }
  span {
    color: #656d76;
    font-size: 14px;
  }
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border: 1px solid #d0d7de;
  border-radius: 8px 8px 0 0;
  background: #f6f8fa;
`;

const Group = styled.div`
  display: flex;
  gap: 4px;
`;

const Divider = styled.div`
  width: 1px;
  align-self: stretch;
  background: #d0d7de;
  margin: 0 4px;
`;

const Btn = styled.button`
  border: 1px solid #d0d7de;
  background: #fff;
  border-radius: 6px;
  padding: 5px 10px;
  font-size: 13px;
  cursor: pointer;
  &:hover {
    background: #eaeef2;
  }
`;

const CopyBtn = styled(Btn)`
  margin-left: auto;
  background: #1f883d;
  color: #fff;
  border-color: #1a7f37;
  font-weight: 600;
  &:hover {
    background: #1a7f37;
  }
`;

const Panes = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 460px;
  border: 1px solid #d0d7de;
  border-top: none;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const EditArea = styled.textarea`
  border: none;
  border-right: 1px solid #d0d7de;
  padding: 16px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
  resize: none;
  outline: none;
  @media (max-width: 720px) {
    border-right: none;
    border-bottom: 1px solid #d0d7de;
    min-height: 240px;
  }
`;

const Preview = styled.div`
  padding: 16px 24px;
  overflow-y: auto;
  line-height: 1.6;
  h1,
  h2 {
    border-bottom: 1px solid #d8dee4;
    padding-bottom: 0.3em;
  }
  img {
    max-width: 100%;
  }
  code {
    background: #eff1f3;
    padding: 0.15em 0.35em;
    border-radius: 6px;
    font-size: 85%;
  }
  pre.cb {
    background: #f6f8fa;
    padding: 12px;
    border-radius: 6px;
    overflow-x: auto;
  }
  pre.cb code {
    background: none;
    padding: 0;
  }
  blockquote {
    margin: 0;
    padding: 0 1em;
    color: #656d76;
    border-left: 0.25em solid #d0d7de;
  }
  a {
    color: #0969da;
  }
`;
