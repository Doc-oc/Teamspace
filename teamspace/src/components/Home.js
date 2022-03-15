import React, { useState, useEffect } from "react"
import {Button, Card, Form, Alert, Container, Navbar, Nav, Modal} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
//import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSlidersH, faClipboard, faUser, faSignOutAlt, faTrash, faPlusCircle } from '@fortawesome/fontawesome-free-solid'
import '../home.css'
import { auth, logout } from '../firebase';
import db from '../firebase'


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

  const dbRef = db.ref("boards");

  const userID = auth.currentUser.uid;

  async function handleCreateBoard(){
    setModal(false)
    console.log("function")
    const boardRef = db.ref('boards');
        const boards = {
            boardName,
            boardDesc,
            boardColor,
            userID
        }
        await boardRef.push(boards);
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
                          <option value="#8fff91">Green</option>
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

                <Row className="">
                {boards == null?
                  <p className="" style={{textAlign: "center", verticalAlign: "middle"}}>You are not a member of any boards.</p>
                :
                  boards.map(function(board){
                    if(board.userID == userID){
                      return (
                          <Col className="col-sm-3 mt-5 ml-3">
                            <Card className="shadow text-center" style={{minHeight: "120px", borderRadius: 15, borderTopLeftRadius: 15, borderTopRightRadius: 15}}>
                              <Card.Body style={{backgroundColor: board.boardColor, borderTopLeftRadius: 15, borderTopRightRadius: 15}}></Card.Body>
                              <Link to="/board" style={{textDecoration: 'none', color: "black"}}>
                                <Card.Footer>{board.boardName}</Card.Footer>
                              </Link>
                            </Card>
                          </Col>
                      )
                    }
                  })
                }
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