"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import axios from "axios";
import {
  useBoardStore,
  useImageStore,
  useLoadingStore,
} from "hooks/boardHooks/useStore";
import Image from "next/image";
import Link from "next/link";
import { useOrganizationIdStore } from "hooks/organizaionHooks/useStore";
import { useAuth } from "@clerk/nextjs";

const CreateBoardPopover = () => {
  const { isLoading, setLoading } = useLoadingStore();
  const { images, setImages } = useImageStore();
  const { orgId } = useOrganizationIdStore();

  const { getToken } = useAuth();

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
  } = useBoardStore();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/images");
        console.log(response.data);
        setImages(response.data);
      } catch (error: any) {
        console.error(error.message || "Error fetching images");
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  console.log(
    orgId,
    title,
    imageId,
    imageThumbUrl,
    imageFullUrl,
    imageLinkHTML
  );

  const handleCreateBoard = async () => {
    try {
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("2");
      console.log("Board Created", response.data);
    } catch (error: any) {
      console.log("3");
      console.error(error.message || "Error Creating Board");
      console.log("4");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-2">
        {isLoading ? (
          <p>LOADING IMAGES</p>
        ) : (
          images.map((image) => (
            <div
              key={image.id}
              className="cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted"
              onClick={() => {
                setImageId(image.id);
                setImageThumbUrl(image.urls.thumb);
                setImageFullUrl(image.urls.full ?? "");
                setImageLinkHTML(image.links.html);
              }}
            >
              <input type="radio" className="hidden" />
              <Image
                src={image.urls.thumb}
                alt="Unsplash image"
                className="object-cover rounded-sm"
                fill
              />
              <Link
                href={image.links.html}
                target="_blank"
                className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
              >
                {image.user.name}
              </Link>
            </div>
          ))
        )}
      </div>
      <p>Board Title</p>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      <Button onClick={handleCreateBoard}>Create</Button>
    </div>
  );
};

export default CreateBoardPopover;
function getToken() {
  throw new Error("Function not implemented.");
}
