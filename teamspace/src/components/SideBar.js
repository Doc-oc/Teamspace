import React, { useState, useEffect } from "react"
import {Button, Card, Form, Alert, Container, Navbar, Nav, Modal, Dropdown} from 'react-bootstrap';

//import { useAuth } from "../context/AuthContext"
import { useNavigate, Link, Navigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSlidersH, faClipboard, faUser, faSignOutAlt, faCog, faPlusCircle, faTrashAlt } from '@fortawesome/fontawesome-free-solid'
import { auth, logout, storage} from '../firebase';
import "../styles/sidebar.css"


function SideBar() {

    const [error, setError] = useState("")
    const name = auth.currentUser.displayName;
    const navigate = useNavigate()
    const [isActive, setActive] = useState();

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

    function navHighlight(navId){



    document.getElementById(navId).style.color = "red";
           


        // style={{marginTop: "5px", marginBottom: "5px", backgroundColor: "#eef2fd", color: "black", padding: 3}}
    }
      
    return (
    <>
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
                <Nav.Item onClick = {() => navHighlight("navlinkProfile")}>
                    <Nav.Link to={"/profile"}><Link id="navlinkProfile" to={"/profile"} style={{textDecoration: 'none', color: "black"}}><FontAwesomeIcon icon={faUser}/> Profile</Link></Nav.Link>
                </Nav.Item>
                <Nav.Item onClick = {() => navHighlight("navlinkHome")}>
                    <Nav.Link to={"/"} className="rounded" ><Link id ="navlinkHome" to={"/"} style={{textDecoration: 'none', color: "black"}}><FontAwesomeIcon icon={faClipboard}/>  Boards</Link></Nav.Link>
                </Nav.Item>
                <Nav.Item onClick = {() => navHighlight("navlinkSettings")}>
                    <Nav.Link to={"/settings"}> <Link id="navlinkSettings" to={"/settings"} style={{textDecoration: 'none', color: "black"}}><FontAwesomeIcon icon={faCog}/> Settings</Link></Nav.Link>
                </Nav.Item >
                </Nav>
            </Container>
            </Card.Body>
            <div className="w-100 text-center mt-2">
                <Button className="logout mb-2" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt}/> Log Out
                </Button>
            </div>
        </Card>
    </>
  )
}

export default SideBar;