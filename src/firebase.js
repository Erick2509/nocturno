import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
const firebaseConfig={apiKey:'AIzaSyDILnVs1fC7UGhnra0CUyPxReiFLShNrE8',authDomain:'nocturno-8fed4.firebaseapp.com',projectId:'nocturno-8fed4',storageBucket:'nocturno-8fed4.firebasestorage.app',messagingSenderId:'950521652756',appId:'1:950521652756:web:e8b59429ea84a07e902901'};
export const app=initializeApp(firebaseConfig);export const auth=getAuth(app);export const db=getFirestore(app);
