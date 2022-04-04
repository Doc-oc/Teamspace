import React, { useState, useEffect, useCallback } from 'react'
import ReactQuill from 'react-quill';
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';
import {Container, Button, Col, Row} from 'react-bootstrap';
import { useParams, useLocation} from 'react-router';
import { Link } from "react-router-dom"

import Filespace from './Filespace'
import db from '../firebase'
import { firebase, auth, logout, storage } from '../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { faSave, faWindowClose, faArrowAltCircleLeft} from '@fortawesome/fontawesome-free-solid'

import '../texteditor.css'
import { io } from 'socket.io-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SAVE_INTERVAL_MS = 5000
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

  const dbFiles = db.ref(`boards/${boardID}/filespace/${id}/files`)

  const userID = auth.currentUser.uid;
  const name = auth.currentUser.displayName;
  const [message, setMessage] = useState()

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

  const files = {board: boardID, filespace: id, file: fileID, name: name}

  //connection to socket
  useEffect(() => {
    const s = io("http://localhost:8080")
    setSocket(s)
  
    return () => {
      s.disconnect()
    }
  }, [])
  
  //const message = `${name} has joined!`
  //loading document
  useEffect(() => {
    if(socket == null || quill == null) return

    socket.once("load-document", () => {

      if(typeof(fileContent) == "string")
      {
        quill.setText(fileContent)
      } else {
        quill.setContents(fileContent)
      }
      quill.enable()
      
    })

    socket.emit('get-document', files)

    /*socket.emit('joinedUser', `${name} is here!` );

    socket.on('recieve-joined', function(data){
      setMessage(data)
      document.getElementById("joinedContainer").style.visibility = "visible"
    })*/

    
  }, [socket, quill, files])

  function saveFile(){
    socket.emit("save-document", quill.getContents())
  }

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

  function hideJoin(){
    document.getElementById("joinedContainer").style.visibility = "visible"

  }

    return (
      <Container>
          {fileData == null? <p>No file Present</p>:
            fileData.map(function(file){
              if(fileID == file.id)
              return (
                <div id="textEditor">
                  <div className="shadow rounded text-center" id="joinedContainer" style={{visibility: "hidden"}}>
                    <span id="xButton" onClick={() => hideJoin()}style={{float: "right", top: 0}}>x</span>
                    <p id="joinedMessage">{message} </p>
                  </div>
                  <Row className="text-center" style={{marginTop: "20px"}}>
                    <Col className="col-sm-1">
                      <Link to={{pathname: `/filespace/${boardID}/${id}`, state: {boardID: boardID, id: id}}}  style={{textDecoration: 'none', color: "black"}}>
                        <p className="shadow rounded" id="backToButton"><FontAwesomeIcon icon={faArrowAltCircleLeft}/> Teamspace</p>
                        </Link>
                    </Col>
                    <Col className="col-sm-9">
                      <h5 style={{textAlign: "center", padding: "10px"}}>{file.fileName}</h5>
                    </Col>
                    <Col className="col-sm-1" style={{marginLeft: "80px"}}>
                      <Button className="shadow" id="textButtons" onClick={() => saveFile()}><FontAwesomeIcon icon={faSave}/> Save</Button>
                    </Col>
                  </Row>
                </div>
              )
            })
          }
        <div className="container" ref={wrapperRef}>
        </div>
        </Container>
    )

}
