// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app'

export const firebaseConfigData = {
  // apiKey: process.env.FIREBASE_API_KEY,
  // appId: process.env.FIREBASE_APP_ID,
  // authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  // measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  // messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  // projectId: process.env.FIREBASE_PROJECT_ID,
  // storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  apiKey: 'AIzaSyARHyGjlOkat-vCNS58KKCuv8X0ozVMfo0',
  authDomain: 'stock-management-45d81.firebaseapp.com',
  projectId: 'stock-management-45d81',
  storageBucket: 'stock-management-45d81.firebasestorage.app',
  messagingSenderId: '373475270475',
  appId: '1:373475270475:web:fe9a4123e548c8217f52ce',
  measurementId: 'G-8BTFE1NXSF',
}

console.log({ firebaseConfigData })

// Initialize Firebase
let firebase_app = initializeApp(firebaseConfigData)

export default firebase_app
