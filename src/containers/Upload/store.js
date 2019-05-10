export const initialState = {
  currentTab: 'images'
};

export const constants = {
  SET_CURRENT_TAB: 'set-current-tab'
};

export const reducer = (state, action) => {
  switch (action.type) {
    case constants.SET_CURRENT_TAB: {
      return { ...state, currentTab: action.payload };
    }
    default: {
      return state;
    }
  }
};
