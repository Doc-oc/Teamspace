import React, {useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Button, Card, Form, Alert, Container, Navbar, Nav, Modal} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { faSlidersH, faClipboard, faUser, faSignOutAlt, faCog, faPencilAlt, faPaw } from '@fortawesome/fontawesome-free-solid'
import { auth, logout } from '../firebase';
import { useNavigate, Link } from "react-router-dom"
import cover from "../img/testcover.jpg"
import '../styles/profile.css';
import moment from 'moment-timezone';
import {updateProfile } from "firebase/auth";



export default function Profile() {
    const [error, setError] = useState("")
    const name = auth.currentUser.displayName;
    const email = auth.currentUser.email;
    const navigate = useNavigate()
    const [ newName, setNewName] = useState();
    const [ newEmail, setNewEmail] = useState();

    const [editModal, setEditModal] = useState(false)
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

    function editDetails(){
        updateProfile(auth.currentUser, {
            displayName: newName, 
          }).then(() => {
            window.location.reload()

            
          })
    }

    function editName(){
        setNewName(name)
        document.getElementById("nameDisplay").style.display ="none"
        document.getElementById("editNameForm").style.display = "block"

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
                    <Nav className="col-md-12 d-none d-md-block mb-5 sidebar text-center navbar-custom"  style={{marginTop: "53px"}} activeKey="/home">
                    <div className="sidebar-sticky"></div>
                    <Nav.Item>
                        <Nav.Link className="rounded" style={{marginBottom: "5px", backgroundColor: "#eef2fd", color: "black", padding: 3}}><Link id="navlink" to={"/profile"}><FontAwesomeIcon icon={faUser}/> Profile</Link></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link><Link id="navlink" to={"/"}><FontAwesomeIcon icon={faClipboard}/>  Boards</Link></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link ><Link id="navlink" to={"/settings"}><FontAwesomeIcon icon={faCog}/> Settings</Link></Nav.Link>
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
                    <div style={{display: "inline"}}>
                        <Col style={{marginTop: "20px", marginLeft: "20px", marginRight: "20px"}}>
                            <Card.Img className="shadow" variant="top" style={{position: "relative", maxHeight: "150px",borderRadius: 15}} src={cover}/>
                            <Card.Img id="userPicture" className="" variant="top" src={auth.currentUser.photoURL}/>
                        </Col>
                    </div>

                    <Card.Body style={{}}>                             
                        <Row>
                            <Col className="col-sm-2" style={{marginTop: "40px", fontSize: "10px"}}>
                            </Col>
                            <Col className="col-sm-3">
                                <h5 id="nameDisplay">{name} <i style={{fontSize: "10px"}} id="editDetailsButton" onClick={() => editName()}><FontAwesomeIcon style={{fontSize: "14px", marginLeft: "10px"}} icon={faPencilAlt} />  Edit Name</i></h5>
                                <Form id="editNameForm" style={{display: "none"}}>
                                    <Form.Group id="changeName">
                                        <Row>
                                            <Col sm={8}>
                                                <Form.Control type="text" value={newName} onInput={(e) => setNewName(e.target.value)} required />
                                            </Col>
                                            <Col sm={3}>
                                                <Button className="mt-1" style={{fontSize: "12px"}} onClick={() => editDetails()} >Save</Button>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>

                        
    

                        <Row>
                            <Col className="co"></Col>
                            <h6 id="userID">Personal ID: {auth.currentUser.uid}</h6>
                        </Row>

                        <Row>
                            <Col className="col-sm-12">
                                <p id="userDetails"><b>Email</b>: {auth.currentUser.email}</p>
                            </Col>
                        </Row> 

                        <Row>
                            <Col className="col-sm-12">
                                <p id="userDetails"><b>Member Since</b>: {auth.currentUser.metadata.creationTime}</p>   
                            </Col>
                        </Row>
                        <Row>
                            <Col className="col-sm-12">
                                <p id="userDetails"><b>TimeZone</b>: {moment.tz.guess()}</p>   
                            </Col>
                        </Row> 

                        <Row>
                            <Col className="col-sm-12">
                                <p id="userDetails"><b>Language</b>: {moment.locale()}</p>   
                            </Col>
                        </Row>

                    </Card.Body>
                </Card>
            </Col>


            </Row>
      </Container>

    )
}
