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
    formData: FormData
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
      <div>
        <label htmlFor="title" className="blog-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="blog-form_input"
          placeholder="Blog Title"
        />
        {errors.title && <p className="blog-form_error">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="blog-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="blog-form_textarea"
          placeholder="Blog Description"
        />
        {errors.description && (
          <p className="blog-form_error">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="blog-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="blog-form_input"
          placeholder="Blog Category (Health, Travel, ...)"
        />
        {errors.category && (
          <p className="blog-form_error">{errors.category}</p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <label htmlFor="link" className="blog-form_label">
          Upload Image
        </label>
        {!imageURL ? (
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="link"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300 hover:border-primary transition-all duration-300"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-2 text-sm text-gray-500 font-semibold">
                  Click to upload
                </p>
                <p className="text-xs text-gray-500">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
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
          <>
            <Input
              id="link"
              name="link"
              type="text"
              defaultValue={imageURL}
              className="blog-form_input"
              placeholder="Blog Image URL"
            />
            <div className="relative group">
              <Image
                src={imageURL}
                alt="post_image"
                width={1440}
                height={1440}
                className="rounded-xl w-full max-h-[400px] object-cover shadow-md"
              />
              <button
                type="button"
                onClick={handleImageDelete}
                className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
              >
                <Trash size={20} />
              </button>
            </div>
          </>
        )}
        {errors.link && <p className="blog-form_error">{errors.link}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="Pitch" className="blog-form_label mb-4 block">
          Content
        </label>

        <Editor text={pitch} setText={(value: string) => setPitch(value)} />
        {errors.pitch && <p className="blog-form_error">{errors.pitch}</p>}
      </div>

      <Button
        type="submit"
        className="blog-form_btn text-white w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        disabled={isPending || isUploading}
      >
        {isPending ? "Submitting..." : "Submit your blog"}
        <Send className="ml-2 size-6" />
      </Button>
    </form>
  );
};

export default BlogForm;
