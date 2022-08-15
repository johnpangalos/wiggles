export type Account = {
  displayName: string;
  email: string;
  id: string;
  photoURL: string;
};

export type Image = {
  contentType: string;
  id: string;
  path: string;
  status: string;
  thumbnail: string;
  timestamp: string;
  uploadFinished: boolean;
  userId: string;
  web: string;
};

export type Post = {
  id: string;
  media: {
    contentType: string;
    id: string;
    path: string;
    status: string;
    thumbnail: string;
    timestamp: string;
    uploadFinished: boolean;
    userId: string;
    web: string;
  };
  refId: string;
  timestamp: string;
  type: string;
  userId: string;
};

export type Quote = {
  id: string;
  text: string;
  timestamp: string;
  userId: string;
};
