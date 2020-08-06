import Key from './Keys.json'
import firebase from 'firebase/app'

// EVITAR MAS DE UNA INSTANCIA
if (!firebase.apps.length) firebase.initializeApp(Key)

// EXPORTAR
export default firebase
