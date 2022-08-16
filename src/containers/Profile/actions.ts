export const accountData = async (user: any) => {
  const account = await window.db
    .collection("accounts")
    .doc(user.claims.sub)
    .get();
  return account.data();
};

export const imageByUserSub = async (
  id: string,
  callback: (params: any) => void
) => {
  const imagesRef = window.db.collection("posts");
  const images = await imagesRef.where("userId", "==", id).get();
  callback(
    images.docs.reduce(
      (acc: any, curr: any) => ({ ...acc, [curr.data().id]: curr.data() }),
      {}
    )
  );
};

const deleteImage = (id: string) => {
  return window.db.collection("posts").doc(id).delete();
};

export const deleteImages = (ids: string[]) =>
  Promise.all(ids.map((id) => deleteImage(id)));
