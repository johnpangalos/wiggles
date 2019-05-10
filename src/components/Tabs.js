import React from 'react';
import { Link } from 'react-router-dom';

export const Tabs = ({ currentTab, tabs }) => {
  return (
    <div className="flex justify-center text-white h-12 w-full bg-primary shadow-md">
      <div className="flex items-end max-w-lg h-ful w-full">
        {Object.values(tabs).map(tab => (
          <TabItem
            key={tab.name}
            text={tab.name}
            active={currentTab === tab.name}
          />
        ))}
      </div>
    </div>
  );
};

const TabItem = ({ text, active }) => (
  <Link
    to={`/upload/${text}`}
    className={`text-white no-underline flex flex-1 h-full items-center justify-center border-b-2 ${
      active ? 'border-white ' : 'border-transparent '
    }text-sm uppercase text-center border-color-transition hover:bg-primary-light cursor-pointer`}
  >
    <div>{text}</div>
  </Link>
);

export const TabContent = ({ component: Component }) => (
  <div className="flex-grow">
    <Component />
  </div>
);
