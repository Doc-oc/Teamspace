import React, { useState, useEffect } from "react"
import {Button, Card, Form, Alert, Container, Navbar, Nav, Modal, Dropdown} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
//import { useAuth } from "../context/AuthContext"
import { useNavigate, Link, useParams } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSlidersH, faClipboard, faUser, faSignOutAlt, faTrash, faPlusCircle, faUpload } from '@fortawesome/fontawesome-free-solid'
import '../home.css'
import { firebase, auth, logout, storage } from '../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import db from '../firebase'
import '../filespace.css'
import TextEditor from './TextEditor'


export default function Filespace() {

    const { boardID, id } =  useParams();

    const IDs = {board: boardID, filespace: id}

    const [show, setShow] = useState(false);
    const [error, setError] = useState("")
    //const { currentUser, logout } = useAuth()
    const navigate = useNavigate()
    const name = auth.currentUser.displayName;
    const [modal, setModal] = useState(false);
    const [filespaceData, setFilespaceData] = useState();
    const [fileName, setFileName] = useState();
    const [fileData, setFileData] = useState();

    const dbFilespace = db.ref(`boards/${boardID}/filespace`)
    const dbFiles = db.ref(`boards/${boardID}/filespace/${id}/files`)

    const userID = auth.currentUser.uid;

    useEffect(() => {
        dbFilespace.on("value", (snapshot)=>{
            
            const filespaceDB = snapshot.val();
            const filespaceArray = [];
            for(let id in filespaceDB){
                filespaceArray.push({id, ...filespaceDB[id]});
            }        
            setFilespaceData(filespaceArray)

        });
    }, [])


  
    async function handleLogout(e) {
      e.preventDefault()
      
      setError("")
  
      try {
  
        await logout()
        navigate("/login")
      } catch {
       
        setError("Failed to log out")
      }

    }
    const handleUpload = (e) => {
        e.preventDefault();

        const file = e.target[0].files[0];
        
        uploadFile(file);
    };

    const uploadFile = (file) => {
        //
        if (!file) return;
        const storageRef = ref(storage, `files/${file.name}`);        
        const uploadTask = uploadBytesResumable(storageRef, file);
    
        uploadTask.on("state_changed",(snapshot) => {
            const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            //setProgress(prog);
            },
            (error) => console.log(error),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    databaseFile(downloadURL);
                    const xhr = new XMLHttpRequest();
                    xhr.open('GET', downloadURL);

                    xhr.responseType = '';
                    xhr.onload = (event) => {
                        if (xhr.readyState === xhr.DONE) {
                            if (xhr.status === 200) {
                                console.log(xhr.response);
                                console.log(xhr.responseText);
                            }
                        }
                    };
                    xhr.send();
                });
            }
        );
    };

    async function databaseFile(url){
        var httpsReference = storage.refFromURL(url);
        const fileName = httpsReference.name;
        const file = {
            fileName,
            fileURL: url,
        }
        await dbFiles.push(file);
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
        <Container fluid className="mt-3" style={{minHeight: "100vh"}}>
            <Row>  
            <Col className="col-sm-2">
                <Card className="shadow text-center" style={{minHeight: "600px", borderRadius: 15}}>
                <Card.Body>
                <Container>
                <h6 className="mb-5 mt-3" style={{color: "#4176FF"}}>Teamspace</h6>
                    <br></br>
                    <img src="#" className="img-responsive w-50 mt-5 roundedCircle"></img>
                    <br></br>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {name}
                    
                    <br></br>
                    <Nav className="col-md-12 d-none d-md-block mt-5 mb-5 sidebar text-center navbar-custom" activeKey="/home">
                    <div className="sidebar-sticky"></div>
                    <Nav.Item>
                    <Nav.Link eventKey="Profile"><FontAwesomeIcon icon={faUser}/> Profile</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/"><FontAwesomeIcon icon={faClipboard}/>  Boards</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="Settings"><FontAwesomeIcon icon={faSlidersH}/> Settings</Nav.Link>
                    </Nav.Item>
                        <Nav.Item>
                    </Nav.Item>
                    </Nav>
                </Container>
                </Card.Body>
                <div className="w-100 text-center mt-2">
                    <Button className="logout mb-2" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt}/> Log Out
                    </Button>
                </div>
            </Card> 
            </Col>
                
            <Col className="col-sm-7">
            <Card className="shadow" style={{minHeight: "600px", borderRadius: 15}}>
            <Card.Body>
                <Container>
                <Row className="">
                    <Col className="col-sm-2 mt-1 ">
                    {filespaceData == null? <p>FSDATA IS NULL</p> :
                    filespaceData.map(function(fs){
                        if(fs.id == id)
                        {
                            return (
                                <div id="filespaceHeader">
                                    <h5>{fs.filespaceName}</h5> 
                                    <p>{fs.filespaceDesc}</p>
                                </div>
                            )
                        }
                    })
                    }
                    </Col>
                </Row>


                <Row>
                    <Col className="col-sm-10 mt-4 mr-3">
                        <input className="form-control" type="text" placeholder="Search" aria-label="Search" />
                    </Col>
                    <Col className="col-sm-2">
                        <Dropdown>
                            <Dropdown.Toggle id="upload">
                                <FontAwesomeIcon icon={faPlusCircle}/> New
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setModal(true)}>Upload</Dropdown.Item>
                                <Dropdown.Item href="#">Create New</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
                
                <Modal size="md" show={modal} onHide={() => setModal(false)} aria-labelledby="uploadFile">
                  <Modal.Header closeButton>
                    <Modal.Title id="uploadFile">
                      Upload File
                    </Modal.Title>
                  </Modal.Header>
                  <Form onSubmit={handleUpload}>
                    <Modal.Body>
                        <Form.Group id="fileName">
                            <Form.Control type="file" required />
                        </Form.Group>
                    </Modal.Body>
                    
                    <Modal.Footer>
                        <Button type="submit">Upload File</Button>
                    </Modal.Footer>
                  </Form>
                </Modal>
                </Container>

                <Row>
                    {fileData == null? <p>There is no files</p>
                    : 
                        fileData.map(function(file){
                            return (
                                <Col className="col-sm-2 mt-3 ml-3">
                                <Card className="shadow text-center" style={{minHeight: "80px", maxWidth: "90px", borderRadius: 15, borderTopLeftRadius: 15, borderTopRightRadius: 15, fontSize: "12px"}}>
                                    <Card.Body style={{backgroundColor: "white", borderTopLeftRadius: 15, borderTopRightRadius: 15}}></Card.Body>
                                    <Link to={{pathname: `/texteditor/${boardID}/${id}/${file.id}`, state:{boardID: boardID, id: id, fileID: file.id}}}  style={{textDecoration: 'none', color: "black"}} style={{textDecoration: 'none', color: "black"}}>
                                        <Card.Footer>{file.fileName}</Card.Footer>
                                    </Link>
                                </Card>
                                </Col>
                            )
                        })
                    }
                    <p id="fileContent"></p>
                </Row>
            </Card.Body>
            </Card>
            <form action="../post" method="post" className="form">
                <button className="btn-primary rounded shadow" style={{backgroundColor: "#4176FF"}} type="submit">Connect to Server</button>
            </form>
            </Col>
                <Col className="col-sm-3">
                <Card className="shadow" style={{minHeight: "600px", borderRadius: 15}}>
                <Card.Body>
                    <p>Side Bar</p>
                </Card.Body>
                </Card>
                </Col>
            </Row>
        </Container>
    )
}

