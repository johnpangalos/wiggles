import { FC, useMemo } from "react";
import { Button, Loading } from "~/components";
import { Result, useImageUpload } from "~/hooks";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Upload() {
  const urls = useImageUpload((state) => state.urls);
  const resetImageUpload = useImageUpload((state) => state.reset);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const files = useImageUpload((state) => state.files);

  const formData = useMemo(() => {
    const form = new FormData();
    files.forEach((file) => {
      form.append("file", file);
    });
    return form;
  }, [files]);

  const uploadImagesMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.status > 300) throw new Error("upload failed");
      return await res.json();
    },
    onSuccess: async () => {
      resetImageUpload();
      await queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      navigate(-1);
    },
  });

  if (uploadImagesMutation.status === "pending") return <Loading />;

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
          <div className="relative bottom-16 flex-none p-3 bg-purple-200 flex items-center">
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
}

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
