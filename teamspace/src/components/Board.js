import React, { useState, useEffect } from "react"
import {Button, Card, Form, Alert, Container,  Nav, Modal, Tab, Tabs} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
//import { useAuth } from "../context/AuthContext"
import { useNavigate, Link, useParams } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSlidersH, faClipboard, faUser, faSignOutAlt, faPlusCircle, faUpload, faEdit, faArrowAltCircleLeft, faCalendarPlus} from '@fortawesome/fontawesome-free-solid'
import { auth, logout } from '../firebase';
import db from '../firebase'
import '../board.css';
import pp from "../img/defaultpp.png"

export default function Board() {

    const { boardID } =  useParams();

    const [error, setError] = useState("")
    //const { currentUser, logout } = useAuth()
    const navigate = useNavigate()
    const name = auth.currentUser.displayName;
    const [modal, setModal] = useState(false);

    //teamboards
    const [boardData, setBoardData] = useState();

    //filespace
    const [filespaceName, setFilespaceName] = useState();
    const [filespaceDesc, setFilespaceDesc] = useState();
    const [filespaceData, setFilespaceData] = useState();


    const dbBoards = db.ref(`boards`);
    const dbFilespace = db.ref(`boards/${boardID}/filespace`)
    
    const userID = auth.currentUser.uid;
    
    useEffect(() => {
        dbBoards.on("value", (snapshot)=>{
            const boardsDB = snapshot.val();
            
            const boardsArray = [];
            for(let id in boardsDB){
                boardsArray.push({id, ...boardsDB[id]});
            }
        setBoardData(boardsArray);
        });
        
    }, [])

    //filespaces
    useEffect(() => {
        dbFilespace.on("value", (snapshot)=>{
            const filespaceDB = snapshot.val();
            
            const filespaceArray = [];
            for(let id in filespaceDB){
                filespaceArray.push({id, ...filespaceDB[id]});
            }
        setFilespaceData(filespaceArray);
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

    async function handleCreateFilespace(){
        setModal(false)
        console.log("function filespace")
        const filespaces = {
            filespaceName,
            filespaceDesc,
            boardID
        }
        await dbFilespace.push(filespaces);

        setFilespaceName('');
        setFilespaceDesc('');

    }

    function handleToDo(){
        document.getElementById("toDo").style.display = "block"
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
                    <img src={pp} className="img-responsive w-50 mt-5 roundedCircle"></img>
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
            <Card className="shadow" style={{minHeight: "660px", borderRadius: 15}}>
            <Card.Body>
                <Container>
                <Row className="">
                    <Col className="col-sm-2 mt-1 ">
                    {boardData == null? <p>id is null</p>
                    : 
                        boardData.map(function(board){
                            if(board.id == boardID)
                            return (
                                <div>
                                    <div id="boardHead">
                                        <h5>{board.boardName}</h5> 
                                        <p>{board.boardDesc}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                    </Col>
                </Row>
                <Row>
                    <Col className="col-sm-2 mt-3">
                        <Button id="defaultButton" className="shadow" onClick={() => setModal(true)}>
                            <FontAwesomeIcon icon={faPlusCircle}/> New
                        </Button>
                    </Col>
                    <Col className="col-sm-2 mt-3">
                        <Button id="defaultButton" className="shadow">
                            <FontAwesomeIcon icon={faUpload}/> Import
                        </Button>
                    </Col>
                    <div id="filespaceHead">
                        <p style={{color: "lightgray"}}>Team Filespaces</p>
                    </div>
                </Row>
                <Row>
                    {filespaceData == null? <p>filespace is empty</p>
                    :
                    filespaceData.map(function(fs){
                        return (
                            <Link to={{pathname: `/filespace/${boardID}/${fs.id}`, state: {boardID: boardID, id: fs.id}}}  style={{textDecoration: 'none', color: "black"}}>
                                <p id="filespace">{fs.filespaceName}</p>
                            </Link>
                        )
                        })
                    }
                </Row>
                </Container>
            </Card.Body>
            </Card>


            <Modal size="lg" show={modal} onHide={() => setModal(false)} aria-labelledby="createBoard">
                  <Modal.Header closeButton>
                    <Modal.Title id="createBoard">
                      Create Filespace
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group id="boardName">
                        <Form.Label>Filespace Name</Form.Label>
                        <Form.Control type="text" value={filespaceName} onInput={(e) => setFilespaceName(e.target.value)} required />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="boardDesc">
                        <Form.Label>Filespace Description</Form.Label>
                        <Form.Control as="textarea" value={filespaceDesc} onInput= {(e) => setFilespaceDesc(e.target.value)} rows={3} />
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button onClick={() => handleCreateFilespace()} >Create</Button>
                  </Modal.Footer>
            </Modal>

            </Col>
                <Col className="col-sm-3">
                <Card className="" style={{minHeight: "660px", borderRadius: 15, border: 0}}>

                <Card.Body>
                    <Card className="shadow" style={{borderRadius: "15px"}}>
                        <Card.Body >Members go here</Card.Body>
                    </Card>
                    <br></br>
                    <Row>
                        <Col>
                            <p style={{marginLeft: "5px"}}>Upcoming</p> 
                        </Col>
                        <Col style={{textAlign: "right", marginRight: "10px"}}>
                            <FontAwesomeIcon id="test" onClick={() => handleToDo()} icon={faCalendarPlus} style={{cursor: "pointer"}}/>
                        </Col>
                    </Row>
                    
                    <Card className="shadow" style={{minHeight: "250px", borderRadius: "15px", textAlign: "center"}}>
                        <Card.Body className="scrollbar-primary"style={{margin: 0}}>
                                <Tabs defaultActiveKey="todo" style={{fontSize: "10px"}} className="mb-3">
                                    <Tab id="tab" eventKey="todo" title="Todo">
                                        <Form id="toDo" style={{display: "none"}}>
                                            <Form.Group>
                                                <Form.Control id="toDoInput" type="text" placeholder="Enter item..." required>
                                                    
                                                </Form.Control>
                                            </Form.Group>
                                        </Form>
                                    </Tab>
                                    <Tab style={{fontSize: "10px"}} eventKey="completed" title="Completed">
                                        <p>Completed</p>
                                    </Tab>
                                </Tabs>
                                
                        </Card.Body>
                    </Card>
                    <br></br>

                    <p>Recent Activity</p>
                    <Card className="shadow" style={{minHeight: 200, borderRadius: "10px"}}>
                        
                    </Card>
                </Card.Body>

                </Card>
                </Col>
            </Row>
        </Container>
    )
}

