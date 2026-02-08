// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDv2woDm2HxPssfWSp3y5sGpSpPLs3GZog",
  authDomain: "reading-site-69b33.firebaseapp.com",
  projectId: "reading-site-69b33",
  storageBucket: "reading-site-69b33.firebasestorage.app",
  messagingSenderId: "1838115608",
  appId: "1:1838115608:web:03c1ba38ea9a010ac04c6d"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("firebase connect")
const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();

export { auth, googleProvider, facebookProvider, twitterProvider };
