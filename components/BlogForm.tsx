"use client";

import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Send, Trash } from "lucide-react";
import { formSchema } from "@/lib/validations";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";
import Editor from "./Editor";
import { ChangeEvent, useActionState, useState } from "react";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import Image from "next/image";

const BlogForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const [imageURL, setImageURL] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setImageURL(url);
    } catch (error) {
      console.error("Image upload failed", error);
      toast({
        title: "Error",
        description: "Image upload failed",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageDelete = () => {
    setImageURL("");
  };

  const handleFormSubmit = async (
    prevState: Record<string, unknown>,
    formData: FormData,
  ) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: imageURL,
        pitch: pitch,
      };

      await formSchema.parseAsync(formValues);

      const result = await createPitch(formData, pitch);
      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "You have submitted your blog",
        });
        router.push(`/blog/${result._id}`);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;

        setErrors(fieldErrors as unknown as Record<string, string>);

        toast({
          title: "Error",
          description: "Validation Failed",
          variant: "destructive",
        });

        return { ...prevState, error: "Validation error", status: "ERROR" };
      }

      toast({
        title: "Error",
        description: "An unexpected error has occured",
        variant: "destructive",
      });

      return {
        ...prevState,
        error: "An unexpected error has occured",
        status: "ERROR",
      };
    } finally {
    }
  };

  const [, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="blog-form">
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="font-serif text-xl font-bold text-foreground"
        >
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="h-12 text-lg font-medium"
          placeholder="What's your story about?"
        />
        {errors.title && (
          <p className="text-destructive text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="font-serif text-xl font-bold text-foreground"
        >
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="min-h-[120px] text-base resize-none"
          placeholder="Briefly describe your idea..."
        />
        {errors.description && (
          <p className="text-destructive text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="category"
          className="font-serif text-xl font-bold text-foreground"
        >
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="h-12 text-base"
          placeholder="e.g. Technology, Lifestyle, Education"
        />
        {errors.category && (
          <p className="text-destructive text-sm mt-1">{errors.category}</p>
        )}
      </div>

      <div className="space-y-3">
        <label
          htmlFor="link"
          className="font-serif text-xl font-bold text-foreground"
        >
          Cover Image
        </label>
        {!imageURL ? (
          <div className="group relative border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors rounded-xl p-8 text-center cursor-pointer bg-secondary/30 hover:bg-secondary/50">
            <label
              htmlFor="link"
              className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
            >
              <div className="p-4 bg-background rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground">
                Click to upload cover image
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                SVG, PNG, JPG (max 800x400px)
              </p>
              <input
                id="link"
                name="link"
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden border border-border group">
            <Input
              id="link"
              name="link"
              type="hidden"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
            />
            <Image
              src={imageURL}
              alt="post_image"
              width={800}
              height={400}
              className="w-full h-[300px] object-cover"
            />
            <button
              type="button"
              onClick={handleImageDelete}
              className="absolute top-4 right-4 bg-destructive/90 text-white p-2 rounded-full hover:bg-destructive transition-all shadow-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
            >
              <Trash size={18} />
            </button>
          </div>
        )}
        {errors.link && (
          <p className="text-destructive text-sm mt-1">{errors.link}</p>
        )}
      </div>

      <div data-color-mode="dark" className="space-y-2">
        <label
          htmlFor="Pitch"
          className="font-serif text-xl font-bold text-foreground block"
        >
          Story
        </label>

        <div className="rounded-lg">
          <Editor text={pitch} setText={(value: string) => setPitch(value)} />
        </div>
        {errors.pitch && (
          <p className="text-destructive text-sm mt-1">{errors.pitch}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-lg font-bold shadow-md hover:shadow-lg transition-all"
        disabled={isPending || isUploading}
      >
        {isPending ? "Submitting..." : "Publish Story"}
        <Send className="ml-2 size-5" />
      </Button>
    </form>
  );
};

export default BlogForm;
