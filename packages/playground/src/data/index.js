import firebase from 'firebase';

var firebaseConfig = {
  apiKey: 'AIzaSyBgUOru_pID5v9t779i1mxBLgB1rrhyDLY',
  authDomain: 'progallery-community-project.firebaseapp.com',
  projectId: 'progallery-community-project',
  storageBucket: 'progallery-community-project.appspot.com',
  messagingSenderId: '407176837125',
  appId: '1:407176837125:web:454aa88529cc69c642446c',
  measurementId: 'G-J9PW6ZQX66',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const collection = db.collection('links');

export async function getAll() {
  const snapshot = await db.collection('links').get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export function save({ url, description, title, tags }) {
  return collection.add({ url, description, title, tags });
}

export function like(item) {
  return collection.doc(item.id).update(item);
}
