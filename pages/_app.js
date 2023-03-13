import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase'
import { collection, getDocs, addDoc, 
  setDoc, doc, Timestamp } from "firebase/firestore"
import Login from './login'
import Loading from '../components/Loading'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  const [user, loading, error] = useAuthState(auth)

   useEffect(() => {
    if(user) {
     setDoc(
        doc(db, 'users', user.uid),
        {
          email: user.email,
          photoURL: user.photoURL,
          displayName: user.displayName,
          lastSeen: Timestamp.fromDate(new Date()),
        },
        { merge: true }
      )
    }
  }, [user])

  //if(loading) return <Loading/> 
  if(!user) return <Login />

  return <Component {...pageProps} />
}