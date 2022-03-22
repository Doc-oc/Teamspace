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

  const dbFiles = db.ref(`boards/${boardID}/filespace/${id}/files`)

  const userID = auth.currentUser.uid;

  const fetchFile = (url) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'text';
    xhr.onload = (event) => {
      setFileText(xhr.responseText);
    };
    xhr.open('GET', url);
    xhr.send();
  }


  useEffect(() => {
    dbFiles.on("value", (snapshot)=>{
        const fileDB = snapshot.val();
        const fileArray = [];
        for(let id in fileDB){
            fileArray.push({id, ...fileDB[id]});
        }        
        setFileData(fileArray)
    });
  }, [])

  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  useEffect(() => {

  }, [])

  useEffect(() => {
    if(socket == null || quill == null) return

    socket.once("load-document", document => {
      quill.setContents (document)
      quill.enable()
    })

    socket.emit('get-document', fileID)

    
  }, [socket, quill, fileID])

  useEffect(() => {
    if(socket==null || quill == null) return 

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents())
    }, SAVE_INTERVAL_MS)
  }, [socket, quill])


  useEffect(() => {
    const s = io("http://localhost:8080")
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])

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
      q.setText('Loading...')
      setQuill(q)
  }, [])

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
