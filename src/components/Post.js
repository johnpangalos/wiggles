import React, { useState, useEffect, useCallback } from 'react';
import { useMappedState } from 'redux-react-hook';
import { ProfileImage } from '../components';
import { Fade } from '../components/transitions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

export const Post = ({
  children,
  timestamp = 0,
  size,
  selected = false,
  selectable = false,
  handleClick = () => null,
  account,
  id
}) => {
  const [url, setUrl] = useState('');
  const date = new Date(Number(timestamp));
  const mapState = useCallback(
    state => ({
      image: state.images[id]
    }),
    [id]
  );

  const { image } = useMappedState(mapState);
  useEffect(() => {
    const load = async () => {
      const storage = window.firebase.storage();
      setUrl(await storage.ref(image.path).getDownloadURL());
    };
    if (image) {
      load();
    }
  }, [image]);

  const forceDownload = (blob, filename) => {
    var a = document.createElement('a');
    a.download = filename;
    a.href = blob;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const downloadResource = (url, filename) => {
    if (!filename)
      filename = url
        .split('\\')
        .pop()
        .split('/')
        .pop();
    fetch(url, {
      headers: new Headers({
        Origin: window.location.origin
      }),
      mode: 'cors'
    })
      .then(response => response.blob())
      .then(blob => {
        let blobUrl = window.URL.createObjectURL(blob);
        forceDownload(blobUrl, filename);
      })
      .catch(e => console.error(e));
  };

  return (
    <Fade show={true} appear>
      <div
        className={`
          flex flex-col bg-white shadow-md 
          rounded px-2 pt-3 pb-4 w-full xs:max-h-sm 
          sm:max-h-500 max-h-xs m-auto h-${size} max-w-${size}${
          selectable ? ' cursor-pointer' : ''
        }${selected ? ' border-purple-600 border-2' : ''}`}
      >
        <div
          className="flex flex-grow bg-gray-300 p-1 rounded justify-center items-center h-full"
          onClick={() => handleClick()}
        >
          {children}
        </div>
        {account && (
          <div className="flex pt-3 items-start">
            <div className="h-10 w-10">
              <ProfileImage url={account.photoURL} />
            </div>
            <div className="flex-grow pl-3">
              <div className="text-xl font-bold">{account.displayName}</div>
              <div className="text-sm">Uploaded: {date.toLocaleString()}</div>
            </div>
            {url && (
              <FontAwesomeIcon
                className="pb-1 self-center text-purple-600"
                size="2x"
                role="button"
                icon={faDownload}
                onClick={() => downloadResource(url)}
              />
            )}
          </div>
        )}
      </div>
    </Fade>
  );
};
