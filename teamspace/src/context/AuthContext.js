import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../firebase'

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext)
}

/*const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = authosignup(email,password)
      const user = res.user;
      await db.collection("users").add({
        uid: user.uid,
        authProvider: "local",
        email,
      }).then(
      updateDisplayName(name));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};*/

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    function signup(name, email, password){
        return auth.createUserWithEmailAndPassword(name,email, password)
    }

    function login(email, password){
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logout() {
        return auth.signOut()
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])
    

    const value = {
        currentUser,
        login,
        signup,
        logout
    }
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>)
  
}
