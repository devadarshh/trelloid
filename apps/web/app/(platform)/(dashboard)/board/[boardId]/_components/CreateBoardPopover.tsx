"use client";

import { useRef, useState } from "react";
import { api, getApiErrorMessage } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Check, Loader2, X } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import {
  useCreateBoardStore,
  useGetBoardStore,
  useImageStore,
  useLoadingStore,
  useOrgProStore,
  useRefreshBoard,
} from "hooks/boardHooks/useStore";
import { useOrganizationIdStore } from "hooks/organizaionHooks/useStore";
import * as yup from "yup";
import {
  createBoardSchema,
  CreateBoardFormData,
} from "schema/validationSchema";
import { useProModal } from "hooks/use-pro-modal";
import { defaultImages } from "constants/images";
import { MAX_FREE_BOARDS } from "constants/boards";

type UnsplashImage = {
  id: string;
  urls: { thumb: string; full?: string };
  links: { html: string };
  user: { name: string };
};

const CreateBoardPopover = () => {
  const { orgId } = useOrganizationIdStore();
  const { getToken } = useAuth();
  const { triggerRefreshBoards } = useRefreshBoard();
  const { isLoading, setLoading } = useLoadingStore();
  const { images, setImages } = useImageStore();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { boards } = useGetBoardStore();
  const proModal = useProModal();
  const { isPro } = useOrgProStore();

  const orgBoardCount = boards.filter(
    (board) => board.organizationId === orgId
  ).length;
  const remaining = Math.max(MAX_FREE_BOARDS - orgBoardCount, 0);

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
  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/images");
      const newImages: UnsplashImage[] = Array.isArray(response.data)
        ? response.data
        : defaultImages;

      const existingIds = new Set(images.map((img) => img.id));
      const uniqueImages = newImages.filter((img) => !existingIds.has(img.id));

      setImages(uniqueImages.length ? uniqueImages : newImages);
    } catch {
      setImages(defaultImages);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!isPro && remaining === 0) {
      toast.error("You have reached your free board limit. Upgrade to Pro!");
      proModal.onOpen();
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

      await api.post(
        "/api/v1/create-board",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      triggerRefreshBoards();

      setTitle("");
      setImageId("");
      setImageThumbUrl("");
      setImageFullUrl("");
      setImageLinkHTML("");

      closeRef.current?.click();
    } catch (err: unknown) {
      let message = getApiErrorMessage(err);
      if (err instanceof yup.ValidationError) {
        const fieldErrors: Record<string, string> = {};
        err.inner.forEach((e) => {
          if (e.path) fieldErrors[e.path] = e.message;
        });
        setErrors(fieldErrors);
        message = err.errors[0] ?? "Please fix the form errors";
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover onOpenChange={(open) => open && fetchImages()}>
      <PopoverTrigger asChild>
        <button className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col items-center justify-center hover:opacity-75 transition cursor-pointer">
          <p className="text-sm">Create new board</p>
          <span className="text-xs">
            {isPro ? "Unlimited" : `${remaining} remaining`}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={10}
        side="bottom"
        avoidCollisions={true}
        className="w-80 max-w-[95vw] sm:max-w-[90vw] md:w-96 max-h-[80vh] overflow-y-auto"
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
            {/* Images */}
            <div className="relative">
              {isLoading ? (
                <div className="flex items-center justify-center p-10">
                  <Loader2 className="h-8 w-8 text-sky-700 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {(Array.isArray(images) ? images : []).map(
                    (image: UnsplashImage) => (
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
                          fill
                          className="object-cover"
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
                          className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50 cursor-pointer"
                        >
                          {image.user.name}
                        </Link>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Board title */}
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

            <Button
              variant="primary"
              size="sm"
              type="button" //
              className="w-full cursor-pointer"
              onClick={(e) => {
                if (!isPro && remaining === 0) {
                  toast.error(
                    "You have reached your free board limit. Upgrade to Pro!"
                  );
                  proModal.onOpen();
                  return;
                }
                onSubmit(e);
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : !isPro && remaining === 0 ? (
                "Upgrade to Pro"
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
