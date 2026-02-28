import {
  Menu as HeadlessMenu,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/react";
import { ReactNode } from "react";

type MenuItemType = {
  label: ReactNode;
  onClick: () => void;
};

type MenuProps = {
  activator: ReactNode;
  items: MenuItemType[];
};

export function Menu({ activator, items }: MenuProps) {
  return (
    <HeadlessMenu as="div" className="relative flex items-center py-1">
      <MenuButton className="flex items-center cursor-pointer">
        {activator}
      </MenuButton>
      <MenuItems className="absolute right-0 top-full bg-white rounded overflow-hidden shadow-lg py-2">
        {items.map((item, index) => (
          <MenuItem key={index}>
            <button
              className="block w-full px-4 py-2 text-left text-sm data-[focus]:bg-gray-100"
              onClick={item.onClick}
            >
              {item.label}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </HeadlessMenu>
  );
}
