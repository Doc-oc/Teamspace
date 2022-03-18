import React, { useState, useEffect } from "react"
import {Button, Card, Form, Alert, Container, Navbar, Nav, Modal} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
//import { useAuth } from "../context/AuthContext"
import { useNavigate, Link, useParams } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSlidersH, faClipboard, faUser, faSignOutAlt, faTrash, faPlusCircle } from '@fortawesome/fontawesome-free-solid'
import '../home.css'
import { auth, logout } from '../firebase';
import db from '../firebase'

export default function Board() {

    const { id, boardName} =  useParams();

    const [error, setError] = useState("")
    //const { currentUser, logout } = useAuth()
    const navigate = useNavigate()
    const name = auth.currentUser.displayName;
    const [modal, setModal] = useState(false);
    const [boardDesc, setBoardDesc] = useState();
    const [boardColor, setBoardColor] = useState();
    const [boardData, setBoardData] = useState();

    const dbBoards = db.ref(`boards`);
    
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

    function test (){
        alert(boardData)
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
                    {boardData == null? <p>id is null</p>
                    : 
                        boardData.map(function(board){
                            if(board.id == id)
                            return (
                                <div>
                                    <h5>{board.boardName}</h5> 
                                    <p>{board.boardDesc}</p>
                                </div>
                                
                            )
                        })
                    }
                    </Col>
                </Row>
                </Container>
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

