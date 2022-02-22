import React, { useState } from "react"
import {Button, Card, Form, Alert, Container} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

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

    <Container fluid className="" style={{minHeight: "100vh"}}>
        <Row>  
          <Col className="col-sm-3">
            <Card className="shadow">
              <Card.Body>
                <h2 className="text-center mb-4">Profile</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <strong>Email:</strong> {currentUser?.email}
              </Card.Body>
            </Card >
            <div className="w-100 text-center mt-2">
              <Button variant="link" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
            </Col>
            <Col className="col-sm-6">
            <Card className="shadow">
              <Card.Body>
                <p>Main Section</p>
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