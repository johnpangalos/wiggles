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
    webUrl: string;
  };
  refId: string;
  timestamp: string;
  type: string;
  userId: string;
};
