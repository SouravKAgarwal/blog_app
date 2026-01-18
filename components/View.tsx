import { client } from "@/sanity/lib/client";
import { BLOG_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";

const View = async ({ id }: { id: string }) => {
  const { views: totalViews } = await client
    .withConfig({ useCdn: false })
    .fetch(BLOG_VIEWS_QUERY, { id });

  await writeClient
    .patch(id)
    .setIfMissing({ views: 0 })
    .inc({ views: 1 })
    .commit();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-background/80 backdrop-blur-md border border-border px-4 py-2 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
      </div>

      <p className="text-sm font-medium text-foreground">
        <span className="font-bold">{totalViews + 1}</span> views
      </p>
    </div>
  );
};

export default View;
