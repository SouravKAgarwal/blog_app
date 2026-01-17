import dynamic from "next/dynamic";
import ViewMarkdownSkeleton from "@/components/ViewMarkdownSkeleton";

const ViewMarkdown = dynamic(() => import("@/components/ViewMarkdown"), {
  loading: () => <ViewMarkdownSkeleton />,
});

const ViewMarkdownWrapper = ({ content }: { content: string }) => {
  return <ViewMarkdown content={content} />;
};

export default ViewMarkdownWrapper;
