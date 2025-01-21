import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDko-Cub12O_IwDrXIRw48lYivVegV9rxo",
  authDomain: "chat-with-pdf-saas-46b5c.firebaseapp.com",
  projectId: "chat-with-pdf-saas-46b5c",
  storageBucket: "chat-with-pdf-saas-46b5c.firebasestorage.app",
  messagingSenderId: "949057464617",
  appId: "1:949057464617:web:f8290432a0744cd003ef38",
  measurementId: "G-9FPGD3VTG1"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
