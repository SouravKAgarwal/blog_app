"use client";

import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Send, Trash } from "lucide-react";
import { formSchema } from "@/lib/validations";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { updatePitch } from "@/lib/actions";
import Editor from "./Editor";
import { ChangeEvent, useActionState, useState } from "react";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import Image from "next/image";
import { BlogCardType } from "@/app/(root)/page";

const EditBlogForm = ({ post }: { post: BlogCardType }) => {
  const { _id, title, description, category, pitch, image } = post;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editPitch, setEditPitch] = useState(pitch || "");
  const [imageURL, setImageURL] = useState(image || "");
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
        pitch: editPitch,
      };

      await formSchema.parseAsync(formValues);

      const result = await updatePitch(formData, editPitch, _id);
      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Your blog has been updated",
        });
        router.push(`/blog/${result._id || _id}`);
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
        description: "An unexpected error has occurred",
        variant: "destructive",
      });

      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
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
          defaultValue={title}
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
          defaultValue={description}
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
          defaultValue={category}
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
          <input
            id="link"
            name="link"
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            className="file:mr-4 file:p-4 file:border-0 file:text-lg file:font-semibold file:bg-primary file:text-black border-[3px] border-black rounded-full"
          />
        ) : (
          <div className="relative">
            <Input
              id="link"
              name="link"
              type="text"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              className="blog-form_input"
              placeholder="Blog Image URL"
            />
            <Image
              src={imageURL}
              alt="post_image"
              width={1440}
              height={1440}
              className="rounded-lg w-full h-auto border mt-4 border-black-300 object-cover"
            />
            <button
              type="button"
              onClick={handleImageDelete}
              className="absolute bottom-4 right-2 bg-primary text-white p-1 rounded-full hover:bg-red-600"
            >
              <Trash size={20} />
            </button>
          </div>
        )}
        {errors.link && <p className="blog-form_error">{errors.link}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="Pitch" className="blog-form_label">
          Pitch
        </label>
        <Editor
          text={editPitch}
          setText={(value: string) => setEditPitch(value)}
        />
        {errors.pitch && <p className="blog-form_error">{errors.pitch}</p>}
      </div>

      <Button
        type="submit"
        className="blog-form_btn text-white"
        disabled={isPending || isUploading}
      >
        {isPending ? "Updating..." : "Update Blog"}
        <Send className="ml-2 size-6" />
      </Button>
    </form>
  );
};

export default EditBlogForm;
