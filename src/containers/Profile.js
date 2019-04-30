import React, { useState, useEffect } from 'react';
import { ProfileImage, Image } from '~/components';

export const Profile = ({ signOut, user }) => {
  const [account, setAccount] = useState({});
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    const accountRef = window.firebase
      .database()
      .ref(`accounts/${user.claims.sub}`);

    const imageRef = window.firebase.database().ref(`images/`);

    accountRef.once('value', accountSnap => {
      const account = accountSnap.val();
      setAccount(account);

      imageRef
        .orderByChild('userId')
        .equalTo(account.id)
        .on('value', imagesSnap => {
          setImages({ ...images, ...imagesSnap.val() });
          setLoading(false);
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
    <div className="flex flex-col items-center justify-between h-full pb-16 max-w-lg m-auto">
      <div className="flex flex-col w-full p-4">
        <div className="flex w-full">
          <div className="pr-6">
            <div className="h-12 w-12">
              <ProfileImage url={account.photoURL} />
            </div>
          </div>

          <div className="flex flex-col pt-1">
            <div className="text-xl font-bold">{account.displayName}</div>
            <div className="text-sm">{account.email}</div>
          </div>
        </div>

        <div className="flex flex-col py-5">
          <div className="text-xl font-bold pb-3">Images</div>
          {loading && <div>Loading...</div>}
          {!loading && (
            <div className="flex flex-wrap">
              {Object.values(images).map((image, index) => {
                let paddingClass = 'px-2';
                if ((index + 1) % 3 === 1) paddingClass = 'pr-2';
                if ((index + 1) % 3 === 0) paddingClass = 'pl-2';
                return (
                  <div className={`w-1/3 ${paddingClass}`}>
                    <Image
                      key={image.id}
                      url={image.thumbnail}
                      index={index}
                      size="24"
                      lazyLoadStart={20}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="pb-3">
        <button
          className="bg-red hover:bg-red-dark text-white font-bold py-2 px-4 rounded"
          onClick={() => signOut()}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
