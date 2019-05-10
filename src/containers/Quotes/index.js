import React, { useState } from 'react';
import uuidv4 from 'uuid/v4';

import { Button, SnackBar } from '~/components';
import { Fade } from '~/components/transitions';

export const Quotes = ({ user }) => {
  const [text, setText] = useState('');
  const [alert, setAlert] = useState(false);
  const onSubmit = () => async () => {
    if (text === '') return;
    const quoteId = uuidv4();
    const postId = uuidv4();

    const timestamp = +new Date();

    const quoteRef = window.firebase.database().ref(`quotes/${quoteId}`);
    const postRef = window.firebase.database().ref(`posts/${quoteId}`);

    try {
      await Promise.all([
        quoteRef.set({
          id: quoteId,
          text,
          timestamp,
          userId: user.claims.sub
        }),
        postRef.set({
          id: postId,
          refId: quoteId,
          timestamp,
          type: 'quote',
          userId: user.claims.sub
        })
      ]);
      setAlert('Quote successfully added.');
    } catch (err) {
      console.err(err);
      setAlert('Error: Unable to add quote.');
    }
  };

  return (
    <Fade show={true} appear>
      <div className="flex flex-col h-full w-full relative">
        <div className="flex flex-col h-full w-full px-4">
          <div className="text-xl font-bold py-5">Quotes</div>
          <div className="flex flex-col flex-grow h-full">
            <label
              className="block text-grey-darker text-sm font-bold pb-2"
              htmlFor="username"
            >
              Text
            </label>
            <textarea
              className="resize-none shadow appearance-none border rounded w-full h-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
              onChange={event => setText(event.target.value)}
              id="username"
              type="text"
              placeholder="Enter quote text here"
            />
          </div>

          <div className="flex justify-end w-full py-3">
            <div>
              <Button
                onClick={onSubmit()}
                color="primary"
                hoverColor="primary-dark"
                dark="true"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
        <SnackBar
          show={!!alert}
          text="Upload Successful"
          action={() => setAlert(false)}
          actionText="Dismiss"
        />
      </div>
    </Fade>
  );
};
