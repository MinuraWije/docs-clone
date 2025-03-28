import './App.css'
import {auth} from './firebase-config.ts';
import {signInAnonymously, onAuthStateChanged} from "firebase/auth";
import {useEffect} from "react";
import {TextEditor} from "./components/text-editor.tsx";

function App() {

    useEffect(() => {
        signInAnonymously(auth);
        onAuthStateChanged(auth, user => {
            if(user) {
                console.log("User signed in : ", user.uid);
            }
        });
    }, [])

  return (
    <div className="App">
        <header>
            <h1>Google Docs Clone</h1>
        </header>

        <TextEditor/>
    </div>
  )
}

export default App
