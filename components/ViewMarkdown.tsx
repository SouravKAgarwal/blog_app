"use client";

import { MdPreview } from "md-editor-rt";
import "md-editor-rt/lib/style.css";

const ViewMarkdown = ({ content }: { content: string }) => {
  return (
    <div id="view-markdown">
      <MdPreview
        value={content}
        language="en-US"
        previewTheme="github"
        codeTheme="github"
        showCodeRowNumber
      />
    </div>
  );
};

export default ViewMarkdown;
