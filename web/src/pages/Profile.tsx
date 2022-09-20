// import React, { Fragment, useEffect, useState } from "react";
// import { useVirtualizer } from "@tanstack/react-virtual";
// import { Post as PostType } from "@/types";
// import { Button, Image, Loading, Post } from "@/components";
// import {
//   useInfinitePosts,
//   infinitePostsQueryKey,
//   useBreakpoint,
//   useAuth,
// } from "@/hooks";
// import { deleteDoc, doc, getFirestore } from "firebase/firestore";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
//
// const deleteImage = async (id: string) => {
//   const db = getFirestore();
//   const post = doc(db, "posts", id);
//   return deleteDoc(post);
// };
//
// export const deleteImages = (ids: string[]) =>
//   Promise.all(ids.map((id) => deleteImage(id)));

export function Profile() {
  return <></>;
  // const [selectMode, setSelectMode] = useState(false);
  // const [selectedIds, setSelectedIds] = useState<Record<string, PostType>>({});
  // const { signOut } = useAuth();
  // const parent = React.useRef<HTMLDivElement>(null);
  //
  // const { status, data, isFetchingNextPage, fetchNextPage, hasNextPage } =
  //   useInfinitePosts({
  //     imageSize: "thumbnail",
  //     queryLimit: 30,
  //     scopeMyUser: true,
  //   });
  //
  // const queryClient = useQueryClient();
  // const queryKey = infinitePostsQueryKey({
  //   imageSize: "thumbnail",
  //   queryLimit: 30,
  //   scopeMyUser: true,
  // });
  // const { mutate, status: mutateStatus } = useMutation(
  //   (ids: string[]) => deleteImages(ids),
  //   {
  //     onSettled: () => {
  //       setSelectedIds({});
  //       setSelectMode(false);
  //       queryClient.invalidateQueries(queryKey);
  //     },
  //   }
  // );
  //
  // const postRows = data
  //   ? data.pages
  //       .flatMap((posts) => posts)
  //       .reduce<PostType[][]>((acc, curr, index) => {
  //         if (index % 3 === 0) {
  //           acc.push([curr]);
  //           return acc;
  //         }
  //         acc[acc.length - 1].push(curr);
  //         return acc;
  //       }, [])
  //   : [];
  //
  // const breakpoint = useBreakpoint();
  // const rowVirtualizer = useVirtualizer({
  //   count: hasNextPage ? postRows.length + 1 : postRows.length,
  //   getScrollElement: () => parent.current,
  //   estimateSize: () => (["xxs", "xs", "sm"].includes(breakpoint) ? 150 : 200),
  //   measureElement: () =>
  //     ["xxs", "xs", "sm"].includes(breakpoint) ? 150 : 200,
  //   overscan: 5,
  // });
  //
  // useEffect(() => {
  //   function handleResize() {
  //     rowVirtualizer.measure();
  //   }
  //   window.addEventListener("resize", handleResize);
  //   handleResize();
  //   return () => window.removeEventListener("resize", handleResize);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [status]);
  //
  // useEffect(
  //   () => {
  //     const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
  //
  //     if (!lastItem) {
  //       return;
  //     }
  //
  //     if (
  //       lastItem.index >= postRows.length - 1 &&
  //       hasNextPage &&
  //       !isFetchingNextPage
  //     )
  //       fetchNextPage();
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [
  //     hasNextPage,
  //     fetchNextPage,
  //     postRows?.length,
  //     isFetchingNextPage,
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //     JSON.stringify(rowVirtualizer.getVirtualItems()),
  //   ]
  // );
  //
  // if (status === "loading") return <Loading />;
  // return (
  //   <div className="h-full px-6 flex flex-col">
  //     <div>
  //       <div className="m-auto md:max-w-xl py-4 h-16">
  //         {selectMode ? (
  //           <>
  //             {mutateStatus === "loading" ? (
  //               "Loading..."
  //             ) : (
  //               <div className="flex items-center">
  //                 <div className="flex-1 font-bold text-lg">
  //                   <>
  //                     Delete {Object.values(selectedIds).length}{" "}
  //                     {Object.values(selectedIds).length === 1
  //                       ? "photo"
  //                       : "photos"}
  //                   </>
  //                 </div>
  //
  //                 <div className="space-x-2">
  //                   <Button
  //                     onClick={() => {
  //                       mutate(Object.keys(selectedIds));
  //                     }}
  //                     variant="primary"
  //                   >
  //                     Delete
  //                   </Button>
  //                   <Button
  //                     variant="secondary"
  //                     onClick={() => {
  //                       setSelectMode(false);
  //                       setSelectedIds({});
  //                     }}
  //                   >
  //                     Cancel
  //                   </Button>
  //                 </div>
  //               </div>
  //             )}
  //           </>
  //         ) : (
  //           <div className="flex justify-end items-center">
  //             <Button onClick={() => setSelectMode(true)} variant="link">
  //               Select
  //             </Button>
  //             <Button onClick={() => signOut()} variant="link">
  //               Logout
  //             </Button>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //     <div ref={parent} className="overflow-auto">
  //       <div
  //         className="flex justify-center pt-2 w-full flex-grow relative"
  //         style={{
  //           height: `${rowVirtualizer.getTotalSize()}px`,
  //         }}
  //       >
  //         {postRows.length > 0 &&
  //           rowVirtualizer.getVirtualItems().map((virtualItem) => {
  //             const row = postRows[virtualItem.index];
  //             if (row === undefined) return <Fragment key={virtualItem.key} />;
  //
  //             const isLoaderRow = virtualItem.index > postRows.length - 1;
  //             if (isLoaderRow) return <>Loading more...</>;
  //
  //             return (
  //               <div
  //                 className="absolute top-0 space-x-3 flex md:max-w-xl w-full"
  //                 key={`${virtualItem.key}`}
  //                 style={{
  //                   height: `${virtualItem.size}px`,
  //                   transform: `translateY(${virtualItem.start}px)`,
  //                 }}
  //               >
  //                 {row.map((post, index) => {
  //                   return (
  //                     <div
  //                       key={`${virtualItem.key}-${index}`}
  //                       className="w-1/3"
  //                       style={{
  //                         height: `${virtualItem.size}px`,
  //                       }}
  //                     >
  //                       <Post
  //                         id={post.refId}
  //                         timestamp={post.timestamp}
  //                         thumbnail={true}
  //                         selectable={selectMode}
  //                         handleClick={() => {
  //                           if (selectedIds[post.id] !== undefined) {
  //                             const cloneSelectedIds = { ...selectedIds };
  //                             delete cloneSelectedIds[post.id];
  //                             setSelectedIds(cloneSelectedIds);
  //                             return;
  //                           }
  //                           setSelectedIds({ ...selectedIds, [post.id]: post });
  //                         }}
  //                         selected={selectedIds[post.id] !== undefined}
  //                       >
  //                         <Image post={post} thumbnail={true} />
  //                       </Post>
  //                     </div>
  //                   );
  //                 })}
  //               </div>
  //             );
  //           })}
  //       </div>
  //     </div>
  //   </div>
  // );
}
