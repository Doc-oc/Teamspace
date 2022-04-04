import React , {useEffect, useState} from 'react'
import {Button, Card, Form, Alert, Container} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
//import {useAuth} from '../context/AuthContext'
import {Link, useNavigate} from "react-router-dom"
import image from '../img/team.jpeg'; 
import '../styles/login.css'
import { auth, signInWithEmailAndPassword } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import db from '../firebase'


function Login(){

    /*const emailRef = useRef()
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
       
    }*/ 

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) {
        // maybe trigger a loading screen
        return;
        }
        if (user) navigate("/")
        else navigate("/login");

    }, [user, loading]);



    return (
        <Container fluid className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
        <Row>  
            <Col>
                <h5 style={{color: "#4176FF"}}>Teamspace</h5>
                <img className="img-responsive w-100" src={image} alt="Logo"></img>
            </Col>
            <Col>
                <Card id="loginCard" className="shadow" style={{width: "35rem"}}>
                    <Card.Body>
                        <h5 className="text-center mb-4" style={{color: "#4176FF"}}>Welcome To Teamspace!</h5>
                        <p className="text-center mb-4" style={{color: "grey"}}>Login to your account to continue</p>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {/*<Form onSubmit={handleSubmit}>
                            <Form.Group id="email">
                                <Form.Control type="email" placeholder="Email" ref={emailRef} required />
                            </Form.Group>
                            <Form.Group id="password">
                                <Form.Control type="password" placeholder="Password" ref={passwordRef} required />
                            </Form.Group>
                            <Button disabled={loading} className="button w-100 mt-3" type="submit">Login</Button>
                        </Form>*/}
                            <input type="text" className="loginInput" value={email} onChange={(e) => setEmail(e.target.value)} style={{fontFamily: "Arial, sans-serif, FontAwesome", fontSize: "14px"}} placeholder="&#xf0e0;  E-mail Address"/>
                            <br></br>
                            <input type="password" className="loginInput" value={password} onChange={(e) => setPassword(e.target.value)} style={{fontFamily: "Arial, sans-serif, FontAwesome", fontSize: "14px"}} placeholder="&#xf023;  Password"/>
                            <br></br>
                            <button className="loginBtn" onClick={() => signInWithEmailAndPassword(email, password)}>
                            Login
                            </button>
                        
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

export default Login;