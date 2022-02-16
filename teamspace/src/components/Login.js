import React , {useRef, useState} from 'react'
import {Button, Card, Form, Alert, Container} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {useAuth} from '../context/AuthContext'
import {Link, useNavigate} from "react-router-dom"
import image from '../img/team.jpg'; 
import '../login.css'


export default function Login(){

    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()

        try {
            setError("")
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            navigate("/")
        } catch {
            setError("Failed to sign in!")
        }
        setLoading(false)
       
    }
    return (
        <Container fluid className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
        <Row>  
            <Col>
                <h5 style={{color: "#4176FF"}}>Teamspace</h5>
                <img className="img-responsive w-100" src={image} alt="Logo"></img>
            </Col>
            <Col>
                <Card className="w-500 shadow rounded">
                    <Card.Body>
                        <h5 className="text-center mb-4">Welcome To Teamspace!</h5>
                        <p className="text-center mb-4">Login to your account to continue</p>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="email">
                                <Form.Control type="email" placeholder="Email" ref={emailRef} required />
                            </Form.Group>
                            <Form.Group id="password">
                                <Form.Control type="password" placeholder="Password" ref={passwordRef} required />
                            </Form.Group>
                            <Button disabled={loading} className="button w-100 mt-3" type="submit">Login</Button>
                        </Form>
                        <div className="w-100 text-center mb-3 mt-2">
                            Need an Account? <Link to="/signup">Sign up</Link>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        
        </Container>

    )
}

