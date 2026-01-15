"use client";

import { useState } from "react";
import { MdPreview } from "md-editor-rt";
import "md-editor-rt/lib/preview.css";

type ViewMarkdownProps = {
  content: string;
};

const ViewMarkdown = ({ content }: ViewMarkdownProps) => {
  const [id] = useState("markdown-preview");

  return (
    <div className="markdown-layout">
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
