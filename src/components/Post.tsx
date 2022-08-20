import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { useMappedState } from "redux-react-hook";
import { Download } from "react-feather";
import { ProfileImage } from "../components";
import { Fade } from "../components/transitions";
import { Account, Post as PostType } from "@/types";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

type PostProps = {
  children: ReactNode | ReactNode[];
  timestamp?: string;
  selected?: PostType;
  selectable?: boolean;
  handleClick?: () => void;
  account?: Account;
  id?: string;
};

export const Post = ({
  children,
  timestamp = "0",
  selected,
  selectable = false,
  handleClick = () => null,
  account,
  id,
}: PostProps): JSX.Element => {
  const [url, setUrl] = useState("");
  const date = new Date(Number(timestamp));
  const mapState = useCallback(
    (state) => {
      if (!id) return {};
      return { image: state.images[id] };
    },
    [id]
  );

  const { image } = useMappedState(mapState);
  useEffect(() => {
    const load = async () => {
      const storage = getStorage();
      const storageRef = ref(storage, image.path);
      setUrl(await getDownloadURL(storageRef));
    };
    if (image) {
      load();
    }
  }, [image]);

  const forceDownload = (blob: string, filename: string) => {
    var a = document.createElement("a");
    a.download = filename;
    a.href = blob;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const downloadResource = (url: string, filename?: string) => {
    let name = filename;
    if (!name) name = url.split("\\").pop()?.split("/").pop();
    fetch(url, {
      headers: new Headers({
        Origin: window.location.origin,
      }),
      mode: "cors",
    })
      .then((response) => response.blob())
      .then((blob) => {
        let blobUrl = window.URL.createObjectURL(blob);
        forceDownload(blobUrl, name as string);
      })
      .catch((e) => console.error(e));
  };

  return (
    <Fade show={true} appear addEndListener={() => null}>
      <div
        className={`
          flex flex-col bg-white shadow-md 
          rounded px-2 pt-3 pb-4 w-full xs:max-h-sm 
          sm:max-h-500 max-h-xs m-auto h-full max-w-xl ${
            selectable ? " cursor-pointer" : ""
          }${selected ? " border-purple-600 border-2" : ""}`}
      >
        <div
          className="flex flex-grow bg-gray-300 p-1 rounded justify-center items-center h-full"
          onClick={() => handleClick()}
        >
          {children}
        </div>
        {account && (
          <div className="flex pt-3 items-start">
            <div className="h-10 w-10">
              <ProfileImage url={account.photoURL} />
            </div>
            <div className="flex-grow pl-3">
              <div className="text-xl font-bold">{account.displayName}</div>
              <div className="text-sm">Uploaded: {date.toLocaleString()}</div>
            </div>
            {url && (
              <Download
                className="pb-1 self-center text-purple-600"
                role="button"
                onClick={() => downloadResource(url)}
              />
            )}
          </div>
        )}
      </div>
    </Fade>
  );
};
