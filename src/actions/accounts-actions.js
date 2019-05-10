import { constants } from '~/constants';

export const addAccount = account => ({
  type: constants.ADD_ACCOUNTS,
  payload: { [account.id]: account }
});

export const removeAccount = id => ({
  type: constants.REMOVE_ACCOUNT,
  payload: id
});
