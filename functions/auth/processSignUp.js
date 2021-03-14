const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.processSignUp = functions.auth.user().onCreate(async user => {
  const db = admin.firestore();

  const allowedEmailsRef = await db.collection('allowed-emails').get();
  const emailWhitelist = allowedEmailsRef.docs.map(item => item.data().email)

  const emailInWhiteList = ({ email, emailVerified }) =>
    email && emailWhitelist.includes(email) && emailVerified;

  if (!user) return console.log("User does not exist, exiting early.");
  if (!emailInWhiteList(user)) {
    await admin.auth().deleteUser(user.uid);
    console.log(`${user.email} not in whitelist, exiting early.`);
    return;
  }
  const customClaims = { authorized: true };
  try {
    console.log("Email in whitelist, creating account.");
    const accountRef = db.collection('accounts').doc(user.uid);
    await accountRef.set({
      id: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    });

    console.log("Adding custom claims.");
    await admin.auth().setCustomUserClaims(user.uid, customClaims);
    const metadataRef = db.collection("metadata").doc(user.uid);
    await metadataRef.set({ refreshTime: new Date().getTime() });
    return;
  } catch (error) {
    console.log(error);
  }
});
