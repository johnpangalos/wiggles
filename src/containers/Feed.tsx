import React, { useEffect, useCallback, memo, CSSProperties } from "react";
import { useDispatch, useMappedState } from "redux-react-hook";
import { Button } from "../components";
import { addPosts, addImages } from "../actions";
import { PostWrapper } from "./PostWrapper";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Post } from "@/types";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const firestoreToObject = ({ docs }: any) => {
  const obj: any = {};
  docs.forEach((doc: any) => {
    obj[doc.data().id as string] = doc.data();
  });
  return obj;
};

const ListItem = memo(
  ({
    data,
    index,
    style,
  }: {
    data: any;
    index: number;
    style: CSSProperties;
  }) => {
    const post = data[index];
    return (
      <div style={style}>
        <PostWrapper key={post.id} post={post} />
      </div>
    );
  }
);

export const Feed = () => {
  const mapState = useCallback(
    (state) => ({
      posts: Object.values(state.posts as Record<string, Post>).sort(
        (a, b) => (Number(a.timestamp) - Number(b.timestamp)) * -1
      ),
      images: state.images,
    }),
    []
  );
  const dispatch = useDispatch();
  const { posts } = useMappedState(mapState);

  useEffect(() => {
    let didCancel = false;

    const fetchPosts = async () => {
      const collections = ["posts", "images"];
      const db = getFirestore();
      const [posts, images] = await Promise.all(
        collections.map((name) => getDocs(collection(db, name)))
      );
      if (!didCancel) {
        dispatch(addPosts(firestoreToObject(posts)));
        dispatch(addImages(firestoreToObject(images)));
      }
    };

    fetchPosts();
    return () => {
      didCancel = true;
    };
  }, [dispatch]);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="w-full flex p-2">
        <div className="flex-grow" />
        <Button
          onClick={(e) => {
            e.preventDefault();
            window.location.reload();
          }}
        >
          Refresh
        </Button>
      </div>

      <div className="pt-2 w-full flex-grow">
        {posts && (
          <AutoSizer>
            {({ height, width }) => (
              <List
                itemData={posts}
                height={height}
                width={width}
                itemCount={posts.length}
                itemSize={() => 520}
                overscanCount={3}
              >
                {ListItem}
              </List>
            )}
          </AutoSizer>
        )}
      </div>
    </div>
  );
};
