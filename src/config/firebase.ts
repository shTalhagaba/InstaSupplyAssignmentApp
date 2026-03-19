import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

// Note: Ensure google-services.json (Android) and GoogleService-Info.plist (iOS) 
// are added to the respective native folders for this to work.

const db = firestore();
const firebaseAuth = auth();
const fcm = messaging();

export { firebase, firebaseAuth, db, fcm };
