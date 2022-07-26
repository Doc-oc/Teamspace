import React, { useState, useEffect } from "react"
import {Button, Card, Form, Alert, Container, Navbar, Nav, Modal, Dropdown} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
//import { useAuth } from "../context/AuthContext"
import { useNavigate, Link, Navigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSlidersH, faClipboard, faUser, faSignOutAlt, faCog, faPlusCircle, faTrashAlt } from '@fortawesome/fontawesome-free-solid'
import '../styles/home.css'
import { auth, logout, storage} from '../firebase';
import db from '../firebase'
import boardData from './Board';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import Sidebar from "./SideBar"


export default function Home() {
  const [error, setError] = useState("")
  //const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const name = auth.currentUser.displayName;
  const [modal, setModal] = useState(false);
  const [boardName, setBoardName] = useState();
  const [boardDesc, setBoardDesc] = useState();
  const [boardColor, setBoardColor] = useState();
  const [boards, setBoards] = useState();
  const [url, setURL] = useState();
  const [members, setMembers] = useState();
  const [boardID, setBoardID] = useState();
  const [display, setDisplay] = useState({display: 'none'});


  const uid = auth.currentUser.uid;

  const dbRef = db.ref(`boards/`);

  async function handleCreateBoard(){
    setModal(false)
    console.log("function")
        const boards = {
            boardName,
            boardDesc,
            boardColor,
            createdBy: uid
        }
        await dbRef.push(boards);


        setBoardName('');
        setBoardDesc('');
        setBoardDesc('');
  }

  useEffect(() => {
    

    dbRef.on("value", (snapshot)=>{
      const boardsFromDatabase = snapshot.val();
      const boardArray = [];
      for(let id in boardsFromDatabase){
          boardArray.push({id, ...boardsFromDatabase[id]});
      }
      setBoards(boardArray);
    })


  }, [])


  async function deleteBoard(id){
    db.ref(`boards/${id}`).remove()
  }


  /*function handlePP(){
    const storageRef = ref(storage, `ProfilePictures/defaultpp.png`);        
        const uploadTask = uploadBytesResumable(storageRef, file);
    
        /*uploadTask.on("state_changed",(snapshot) => {
            const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            //setProgress(prog);
            },
            (error) => console.log(error),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  setURL(downloadURL)
                })
          })
  }*/
  

  return (
    <Container fluid className="mt-3" style={{minHeight: "100vh"}}>
        <Row>  
          <Col className="col-sm-2">
            <Sidebar></Sidebar>
        </Col>
            <Col className="col-sm-10">
            <Card className="shadow" style={{minHeight: "660px", borderRadius: 15}}>
              <Card.Body>
                <Container>
                  <Row className="">
                    <Col className="col-sm-2 mt-1 ">
                      <h4>Boards</h4>
                    </Col>
                    <Col className="col-sm-8 ">
                      <input type="search" placeholder="Search" className="form-control rounded" />
                    </Col>
                    <Col className="col-sm-2 ">
                      <Button className="logout shadow rounded" onClick={() => setModal(true)}>
                        <FontAwesomeIcon icon={faPlusCircle}/> New
                      </Button>
                    </Col>

                    {/*}<Col className="col-sm-2 ">
                      <Button className="logout shadow">
                        <FontAwesomeIcon icon={faTrash}/> Delete
                      </Button></Col>*/}
                    
                  </Row>
                </Container>

                <Modal size="lg" show={modal} onHide={() => setModal(false)} aria-labelledby="createBoard">
                  <Modal.Header closeButton>
                    <Modal.Title id="createBoard">
                      Create Team Board
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group id="boardName">
                        <Form.Label>Board Name</Form.Label>
                        <Form.Control type="text" value={boardName} onInput={(e) => setBoardName(e.target.value)} required />
                      </Form.Group>
                      <Form.Group className="mb-3 mt-3" controlId="boardDesc">
                        <Form.Label>Board Description</Form.Label>
                        <Form.Control as="textarea" value={boardDesc} onInput= {(e) => setBoardDesc(e.target.value)} rows={3} />
                      </Form.Group>
                    </Form>
                    <Form.Group className="mb-3" controlId="boardColor">
                        <Form.Label>Board Theme Color</Form.Label>
                        <Form.Select value={boardColor} aria-label="selectColor" onInput = {(e) => setBoardColor(e.target.value)}>
                          <option value="#000000">Default</option>
                          <option value="#ff575f">Red</option>
                          <option value="#41993f">Green</option>
                          <option value="#69a2ff">Blue</option>
                          <option value="#02a6ac">Aqua</option>
                          <option value="#cc85ff">Purple</option>
                          <option value="#e06e38">Orange</option>
                        </Form.Select>
                    </Form.Group>
                    
                  </Modal.Body>
                  <Modal.Footer>
                    <Button onClick={() => handleCreateBoard()} >Create Board</Button>
                  </Modal.Footer>
                </Modal>
                      
                <Row>
                  <div id="homeHead">
                        <p style={{color: "lightgray"}}>Created Boards</p>
                    </div>
                </Row>

                <Row className="">

                  {boards == null?
                    <p className="" style={{textAlign: "center", verticalAlign: "middle"}}>You are not a member of any boards.</p>
                  :
                    boards.map(function(board){
                      if(board.createdBy == uid)
                        return (
                          <Col className="col-sm-3 mt-2 ml-3">
                            <Card className="shadow text-center" style={{fontSize: "12px", minHeight: "100px", maxWidth: "150px", borderRadius: 15, borderTopLeftRadius: 15, borderTopRightRadius: 15}}>
                              <Card.Body style={{backgroundColor: board.boardColor, borderTopLeftRadius: 15, borderTopRightRadius: 15}}>

                                <Dropdown drop="end" style={{position: "absolute", top: "5px", right: "5px", marginRight: "35px", outline: "none"}}>
                                  <Dropdown.Toggle id="deleteBoard"  style={{backgroundColor: board.boardColor}}>
                                    ...
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu   style={{fontSize: "10px", minWidth: "50px"}}>
                                    <Dropdown.Item onClick={() => deleteBoard(board.id)}><FontAwesomeIcon icon={faTrashAlt}/> Delete</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              
                              
                              </Card.Body>
                              <Link to={{pathname: `/board/${board.id}`, state: {boardID: board.id}}} style={{textDecoration: 'none', color: "black"}}>
                                <Card.Footer>{board.boardName}</Card.Footer>
                              </Link>
                            </Card>
                          </Col>
                        )
                    })
                  }
                </Row>

                <Row>
                  <div id="homeHead">
                     <p style={{color: "lightgray", marginTop: "20px"}}>Joined Boards</p>
                  </div>
                </Row>
                <Row>
                {boards == null?
                    <p className="" style={{textAlign: "center", verticalAlign: "middle"}}>You are not a member of any boards.</p>
                  :
                    boards.map(function (board) {
                        if(board.members != null){
                          return(
                            Object.values(board?.members).map(function(m){
                              if(m.userID == uid && board.createdBy != uid){
                                return(
                                  <Col className="col-sm-3 mt-2 ml-3">
                                    <Card className="shadow text-center" style={{fontSize: "12px", minHeight: "100px", maxWidth: "150px", borderRadius: 15, borderTopLeftRadius: 15, borderTopRightRadius: 15}}>
                                      <Card.Body style={{backgroundColor: board.boardColor, borderTopLeftRadius: 15, borderTopRightRadius: 15}}>
                                      </Card.Body>
                                      <Link to={{pathname: `/board/${board.id}`, state: {boardID: board.id}}} style={{textDecoration: 'none', color: "black"}}>
                                        <Card.Footer>{board.boardName}</Card.Footer>
                                    </Link>
                                    </Card>
                                  </Col>
                                )
                              }
                            })
                          )
                        }
                        
                    })
                    
                  }
                </Row>
              </Card.Body>
            </Card>


            </Col>
          </Row>
      </Container>


  )
}