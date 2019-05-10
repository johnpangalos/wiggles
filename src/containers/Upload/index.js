import React, { useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { initialState, constants, reducer } from './store';
import { ImageUpload, Quotes } from '~/containers';

export const Upload = ({ user, match }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    if (!match.params.currentTab)
      return dispatch({
        type: constants.SET_CURRENT_TAB,
        payload: 'images'
      });
    dispatch({
      type: constants.SET_CURRENT_TAB,
      payload: match.params.currentTab
    });
  }, [match.params.currentTab]);
  const tabs = {
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
  };
  return (
    <div className="flex flex-col h-full w-full items-center overflow-y-hidden">
      <Tabs tabs={tabs} currentTab={state.currentTab} dispatch={dispatch} />
      <div className="flex flex-col max-w-lg h-full w-full overflow-y-hidden">
        <TabContent component={tabs[state.currentTab].component} />
      </div>
    </div>
  );
};

const Tabs = ({ currentTab, dispatch, tabs }) => {
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
