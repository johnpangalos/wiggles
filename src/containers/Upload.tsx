import React, { useEffect, useCallback } from 'react';
import { setMediaTab } from 'actions/index';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { ImageUpload, Quotes } from 'containers/index';
import { Tabs, TabContent } from 'components/index';

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
    []
  );

  const { currentTab } = useMappedState(mapState);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!match.params.currentTab) {
      dispatch(setMediaTab('images'));
      return;
    }
    dispatch(setMediaTab(match.params.currentTab));
  }, [dispatch, match.params.currentTab]);

  const tabs = getTabs(user);

  return (
    <div className="flex flex-col h-full">
      <Tabs tabs={tabs} currentTab={currentTab} />
      <TabContent component={tabs[currentTab].component} />
    </div>
  );
};
