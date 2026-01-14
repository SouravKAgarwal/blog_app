"use client";

import { useEffect, useState } from "react";
import { MdCatalog, MdPreview } from "md-editor-rt";
import "md-editor-rt/lib/preview.css";

type ViewMarkdownProps = {
  content: string;
};

const ViewMarkdown = ({ content }: ViewMarkdownProps) => {
  const [id] = useState("markdown-preview");
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setScrollElement(document.documentElement);
  }, []);

  if (!scrollElement) return null;

  return (
    <div className="markdown-layout">
      <div className="toc-wrapper">
        <div className="sticky top-2 border-[3px] border-black rounded-[20px] bg-white p-5 shadow-200">
          <p className="font-bold text-xl mb-4 border-b-[3px] border-black pb-2">
            Table of Contents
          </p>
          <aside className="markdown-toc flex flex-col gap-2">
            <MdCatalog
              editorId={id}
              theme="light"
              syncWith="preview"
              scrollElement={scrollElement}
              scrollElementOffsetTop={10}
            />
          </aside>
        </div>
      </div>

      <main className="markdown-content">
        <MdPreview
          id={id}
          value={content}
          language="en-US"
          previewTheme="github"
          codeTheme="github"
          codeFoldable={false}
          showCodeRowNumber
        />
      </main>
    </div>
  );
};

export default ViewMarkdown;
