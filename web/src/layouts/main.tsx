import { useImageUpload } from "@/hooks/useImageUpload";
import React, { ChangeEvent, useRef } from "react";
import {
  HomeIcon,
  ArrowUpTrayIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { NavLink, Outlet, useNavigate } from "react-router";

type Result = string | ArrayBuffer | null;

export function BottomNavigation() {
  const uploadInput = useRef<HTMLInputElement>(null);
  const uploadButton = useRef<HTMLButtonElement>(null);
  const addUrls = useImageUpload((state) => state.addUrls);
  const addFiles = useImageUpload((state) => state.addFiles);
  const navigate = useNavigate();

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();

    const { files } = event.target;
    if (!files || files.length === 0) return;

    const urls: Result[] = [];
    const fileList: File[] = [];
    Array.from(files).forEach((file) => {
      urls.push(URL.createObjectURL(file));
      fileList.push(file);
    });
    addUrls(urls);
    addFiles(fileList);

    navigate("/upload");
  }

  function handleClick() {
    uploadInput.current?.click();
  }

  return (
    <>
      <div className="z-10 bg-gray-100 flex pb-[env(safe-area-inset-bottom)] items-center justify-center w-full py-3 border-t-2 border-purple-600 flex-none px-12">
        <div className="flex items-center justify-around flex-shrink w-full max-w-lg">
          <NavButton to="/feed" icon={HomeIcon} text={"Feed"} />
          <button
            onClick={handleClick}
            ref={uploadButton}
            className="flex flex-col items-center px-4 text-gray-600 no-underline color-transition outline-none"
          >
            <ArrowUpTrayIcon className="size-6" />
            <div className="text-xs">Upload</div>
          </button>
          <NavButton to="/profile" icon={UserIcon} text={"Profile"} />
        </div>
      </div>
      <input
        hidden={true}
        id="upload-image"
        ref={uploadInput}
        type="file"
        multiple
        onChange={onChange}
      />
    </>
  );
}

type NavButtonProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
  to: string;
};

function NavButton({ icon: Icon, text, to }: NavButtonProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center px-4 no-underline color-transition outline-none ${isActive ? "text-purple-600" : "text-gray-600"}`
      }
    >
      <Icon className="size-6" />
      <div className="text-xs">{text}</div>
    </NavLink>
  );
}

export function MainLayout() {
  return (
    <div className="flex flex-col w-full h-svh bg-gray-100">
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden bg-white">
        <div className="mx-auto max-w-2xl h-full">
          <Outlet />
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
