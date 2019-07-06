export const accountData = async user => {
  const account = await window.db
    .collection('accounts')
    .doc(user.claims.sub)
    .get();
  return account.data();
};

export const imageByUserSub = async (id, callback) => {
  const imagesRef = window.db.collection('posts');
  const images = await imagesRef.where('userId', '==', id).get();
  callback(
    images.docs.reduce(
      (acc, curr) => ({ ...acc, [curr.data().id]: curr.data() }),
      {}
    )
  );
};

const deleteImage = id => {
  return window.db
    .collection('posts')
    .doc(id)
    .delete();
};

export const deleteImages = ids => Promise.all(ids.map(id => deleteImage(id)));
