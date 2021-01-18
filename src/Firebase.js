
  import firebase from 'firebase';
  
  const firebaseApp = firebase.initializeApp(
      {
        apiKey: "AIzaSyAht_AssYEJ2-LmOxElyULNgnyWU07NdF0",
        authDomain: "instagram-clone-b01b8.firebaseapp.com",
        projectId: "instagram-clone-b01b8",
        storageBucket: "instagram-clone-b01b8.appspot.com",
        messagingSenderId: "72310713492",
        appId: "1:72310713492:web:1fba859fed4fd9ce9fd881",
        measurementId: "G-CGW64QLNMC"
      }
  );

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db,auth,storage};