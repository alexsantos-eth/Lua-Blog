import firebase from 'firebase/app'
import Key from './key.json'
import 'firebase/auth'

if (!firebase.apps.length) firebase.initializeApp(Key)
export default firebase