import React, { useState, useEffect } from "react"
import {Button, Card, Form, Alert, Container, Navbar, Nav, Modal} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
//import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSlidersH, faClipboard, faUser, faSignOutAlt, faTrash, faPlusCircle } from '@fortawesome/fontawesome-free-solid'
import '../home.css'
import { auth, logout, storage} from '../firebase';
import db from '../firebase'
import boardData from './Board';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";


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
  
  function handleJoined(boardID){
    db.ref(`boards/${boardID}/members/`).on("value", (snapshot)=>{
        const membersFromDatabase = snapshot.val();
  
        const membersArray = [];
        for(let id in membersFromDatabase){
            membersArray.push({id, ...membersFromDatabase[id]});
        }
        setMembers(membersArray);
    })
  }

  return (

    <Container fluid className="mt-3" style={{minHeight: "100vh"}}>
        <Row>  
          <Col className="col-sm-2">
            <Card className="shadow text-center" style={{minHeight: "660px", borderRadius: 15}}>
              <Card.Body>
              <Container>
              <h6 className="mb-5 mt-3" style={{color: "#4176FF"}}>Teamspace</h6>
                <br></br>
                <img src={auth.currentUser.photoURL} className="img-responsive w-50 mt-5 roundedCircle"></img>
                <br></br>
                {error && <Alert variant="danger">{error}</Alert>}
                {name}
                <br></br>
                <Nav className="col-md-12 d-none d-md-block mt-5 mb-5 sidebar text-center navbar-custom" activeKey="/home">
                <div className="sidebar-sticky"></div>
                  <Nav.Item>
                  <Nav.Link href="/profile"><FontAwesomeIcon icon={faUser}/> Profile</Nav.Link>
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
                      <Form.Group className="mb-3" controlId="boardDesc">
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
                          <option value="#fbff80">Yellow</option>
                          <option value="#cc85ff">Purple</option>
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
                              <Card.Body style={{backgroundColor: board.boardColor, borderTopLeftRadius: 15, borderTopRightRadius: 15}}></Card.Body>
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
                                      <Card.Body style={{backgroundColor: board.boardColor, borderTopLeftRadius: 15, borderTopRightRadius: 15}}></Card.Body>
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