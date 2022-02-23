import React, { useState } from "react"
import {Button, Card, Form, Alert, Container, Navbar, Nav} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSlidersH, faClipboard, faUser, faSignOutAlt } from '@fortawesome/fontawesome-free-solid'
import '../home.css'
import pp from '../img/blank.webp'; // Tell webpack this JS file uses this image

export default function Home() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

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

    <Container fluid className="mt-5" style={{minHeight: "100vh"}}>
        <Row>  
          <Col className="col-sm-3">
            <Card className="shadow text-center">
              <Card.Body>
              <Container>
                <h2 className="text-center mb-4">Profile</h2>
                <br></br>
                <img src="#" className="img-responsive w-50 roundedCircle"></img>
                <br></br>
                {error && <Alert variant="danger">{error}</Alert>}
                <strong className="text-center">User:</strong> {currentUser?.email}
                <br></br>
                <Nav className="col-md-12 d-none d-md-block mt-5 mb-5 sidebar text-center navbar-custom" activeKey="/home" conSelect={selectedKey => alert(`selected ${selectedKey}`)}>
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
                <Button className="logout btn-primary" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt}/> Log Out
                </Button>
              </div>
          </Card> 
        </Col>
            <Col className="col-sm-6">
            <Card className="shadow">
              <Card.Body>
                <p>Main Section</p>
                <form action="../post" method="post" className="form">
                  <button type="submit">Connected to Server</button>
                </form>
              </Card.Body>
            </Card>
            </Col>
            <Col className="col-sm-3">
            <Card className="shadow">
              <Card.Body>
                <p>Side Bar</p>
              </Card.Body>
            </Card>
            </Col>
          </Row>
      </Container>
  )
}