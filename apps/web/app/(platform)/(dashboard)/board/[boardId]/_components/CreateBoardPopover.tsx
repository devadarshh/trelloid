"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, ElementRef } from "react";
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
import { PopoverClose } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { defaultImages } from "constants/images";

type UnsplashImage = {
  id: string;
  urls: {
    thumb: string;
    full?: string;
  };
  links: {
    html: string;
  };
  user: {
    name: string;
  };
};

const CreateBoardPopover = () => {
  const { isLoading, setLoading } = useLoadingStore();
  const { images, setImages } = useImageStore();
  const { orgId } = useOrganizationIdStore();
  const { getToken } = useAuth();
  const { triggerRefreshBoards } = useRefreshBoard();
  const closeRef = useRef<ElementRef<"button">>(null);

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
      } catch (error: any) {
        console.error(error.message || "Error fetching images");
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

  const handleCreateBoard = async () => {
    if (!title.trim()) return console.error("Board title is required");

    try {
      setLoading(true);
      const token = await getToken();

      const response = await axios.post(
        "http://localhost:5000/api/v1/create-board",
        {
          orgId,
          title,
          imageId,
          imageThumbUrl,
          imageFullUrl,
          imageLinkHTML,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      console.log("✅ Board Created:", response.data);
      console.log("✅ Board Created, triggering refresh...");
      triggerRefreshBoards();

      closeRef.current?.click();
    } catch (error: any) {
      console.error(error.message || "Error Creating Board");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-sm font-medium text-center text-neutral-600 pb-4">
        Create board
      </div>
      <PopoverClose ref={closeRef} asChild>
        <Button
          className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
          variant="ghost"
        >
          <X className="h-4 w-4" />
        </Button>
      </PopoverClose>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateBoard();
        }}
        className="space-y-4"
      >
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
          </div>

          {/* Submit button */}
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default CreateBoardPopover;
