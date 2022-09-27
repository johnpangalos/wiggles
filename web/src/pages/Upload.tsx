import { FC, useMemo } from "react";
import { Button } from "@/components";
import { Loading } from "@/components";

import { Result, useImageUpload } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

export const Upload = () => {
  const urls = useImageUpload((state) => state.urls);
  const resetImageUpload = useImageUpload((state) => state.reset);
  const navigate = useNavigate();
  const files = useImageUpload((state) => state.files);

  const formData = useMemo(() => {
    const form = new FormData();
    files.forEach((file) => {
      form.append("file", file);
    });
    return form;
  }, [files]);

  const uploadImagesMutation = useMutation(
    async (formData: FormData) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      if (res.status > 300) throw new Error("upload failed");
      return await res.json();
    },
    {
      onSuccess: () => {
        navigate(-1);
      },
    }
  );

  if (uploadImagesMutation.status === "loading") return <Loading />;

  return (
    <>
      {urls.length > 0 && (
        <div className="flex flex-col h-full">
          <div className="flex-auto overflow-y-scroll">
            <div className="p-4 space-y-4">
              {urls.map((url, idx) => (
                <ImagePreview key={`preview-${idx}`} url={url} idx={idx} />
              ))}
            </div>
          </div>
          <div className="flex-none p-3 bg-purple-200 flex items-center">
            <div className="flex-grow">
              Upload {urls.length} Picture{urls.length > 1 && "s"}
            </div>

            <Button
              className="mr-3"
              onClick={() => {
                resetImageUpload();
                navigate(-1);
              }}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                uploadImagesMutation.mutate(formData);
              }}
              variant="primary"
            >
              Upload
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

const ImagePreview: FC<{ url: Result; idx: number }> = ({ url, idx }) => (
  <div className="m-auto shadow-lg p-2 max-w-sm">
    <div className="grid place-items-center px-4">
      <div className="grid place-items-center rounded-md p-2 w-full bg-gray-300">
        <img
          className="object-contain h-64 xs:h-80"
          src={url?.toString()}
          alt={`preview-${idx}`}
        />
      </div>
    </div>
  </div>
);
