import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

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
  const wrapper = shallow(<App />);
  expect(wrapper.find('.loading').length).toEqual(0);
});
