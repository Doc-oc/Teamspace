import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/storage";
//import { ref } from 'firebase/storage';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom"



const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: "1:166500978414:web:297823319288eb0ce9edff",
    measurementId: "G-BPJFH3RB84"
}

const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const dbAuth = app.firestore();
const db = firebase.database();

const signInWithEmailAndPassword = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await auth.createUserWithEmailAndPassword(email, password);
    const user = res.user;
    await dbAuth.collection("users").add({
      uid: user.uid,
      authProvider: "local",
      email,
    }).then(
    updateDisplayName(name));
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const updateDisplayName = async (name) => {
  const update = {
    displayName: name,
  };
  console.log(auth);
  await auth.currentUser.updateProfile(update);
  console.log("finished");
  window.location = ("/");
}

/*const sendPasswordResetEmail = async (email) => {
  try {
    await auth.sendPasswordResetEmail(email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};*/

const logout = () => {
  auth.signOut();
  window.location = ("/login");
};
export {
  auth,
  dbAuth,
  signInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
};

export default db;

