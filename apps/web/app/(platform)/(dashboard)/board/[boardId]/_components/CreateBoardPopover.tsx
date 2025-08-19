"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  useCreateBoardStore,
  useImageStore,
  useLoadingStore,
  useRefreshBoard,
} from "hooks/boardHooks/useStore";
import Image from "next/image";
import Link from "next/link";
import { useOrganizationIdStore } from "hooks/organizaionHooks/useStore";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Check, Loader2, X } from "lucide-react";
import {
  PopoverClose,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { defaultImages } from "constants/images";
import {
  createBoardSchema,
  CreateBoardFormData,
} from "schema/validationSchema";

type UnsplashImage = {
  id: string;
  urls: { thumb: string; full?: string };
  links: { html: string };
  user: { name: string };
};

const CreateBoardPopover = () => {
  const { isLoading, setLoading } = useLoadingStore();
  const { images, setImages } = useImageStore();
  const { orgId } = useOrganizationIdStore();
  const { getToken } = useAuth();
  const { triggerRefreshBoards } = useRefreshBoard();
  const closeRef = useRef<HTMLButtonElement>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    title,
    imageId,
    imageThumbUrl,
    imageFullUrl,
    imageLinkHTML,
    setTitle,
    setImageId,
    setImageThumbUrl,
    setImageFullUrl,
    setImageLinkHTML,
  } = useCreateBoardStore();

  // Fetch board images
  useEffect(() => {
    let mounted = true;

    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/images");

        if (mounted && response.data) {
          setImages(response.data);
        } else {
          setImages(defaultImages);
        }
      } catch {
        setImages(defaultImages);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
    return () => {
      mounted = false;
    };
  }, [setImages, setLoading]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData: CreateBoardFormData = {
      orgId,
      title,
      imageId,
      imageThumbUrl,
      imageFullUrl,
      imageLinkHTML,
    };

    try {
      await createBoardSchema.validate(formData, { abortEarly: false });

      setLoading(true);
      const token = await getToken();

      await axios.post("http://localhost:5000/api/v1/create-board", formData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      triggerRefreshBoards();

      setTitle("");
      setImageId("");
      setImageThumbUrl("");
      setImageFullUrl("");
      setImageLinkHTML("");

      closeRef.current?.click();
    } catch (err: any) {
      if (err.name === "ValidationError") {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((e: any) => {
          if (e.path) newErrors[e.path] = e.message;
        });
        setErrors(newErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition cursor-pointer"
        >
          <p className="text-sm">Create new board</p>
          <span className="text-xs">5 remaining</span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="center"
        sideOffset={10}
        side="bottom"
        avoidCollisions={false}
        className="w-80 max-h-[80vh] overflow-y-auto"
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Create board
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600 cursor-pointer"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-4">
            {/* Image Selector */}
            <div className="relative">
              {isLoading ? (
                <div className="flex items-center justify-center p-10">
                  <Loader2 className="h-8 w-8 text-sky-700 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {images.map((image: UnsplashImage) => (
                    <div
                      key={image.id}
                      className={cn(
                        "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden",
                        imageId === image.id && "ring-2 ring-sky-500"
                      )}
                      onClick={() => {
                        setImageId(image.id);
                        setImageThumbUrl(image.urls.thumb);
                        setImageFullUrl(image.urls.full ?? "");
                        setImageLinkHTML(image.links.html);
                      }}
                    >
                      <Image
                        src={image.urls.thumb}
                        alt="Unsplash image"
                        className="object-cover"
                        fill
                      />
                      {imageId === image.id && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      )}
                      <Link
                        href={image.links.html}
                        target="_blank"
                        className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
                      >
                        {image.user.name}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
              {errors.imageId && (
                <p className="text-red-500 text-xs">{errors.imageId}</p>
              )}
            </div>

            {/* Title input */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-neutral-700">
                Board Title
              </Label>
              <Input
                type="text"
                disabled={isLoading}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-sm px-2 py-1 h-8"
                placeholder="Enter board title"
              />
              {errors.title && (
                <p className="text-red-500 text-xs">{errors.title}</p>
              )}
            </div>

            {/* Submit button */}
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default CreateBoardPopover;
