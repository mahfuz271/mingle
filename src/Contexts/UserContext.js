import React, { createContext, useEffect, useState } from 'react';
import { GithubAuthProvider, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import FirebaseApp from '../Firebase/Firebase.config';

export const AuthContext = createContext();
const auth = getAuth(FirebaseApp);

const UserContext = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [brands, setBrands] = useState([]);

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signInWithGoogle = () => {
        setLoading(true);
        const provider = new GoogleAuthProvider(auth);
        return signInWithPopup(auth, provider);
    }

    const updateUser = (name, photoURL) => {
        setLoading(true);
        return updateProfile(auth.currentUser, {
            displayName: name, photoURL: photoURL
        });
    }

    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    }

    const modal_close = () => {
        document.querySelector('.btn-close')?.click();
        document.querySelector(".modal-backdrop")?.remove("show");
        document.body.classList.remove("modal-open");
    }

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unSubscribe();

    }, [])

    const authInfo = { modal_close, user, loading, setLoading, createUser, updateUser, signIn, logOut, signInWithGoogle }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default UserContext;