// import { FC, useRef, useLayoutEffect, useState, ChangeEvent } from "react";
// import { Button } from "../components/index";
// import { getExtenstion } from "../utils/index";
// import { Loading } from "../components/index";
// import { getStorage, ref, uploadBytes } from "firebase/storage";
// import { useAuth } from "@/hooks";
// import { useNavigate } from "react-router-dom";
//
// type Result = string | ArrayBuffer | null;

export const Upload = () => {
  return <></>;
  // const { user } = useAuth();
  // const uploadImage = useRef<HTMLInputElement>(null);
  // const [urls, setUrls] = useState<Array<Result>>([]);
  // const [files, setFiles] = useState<Array<File>>([]);
  // const [loading, setLoading] = useState<boolean>(false);
  // const navigate = useNavigate();
  //
  // useLayoutEffect(() => {
  //   uploadImage?.current?.click();
  // }, [uploadImage]);
  //
  // const onChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   event.preventDefault();
  //
  //   const { files } = event.target;
  //   if (!files || files.length === 0) return;
  //
  //   Array.from(files).forEach((file) => {
  //     setUrls((arr) => [...arr, URL.createObjectURL(file)]);
  //     setFiles((arr) => [...arr, file]);
  //   });
  // };
  //
  // const timestamp = +new Date();
  //
  // const uploadFile = (file: File, idx: number) => {
  //   const metadata = {
  //     customMetadata: { userId: user?.uid ?? "" },
  //     cacheControl: "public,max-age=31536000",
  //   };
  //
  //   // This fixes a bug when two images have the same timestamp
  //   const name = `${timestamp + idx}.${getExtenstion(file.name)}`;
  //   const s = getStorage();
  //   const storageRef = ref(s, name);
  //   return uploadBytes(storageRef, file, metadata);
  // };
  //
  // const onSubmit = () => {
  //   setLoading(true);
  //   Promise.all(files.map((file, idx) => uploadFile(file, idx))).then(() => {
  //     setLoading(false);
  //     navigate("/");
  //   });
  //
  //   return null;
  // };
  //
  // if (loading) return <Loading />;
  //
  // return (
  //   <>
  //     {urls.length > 0 && (
  //       <div className="flex flex-col h-full">
  //         <div className="flex-auto overflow-y-scroll">
  //           <div className="p-4 space-y-4">
  //             {urls.map((url, idx) => (
  //               <ImagePreview key={`preview-${idx}`} url={url} idx={idx} />
  //             ))}
  //           </div>
  //         </div>
  //         <div className="flex-none p-3 bg-purple-200 flex items-center">
  //           <div className="flex-grow">
  //             Upload {urls.length} Picture{urls.length > 1 && "s"}
  //           </div>
  //           <Button onClick={onSubmit} variant="primary">
  //             Upload
  //           </Button>
  //         </div>
  //       </div>
  //     )}
  //     <input
  //       hidden={true}
  //       id="upload-image"
  //       ref={uploadImage}
  //       type="file"
  //       multiple
  //       onChange={onChange}
  //     />
  //   </>
  // );
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
