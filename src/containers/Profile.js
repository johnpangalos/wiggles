import React, { useState, useEffect } from 'react';
import { ProfileImage, Image, Loading, Button } from '~/components';
import { SlideUp } from '~/components/transitions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export const Profile = ({ signOut, user }) => {
  const [account, setAccount] = useState({});
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({});

  const handleClick = id => {
    if (!selected[id]) return setSelected({ ...selected, [id]: true });
    return setSelected({ ...selected, [id]: false });
  };

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
      <ImageSelectedBar selected={selected} setSelected={setSelected} />
    </div>
  );
};

const Thumbnails = ({ loading, images, selected, handleClick }) => {
  return (
    <div className="flex flex-col h-full py-5">
      <div className="text-xl font-bold pb-2">Images</div>
      {loading && (
        <div className="flex h-full items-center justify-center">
          <Loading />
        </div>
      )}
      {!loading && (
        <div className="flex flex-wrap">
          {Object.values(images)
            .filter(image => image.uploadFinished)
            .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
            .map((image, index) => {
              let paddingClass = 'px-2';
              if ((index + 1) % 3 === 1) paddingClass = 'pr-2';
              if ((index + 1) % 3 === 0) paddingClass = 'pl-2';
              return (
                <div key={image.id} className={`w-1/3 ${paddingClass}`}>
                  <Image
                    handleClick={() => handleClick(image.id)}
                    selectable={true}
                    selected={selected[image.id]}
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
  );
};

const ImageSelectedBar = ({ selected, setSelected }) => {
  const [loading, setLoading] = useState(false);
  const numImages = Object.values(selected).filter(item => item).length;

  const deleteImages = async () => {
    setLoading(true);
    try {
      await Promise.all(
        Object.keys(selected)
          .filter(id => selected[id])
          .map(id => deleteImage(id))
      );
      setSelected({});
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <SlideUp height="60px" show={numImages > 0} appear>
        <div className="w-full h-full bg-red-light text-white">
          {loading ? (
            <div className="flex items-center w-full h-full">Loading...</div>
          ) : (
            <div className="flex items-center w-full h-full">
              <div className="flex-grow pl-4">{numImages} Images Selected</div>
              <div className="pr-4">
                <FontAwesomeIcon
                  role="button"
                  className={`text-2xl fill-current text`}
                  icon={faTrash}
                  onClick={() => deleteImages()}
                />
              </div>
            </div>
          )}
        </div>
      </SlideUp>
    </div>
  );
};

const deleteImage = id => {
  const imageRef = window.firebase.database().ref(`images/${id}`);
  return imageRef.remove();
};
