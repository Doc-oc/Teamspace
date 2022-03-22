import React, { useState, useEffect } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {Container, Button} from 'react-bootstrap';
import { useParams, useLocation } from 'react-router';
import Filespace from '../components/Filespace'
import db from '../firebase'
import { firebase, auth, logout, storage } from '../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";



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

    return (
      <div>
        <Container className="ml-3 mt-" >
          {fileData == null? <p>No file Present</p>:
            fileData.map(function(file){
              if(fileID == file.id)
              return (
                <div id="textEditor">
                  <h5>{file.fileName}</h5>
                  <ReactQuill value={fileText} onLoad={fetchFile(file.fileURL)} theme="snow"/>
                  <Button></Button>
                </div>
              )
            })
          }
        </Container>
      </div>
    )

}
