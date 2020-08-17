import * as firebase from 'firebase'

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: 'AIzaSyCD5Kkbez6T-5BZMHzKT-_zfZ_OoDvU93U',
  authDomain: 'parcelking-7b8f5.firebaseapp.com',
  databaseURL: 'https://parcelking-7b8f5.firebaseio.com',
  projectId: 'parcelking-7b8f5',
  storageBucket: 'parcelking-7b8f5.appspot.com',
  messagingSenderId: '681803109815',
  appId: '1:681803109815:web:97d3217985ea8dd0634432'
}
firebase.initializeApp(firebaseConfig)


export default firebase;