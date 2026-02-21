import { Link } from "react-router";

type TabsProps = {
  currentTab: string;
  tabs: { name: string }[];
};

export function Tabs({ currentTab, tabs }: TabsProps) {
  return (
    <div className="flex justify-center text-white h-12 w-full bg-purple-600 shadow-md">
      <div className="flex items-end max-w-lg h-ful w-full">
        {Object.values(tabs).map((tab) => (
          <TabItem
            key={tab.name}
            text={tab.name}
            active={currentTab === tab.name}
          />
        ))}
      </div>
    </div>
  );
}

const TabItem = ({ text, active }: { text: string; active: boolean }) => (
  <Link
    to={`/upload/${text}`}
    className={`text-white no-underline flex flex-1 h-full items-center justify-center border-b-2 ${
      active ? "border-white " : "border-transparent "
    }text-sm uppercase text-center border-color-transition hover:bg-purple-400 cursor-pointer`}
  >
    <div>{text}</div>
  </Link>
);
