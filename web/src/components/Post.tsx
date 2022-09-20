import { ReactNode } from "react";
import { Download } from "react-feather";
import { ProfileImage } from "../components";
import { Account } from "@/types";

const forceDownload = (blob: string, filename: string) => {
  const a = document.createElement("a");
  a.download = filename;
  a.href = blob;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

type PostProps = {
  thumbnail?: boolean;
  children: ReactNode | ReactNode[];
  timestamp?: string;
  selected?: boolean;
  selectable?: boolean;
  handleClick?: () => void;
  account?: Account;
  id?: string;
  url?: undefined;
};

export const Post = ({
  children,
  timestamp = "0",
  selected,
  selectable = false,
  handleClick = () => null,
  account,
  thumbnail = false,
  url,
}: PostProps): JSX.Element => {
  const date = new Date(Number(timestamp));

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
        const blobUrl = window.URL.createObjectURL(blob);
        forceDownload(blobUrl, name as string);
      })
      .catch((e) => console.error(e));
  };

  return (
    <div
      className={`
          flex flex-col bg-white shadow-md 
          rounded px-2 pt-3 pb-4 w-full xs:max-h-sm 
          max-h-xs m-auto  max-w-xl
          ${selectable ? " cursor-pointer" : ""}
          ${selected ? " border-purple-600 border-2" : ""}
          ${thumbnail ? "h-[145px] md:h-[195px]" : "h-[520px]"}`}
    >
      <div
        className="flex flex-grow bg-gray-300 p-1 rounded justify-center items-center h-full"
        onClick={() => {
          if (!selectable) return;
          handleClick();
        }}
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
  );
};
