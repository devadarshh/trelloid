"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { Check, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "@/components/ui/popover";

import { Logo } from "components/Logo";
import { OrganizationSwitcher, UserButton, useAuth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { defaultImages } from "constants/images";

import {
  useBoardLimitStore,
  useCreateBoardStore,
  useImageStore,
  useRefreshBoard,
} from "hooks/boardHooks/useStore";
import { useOrganizationIdStore } from "hooks/organizaionHooks/useStore";

import {
  CreateBoardFormData,
  createBoardSchema,
} from "schema/validationSchema";
import { MobileSidebar } from "./MobileSideBar";

export type UnsplashImage = {
  id: string;
  urls: { thumb: string; full?: string };
  links: { html: string };
  user: { name: string };
};

interface BoardLimitResponse {
  remaining: number;
}
interface CreateBoardResponse {
  id: string;
  title: string;
  image: string;
}

export const OrgNavBar: React.FC = () => {
  const { images, setImages } = useImageStore();
  const { orgId } = useOrganizationIdStore();
  const { getToken } = useAuth();
  const { triggerRefreshBoards } = useRefreshBoard();
  const { setRemaining } = useBoardLimitStore();
  const [isLoading, setLoading] = useState(false);
  const desktopPopoverCloseRef = useRef<HTMLButtonElement | null>(null);
  const mobilePopoverCloseRef = useRef<HTMLButtonElement | null>(null);
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

  const fetchLimit = async () => {
    if (!orgId) return;
    try {
      const token = await getToken();
      const res = await axios.get<BoardLimitResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/count?orgId=${orgId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRemaining(res.data.remaining);
    } catch (err) {
      console.error("Error fetching board limit:", err);
      setRemaining(0);
    }
  };
  useEffect(() => {
    if (orgId) void fetchLimit();
  }, [orgId]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get<UnsplashImage[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/images`
      );

      const newImages = Array.isArray(response.data)
        ? response.data
        : defaultImages;

      const existingIds = new Set(images.map((img) => img.id));
      const uniqueImages = newImages.filter((img) => !existingIds.has(img.id));

      setImages(uniqueImages.length ? uniqueImages : newImages);
    } catch (err) {
      if (!(err instanceof AxiosError && err.code === "ERR_CANCELED")) {
        toast.error("Failed to load images");
      }
      setImages(defaultImages);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   void fetchImages();
  // }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!orgId) {
      toast.error("Org Id is missing");
      return;
    }

    if (!imageId) {
      setErrors({ imageId: "Please select a board image" });
      toast.error("Please select a board image");
      return;
    }

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

      await axios.post<CreateBoardResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/create-board`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      triggerRefreshBoards();
      await fetchLimit();

      setTitle("");
      setImageId("");
      setImageThumbUrl("");
      setImageFullUrl("");
      setImageLinkHTML("");

      desktopPopoverCloseRef.current?.click();
      mobilePopoverCloseRef.current?.click();
      toast.success("Board created successfully!");
    } catch (err: unknown) {
      if (err instanceof Error && (err as any).name === "ValidationError") {
        const newErrors: Record<string, string> = {};
        (err as any).inner.forEach((e: any) => {
          if (e.path) newErrors[e.path] = e.message;
        });
        setErrors(newErrors);
      } else if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Error creating board");
      } else {
        console.error(err);
        toast.error("Unexpected error creating board");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderImageGrid = () => (
    <div className="grid grid-cols-3 gap-2 mb-2">
      {images.map((image) => (
        <div
          key={image.id}
          className={cn(
            "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden",
            imageId === image.id ? "ring-2 ring-sky-500" : ""
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
            alt={`Unsplash by ${image.user.name}`}
            className="object-cover"
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
          />
          {imageId === image.id && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Check className="h-5 w-5 text-white" />
            </div>
          )}
          <Link
            href={image.links.html}
            target="_blank"
            className="cursor-pointer opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
          >
            {image.user.name}
          </Link>
        </div>
      ))}
      {errors.imageId && (
        <p className="text-red-500 text-xs">{errors.imageId}</p>
      )}
    </div>
  );

  return (
    <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center">
      <MobileSidebar />
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex cursor-default">
          <Logo />
        </div>

        {/* Desktop Create button */}
        <Popover onOpenChange={(open) => open && fetchImages()}>
          <PopoverTrigger asChild>
            <Button
              variant="primary"
              size="sm"
              className="cursor-pointer rounded-sm hidden md:block h-auto py-1.5 px-2"
            >
              Create
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={18}
            side="bottom"
            className="w-80 pt-3"
          >
            <div className="text-sm font-medium text-center text-neutral-600 pb-4 cursor-default">
              Create board
            </div>
            <PopoverClose ref={desktopPopoverCloseRef} asChild>
              <Button
                className="cursor-pointer h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
            </PopoverClose>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  {isLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin mx-auto my-10 text-sky-700" />
                  ) : (
                    renderImageGrid()
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-neutral-700 cursor-default">
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

        {/* Mobile Create button */}
        <Popover onOpenChange={(open) => open && fetchImages()}>
          <PopoverTrigger asChild>
            <Button
              variant="primary"
              size="sm"
              className="cursor-pointer rounded-sm block md:hidden"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-64">
            <div className="text-sm font-medium text-center text-neutral-600 pb-4 cursor-default">
              Create board
            </div>
            <PopoverClose ref={mobilePopoverCloseRef} asChild>
              <Button
                className="cursor-pointer h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
            </PopoverClose>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  {isLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin mx-auto my-10 text-sky-700" />
                  ) : (
                    renderImageGrid()
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-neutral-700 cursor-default">
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
      </div>

      <div className="flex-1" />

      <div className="ml-auto flex items-center gap-x-2">
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/organization/:id"
          afterLeaveOrganizationUrl="/select-org"
          afterSelectOrganizationUrl="/organization/:id"
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
            },
          }}
        />
        <UserButton
          appearance={{
            elements: {
              avatarBox: { height: 30, width: 30, cursor: "pointer" },
            },
          }}
        />
      </div>
    </nav>
  );
};
