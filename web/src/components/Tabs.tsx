import { Tab, TabGroup, TabList } from "@headlessui/react";
import { useNavigate } from "react-router";

type TabsProps = {
  currentTab: string;
  tabs: { name: string }[];
};

export function Tabs({ currentTab, tabs }: TabsProps) {
  const navigate = useNavigate();
  const selectedIndex = tabs.findIndex((tab) => tab.name === currentTab);

  return (
    <TabGroup
      selectedIndex={selectedIndex}
      onChange={(index) => navigate(`/upload/${tabs[index].name}`)}
    >
      <TabList className="flex justify-center text-white h-12 w-full bg-purple-600 shadow-md">
        <div className="flex items-end max-w-lg h-full w-full">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className="flex flex-1 h-full items-center justify-center border-b-2 text-sm uppercase text-center cursor-pointer text-white outline-none data-[selected]:border-white border-transparent hover:bg-purple-400"
            >
              {tab.name}
            </Tab>
          ))}
        </div>
      </TabList>
    </TabGroup>
  );
}
