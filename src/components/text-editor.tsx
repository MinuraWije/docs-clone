import ReactQuill from "react-quill";
import {useEffect, useRef, useState} from "react";
import {setDoc, doc, getDoc, onSnapshot} from 'firebase/firestore';
import {db} from '../firebase-config.ts';
import 'react-quill/dist/quill.snow.css';
import "../App.css";


export const TextEditor = () => {
    const quillRef = useRef<any>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const isLocalChange = useRef(false);

    const documentationRef = doc(db, "documents", "sample-doc");

    const saveContent = () => {
        if(quillRef.current && isLocalChange.current) {
            const content = quillRef.current.getEditor().getContents();
            console.log("Saving content to DB: ", content);

            setDoc(documentationRef, {content: content.ops}, {merge: true})
                .then(() => console.log("Content saved")
                ).catch(console.error);

            isLocalChange.current = false;
        }
    };

    useEffect(() => {
        if(quillRef.current){
            //Load initial content from Firestore DB

            getDoc(documentationRef).then((docSnap) => {
                if(docSnap.exists()){
                    const savedContent = docSnap.data().content;

                    if(savedContent){
                        quillRef.current.getEditor().setContents(savedContent);
                    }
                }else{
                    console.log("No doc found, starting with an empty editor.");
                }
            }).catch(console.error);


            //Listen to firestore for any updates and update locally in real-time

            const unsubscribe =  onSnapshot(documentationRef, (snapshot) => {
                if(snapshot.exists()){
                    const newContent = snapshot.data().content;

                    if(!isEditing){
                        const editor = quillRef.current.getEditor();
                        const currentCursorPosition = editor.getSelection()?.index || 0;
                    }
                }
            });


            //Listen for local text changes and save it to firestore

            const editor = quillRef.current.getEditor();
            editor.on("text-change", (_delta:any , _oldDelta:any,source:any) => {
                if(source === "user"){
                    isLocalChange.current = true;
                    setIsEditing(true);

                    saveContent();

                    setTimeout(() => setIsEditing(false), 5000);

                }
            })
        }
    }, []);

    return (
        <div className="google-docs-editor">
            <ReactQuill ref={quillRef}/>
        </div>
    )
}