import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { setMediaTab } from '~/actions';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { ImageUpload, Quotes } from '~/containers';

const getTabs = user => ({
  images: {
    name: 'images',
    component: ImageUpload
  },
  quotes: {
    name: 'quotes',
    component: () => <Quotes user={user} />
  },
  videos: {
    name: 'videos',
    component: () => <div>Not implemented yet</div>
  }
});
export const Upload = ({ user, match }) => {
  const mapState = useCallback(
    state => ({
      currentTab: state.mediaTabs.currentTab
    }),
    [user]
  );

  const { currentTab } = useMappedState(mapState);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!match.params.currentTab) {
      dispatch(setMediaTab('images'));
      return;
    }
    dispatch(setMediaTab(match.params.currentTab));
  }, [match.params.currentTab]);

  const tabs = getTabs(user);

  return (
    <div className="flex flex-col h-full w-full items-center overflow-y-hidden">
      <Tabs tabs={tabs} currentTab={currentTab} />
      <div className="flex flex-col max-w-lg h-full w-full overflow-y-hidden">
        <TabContent component={tabs[currentTab].component} />
      </div>
    </div>
  );
};

const Tabs = ({ currentTab, tabs }) => {
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

const TabContent = ({ component: Component }) => (
  <div className="flex-grow">
    <Component />
  </div>
);
