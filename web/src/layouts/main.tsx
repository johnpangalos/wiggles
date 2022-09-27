import { useImageUpload } from "@/hooks/useImageUpload";
import { ChangeEvent, useRef } from "react";
import { Home, Icon, Upload, User } from "react-feather";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

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
      <div className="z-10 bg-gray-100 flex items-center justify-center w-full py-3 border-t-2 border-purple-600 pin-b px-12">
        <div className="flex items-center justify-around flex-shrink w-full max-w-lg">
          <NavButton to="/feed" icon={Home} text={"Feed"} />
          <button
            onClick={handleClick}
            ref={uploadButton}
            className="flex flex-col items-center px-4 text-gray-600 no-underline color-transition outline-none"
          >
            <Upload />
            <div className="text-xs">Upload</div>
          </button>
          <NavButton to="/profile" icon={User} text={"Profile"} />
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
  icon: Icon;
  text: string;
  to: string;
};

function NavButton({ icon: Icon, text, to }: NavButtonProps) {
  return (
    <NavLink
      to={to}
      className="flex flex-col items-center px-4 text-gray-600 no-underline color-transition outline-none"
    >
      <Icon />
      <div className="text-xs">{text}</div>
    </NavLink>
  );
}

// activeClassName="text-purple-600"

export function MainLayout() {
  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden">
        <Outlet />
      </div>

      <BottomNavigation />
    </div>
  );
}
