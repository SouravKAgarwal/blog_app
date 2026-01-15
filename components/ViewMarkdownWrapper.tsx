"use client";

import dynamic from "next/dynamic";

const ViewMarkdown = dynamic(() => import("@/components/ViewMarkdown"), {
  ssr: false,
  loading: () => <p>Loading content...</p>,
});

const ViewMarkdownWrapper = ({ content }: { content: string }) => {
  return <ViewMarkdown content={content} />;
};

export default ViewMarkdownWrapper;
