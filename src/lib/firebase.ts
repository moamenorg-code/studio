import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  "projectId": "quickserve-lite-29vms",
  "appId": "1:907702507941:web:7671fae8fe467b755fb04c",
  "storageBucket": "quickserve-lite-29vms.firebasestorage.app",
  "apiKey": "AIzaSyCKjl7xjLCCUHTbYlA5249L--OFPTuvclo",
  "authDomain": "quickserve-lite-29vms.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "907702507941"
};


// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

try {
    enableIndexedDbPersistence(db)
        .catch((err) => {
            if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a time.
            console.warn('Firebase persistence failed: multiple tabs open.');
            } else if (err.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            console.warn('Firebase persistence is not supported in this browser.');
            }
        });
} catch(e) {
    console.error(e)
}


export { app, auth, db, storage };
