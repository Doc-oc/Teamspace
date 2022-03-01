import firebase from "firebase/compat/app"
import "firebase/compat/auth";
import "firebase/compat/database"

const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: "1:166500978414:web:297823319288eb0ce9edff",
    measurementId: "G-BPJFH3RB84"
});

const db = firebase.database();
export const auth = app.auth()
export default db;