const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.onPostDelete = functions.firestore
  .document("/post/{postId}")
  .onDelete(async snap => {
    const db = admin.firestore();
    const post = snap.data();
    if (post.type === 'image') {
      await db.collection('images').doc(post.refId).delete();
      return;
    }
    if (post.type === 'quote') {
      await db.collection('quote').doc(post.refId).delete();
      return
    }
  });
