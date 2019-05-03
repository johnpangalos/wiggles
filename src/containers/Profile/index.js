import React, { useEffect, useReducer } from 'react';
import { ProfileImage, Button } from '~/components';
import { Thumbnails } from './Thumbnails';
import { DeleteSnackbar } from './DeleteSnackbar';
import { initialState, reducer, constants } from './reducer';

export const Profile = ({ signOut, user }) => {
  const [{ account, loading, images, selected }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const handleClick = id => {
    if (!selected[id])
      return dispatch({ type: constants.ADD_SELECTED, payload: id });
    return dispatch({ type: constants.REMOVE_SELECTED, payload: id });
  };

  const loadData = () => {
    dispatch({ type: constants.LOADING });

    const accountRef = window.firebase
      .database()
      .ref(`accounts/${user.claims.sub}`);

    const imageRef = window.firebase.database().ref(`images/`);

    accountRef.once('value', accountSnap => {
      const account = accountSnap.val();
      dispatch({ type: constants.ADD_ACCOUNT, payload: account });

      imageRef
        .orderByChild('userId')
        .equalTo(account.id)
        .on('value', imagesSnap => {
          dispatch({ type: constants.ADD_IMAGES, payload: imagesSnap.val() });
          dispatch({ type: constants.NOT_LOADING });
        });
    });

    return () => {
      accountRef.off('value');
      imageRef.off('value');
    };
  };

  useEffect(() => {
    const unsubsribe = loadData();
    return () => unsubsribe();
  }, []);

  return (
    <div className="flex flex-col items-center h-full pb-16 max-w-lg m-auto">
      <div className="flex flex-grow flex-col h-full w-full p-4">
        <div className="flex w-full">
          <div className="pr-6">
            <div className="h-12 w-12">
              <ProfileImage url={account.photoURL} />
            </div>
          </div>

          <div className="flex flex-grow flex-col pt-1 overflow-hidden pr-2">
            <div className="text-xl font-bold truncate">
              {account.displayName}
            </div>
            <div className="text-sm truncate">{account.email}</div>
          </div>

          <div>
            <Button
              color="red-light"
              hoverColor="red"
              dark
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </div>
        </div>
        <Thumbnails
          loading={loading}
          images={images}
          selected={selected}
          handleClick={handleClick}
        />
      </div>
      <DeleteSnackbar selected={selected} dispatch={dispatch} />
    </div>
  );
};
