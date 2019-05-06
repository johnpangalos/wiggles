import React, { useState } from 'react';
import { SlideUp } from '~/components/transitions';
import { Modal, Button } from '~/components';
import { constants } from '../reducer';
import { deleteImages } from '../actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

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
      <div className="w-full">
        <SlideUp show={selectMode}>
          <div className="w-full py-3 bg-secondary text-white text-primary">
            <div className="flex h-full items-center">
              <div className="pl-4">
                <div className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-secondary-dark p-1">
                  <FontAwesomeIcon
                    onClick={() => {
                      dispatch({ type: constants.RESET_SELECTED });
                      dispatch({
                        type: constants.SET_SELECT_MODE,
                        payload: false
                      });
                    }}
                    role="button"
                    className={`text-xl fill-current`}
                    icon={faTimes}
                  />
                </div>
              </div>
              <div className="flex-grow text-lg pl-4">
                {numImages} Images Selected
              </div>
              <div className="pr-4">
                <div className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-secondary-dark p-1">
                  <FontAwesomeIcon
                    onClick={() => setShowDeleteModal(true)}
                    role="button"
                    className={`text-xl fill-current`}
                    icon={faTrash}
                  />
                </div>
              </div>
            </div>
          </div>
        </SlideUp>
      </div>
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
