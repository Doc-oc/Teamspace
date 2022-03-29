import React, { useState, useEffect, useCallback } from 'react'
import ReactQuill from 'react-quill';
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';
import {Container, Button} from 'react-bootstrap';
import { useParams, useLocation } from 'react-router';
import Filespace from './Filespace'
import db from '../firebase'
import { firebase, auth, logout, storage } from '../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import '../texteditor.css'
import { io } from 'socket.io-client'

const SAVE_INTERVAL_MS = 2000
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
]

export default function TextEditor(props){
  const { boardID, id, fileID } = useParams();
  const [fileData, setFileData] = useState();
  const [fileText, setFileText] = useState();
  const [fileContent, setFileContent] = useState()
  const uid = auth.currentUser.uid;

  const dbFiles = db.ref(`users/${uid}/boards/${boardID}/filespace/${id}/files`)

  const userID = auth.currentUser.uid;

  /*const storeFile = async (file) => {
    const fileRef = db.ref(`boards/${boardID}/filespace/${id}/files`)
    const id = fileRef.id;
    const storageRef = firebase.storage().ref().child('files/' + id)
    await storageRef.put(file)
  }

  const updateFile = async (id, file) => {
      const storageRef = firebase.storage().ref('/files').child(id);
      // Put the new file in the same child ref.
      await storageRef.put(file);
      // Get the new URL
      const url = await storageRef.getDownloadURL();
      console.log(url);
      return url;
  }*/


  useEffect(() => {
    dbFiles.on("value", (snapshot)=>{
        const fileDB = snapshot.val();
        const fileArray = [];
        for(let id in fileDB){
            fileArray.push({id, ...fileDB[id]});
        }        
        setFileData(fileArray)
        fileArray.map(function(f){
          if(f.id == fileID)
            setFileContent(f.fileData)
        })
    });
  }, [])

  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  const files = {board: boardID, filespace: id, file: fileID}

  //loading document
  useEffect(() => {
    if(socket == null || quill == null) return

    socket.once("load-document", () => {
      quill.setText(fileContent)
      quill.enable()
    })

    socket.emit('get-document', files.file)

    
  }, [socket, quill, files])

  //save document 
  useEffect(() => {
    if(socket==null || quill == null) return 

    /*const interval = setInterval(() => {
      //socket.emit("save-document", quill.getContents())
    }, SAVE_INTERVAL_MS)*/
  }, [socket, quill])


  //connection to socket
  useEffect(() => {
    const s = io("http://localhost:8080")
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])

  //text editor
  const wrapperRef = useCallback((wrapper) => {
    if(wrapper == null) return
    wrapper.innerHTML = ''

    const editor = document.createElement("div")
    wrapper.append(editor)
    const q = new Quill(editor, {
       theme: "snow", 
       modules: {toolbar: TOOLBAR_OPTIONS}
      })
      q.disable(false)
      q.setText("Loading...")
      setQuill(q)
  }, [])

  //broadcasting changes
  useEffect(() => {
    if(socket == null || quill == null) return 
    const handler = (delta, oldDelta, source) =>{
      if(source !== 'user') return
      socket.emit("send-changes", delta)
    }

    quill.on('text-change', handler)

    return () => {
      quill.off('text-change', handler )
    }
  }, [socket, quill])

  useEffect(() => {
    if(socket == null || quill == null) return 
    const handler = (delta, oldDelta, source) =>{
      quill.updateContents(delta)
    }

    socket.on('recieve-changes', handler)

    return () => {
      socket.off('recieve-changes', handler )
    }
  }, [socket, quill])




    return (
      <Container>
          {fileData == null? <p>No file Present</p>:
            fileData.map(function(file){
              if(fileID == file.id)
              return (
                <div id="textEditor">
                  <h5 style={{textAlign: "center", padding: "10px"}}>{file.fileName}</h5>
                </div>
              )
            })
          }
        <div className="container" ref={wrapperRef}>
        </div>
        </Container>
    )

}
