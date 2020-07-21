import firebase from 'firebase/app'
import Key from './key.json'

if (!firebase.apps.length) firebase.initializeApp(Key)
export default firebase
