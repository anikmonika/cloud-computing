// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDz8jQW3Sakya0ooJ_8nRTljzy9TOuFBzA",
    authDomain: "list-app-519dc.firebaseapp.com",
    databaseURL: "https://list-app-519dc-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "list-app-519dc",
    storageBucket: "list-app-519dc.appspot.com",
    messagingSenderId: "417968751161",
    appId: "1:417968751161:web:814285dde524b544cdc3e8",
    measurementId: "G-8Y2X08DXND"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
