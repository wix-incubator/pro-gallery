import firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyBgUOru_pID5v9t779i1mxBLgB1rrhyDLY",
  authDomain: "progallery-community-project.firebaseapp.com",
  projectId: "progallery-community-project",
  storageBucket: "progallery-community-project.appspot.com",
  messagingSenderId: "407176837125",
  appId: "1:407176837125:web:454aa88529cc69c642446c",
  measurementId: "G-J9PW6ZQX66"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

export async function getAll() {
  const snapshot = await db.collection('links').get()
  return snapshot.docs.map(doc => doc.data());
}

export async function save({url, description, title, tags}) {
  return db.collection('links').add({url, description, title, tags});
}
