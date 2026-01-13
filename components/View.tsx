import Ping from "@/components/Ping";
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
    <div className="view-container z-99999">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>

      <p className="view-text">
        <span className="font-black">Views: {totalViews + 1}</span>
      </p>
    </div>
  );
};

export default View;
