"use client";

import { BlogCardType } from "@/app/(root)/page";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { EditorPicksCard } from "./Cards";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1023, min: 536 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 535, min: 0 },
    items: 1,
  },
};

const Related = ({ editorPosts }: any) => {
  return (
    <>
      <Carousel
        responsive={responsive}
        containerClass="-mx-[10px]"
        itemClass="px-[10px]"
        infinite={true}
      >
        {editorPosts?.map((post: BlogCardType) => (
          <EditorPicksCard key={post?._id} post={post} />
        ))}
      </Carousel>
    </>
  );
};

export default Related;
