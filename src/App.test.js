import React from 'react';
import { shallow } from 'enzyme';
import App from './App';
import { StoreContext } from 'redux-react-hook';

global.firebase = {
  auth: jest.fn(() => ({
    useDeviceLanguage: jest.fn(),
    signInWithRedirect: jest.fn(),
    getRedirectResult: jest.fn(() => ({
      credential: {
        accessToken: 'someAccessToken'
      },
      user: {
        name: 'someUser'
      }
    }))
  }))
};

it("Doesn't render the loading spinner", () => {
  const wrapper = shallow(
    <StoreContext.Provider>
      <App />
    </StoreContext.Provider>
  );
  expect(wrapper.find('.loading').length).toEqual(0);
});
