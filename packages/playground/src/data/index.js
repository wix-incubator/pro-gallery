import firebase from 'firebase';

var firebaseConfig = {
  apiKey: 'AIzaSyBZeE7IHYVBRuL4fqpVvJYOSjjDwiYwtIE',
  authDomain: 'progallery-playground.firebaseapp.com',
  projectId: 'progallery-playground',
  storageBucket: 'progallery-playground.appspot.com',
  messagingSenderId: '4858526434',
  appId: '1:4858526434:web:8cf532cad96bc75bb7fcbb',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

export async function getAll() {
  const snapshot = await db.collection('links').get()
  return snapshot.docs.map(doc => doc.data());
}

export async function save({url, description}) {
  return db.collection('links').add({url, description});
}