export const accountData = async user => {
  const accountRef = window.firebase
    .database()
    .ref(`accounts/${user.claims.sub}`);
  const accountSnap = await accountRef.once('value');
  return accountSnap.val();
};

export const imageByUserSub = (id, callback) => {
  const imageRef = window.firebase.database().ref(`images/`);
  return imageRef
    .orderByChild('userId')
    .equalTo(id)
    .on('value', callback);
};

const deleteImage = id => {
  const imageRef = window.firebase.database().ref(`images/${id}`);
  return imageRef.remove();
};

export const deleteImages = ids => Promise.all(ids.map(id => deleteImage(id)));
