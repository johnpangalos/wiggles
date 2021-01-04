import React, { useState } from 'react';
import { Modal, Button, Toolbar } from '~/components';
import { constants } from '../reducer';
import { deleteImages } from '../actions';
import { Trash, X } from 'react-feather';

export const SelectToolbar = ({ selected, dispatch, selectMode }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const numImages = Object.keys(selected).length;

  const handleClick = async () => {
    try {
      await deleteImages(Object.keys(selected));
      setShowDeleteModal(false);
      dispatch({ type: constants.RESET_SELECTED });
      dispatch({
        type: constants.SET_SELECT_MODE,
        payload: false
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Toolbar showing={selectMode}>
        <div className="flex h-full items-center">
          <div className="pl-4">
            <div className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-gray-600 p-1">
              <X
                onClick={() => {
                  dispatch({ type: constants.RESET_SELECTED });
                  dispatch({
                    type: constants.SET_SELECT_MODE,
                    payload: false
                  });
                }}
                role="button"
                className={`text-xl fill-current`}
              />
            </div>
          </div>
          <div className="flex-grow text-lg pl-4">
            {numImages} Images Selected
          </div>
          <div className="pr-4">
            <div className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-gray-600 p-1">
              <Trash
                onClick={() => setShowDeleteModal(true)}
                role="button"
                className={`text-xl fill-current`}
              />
            </div>
          </div>
        </div>
      </Toolbar>
      {showDeleteModal && (
        <Modal>
          <div className="pt-2 px-2 pb-8">Delete {numImages} Image(s)?</div>
          <div className="flex justify-end">
            <Button onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button onClick={() => handleClick()}> Delete </Button>
          </div>
        </Modal>
      )}
    </>
  );
};
