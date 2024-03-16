import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyBDPVeWyaAQ5-2kzSsz0Nm72jMKt1cfUXw',
  authDomain: 'schoolsync-3d8e6.firebaseapp.com',
  projectId: 'schoolsync-3d8e6',
  storageBucket: 'schoolsync-3d8e6.appspot.com',
  messagingSenderId: '893603407536',
  appId: '1:893603407536:web:c67716cf2c8d279e8b7d75',
  measurementId: 'G-PBRQZLKSYF',
}

// eslint-disable-next-line import/prefer-default-export
export const app = initializeApp(firebaseConfig)
