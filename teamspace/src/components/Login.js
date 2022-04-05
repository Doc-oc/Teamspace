import React , {useEffect, useState} from 'react'
import {Button, Card, Form, Alert, Container} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
//import {useAuth} from '../context/AuthContext'
import {Link, useNavigate} from "react-router-dom"
import image from '../img/team.jpeg'; 
import '../styles/login.css'
import { auth, signInWithEmailAndPassword, sendPasswordResetEmail } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import db from '../firebase'
import cloud from '../img/cloud.png'


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
    const [resetEmail, setResetEmail] = useState("");

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

    function handleShowReset(){
        document.getElementById("resetCard").style.display = "block"
        document.getElementById("loginCard").style.display = "none"
    }

    return (
        <div>
        <Container fluid className="d-flex align-items-center justify-content-center" style={{minHeight: "95vh"}}>
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

                            <input type="text" className="loginInput" value={email} onChange={(e) => setEmail(e.target.value)} style={{fontFamily: "Arial, sans-serif, FontAwesome", fontSize: "14px"}} placeholder="&#xf0e0;  E-mail Address"/>
                            <br></br>
                            <input type="password" className="loginInput" value={password} onChange={(e) => setPassword(e.target.value)} style={{fontFamily: "Arial, sans-serif, FontAwesome", fontSize: "14px"}} placeholder="&#xf023;  Password"/>
                            <br></br>
                            <p style={{fontSize: "10px"}}><a href="#" onClick={() => handleShowReset()}>Forgot password?</a></p>
                            <br></br>
                            <button className="loginBtn" onClick={() => signInWithEmailAndPassword(email, password)}>
                            Login
                            </button>
                        
                        <div className="w-100 text-center mb-3 mt-2">
                            Need an Account? <Link to="/signup">Sign up</Link>
                        </div>
                    </Card.Body>
                </Card>

                    <Card id="resetCard" className="shadow" style={{width: "35rem", display: "none"}}>
                    <Card.Body>
                        <h5 className="text-center mb-4" style={{color: "#4176FF"}}>Reset Your Password</h5>
                            <input type="text" className="resetInput" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} style={{fontFamily: "Arial, sans-serif, FontAwesome", fontSize: "14px"}} placeholder="&#xf0e0;  E-mail Address"/>
                            <br></br>
                            <button className="resetBtn" onClick={() => sendPasswordResetEmail(resetEmail)}>
                            Send Reset Link
                            </button>
                    </Card.Body>
                    </Card>
            </Col>
        </Row>
        </Container>

        <Row style={{backgroundColor: "#4176FF", maxHeight: "600px"}}>
            <Col className="col-sm-1 "></Col>
            <Col className="col-sm-5 text-center mt-5" style={{marginTop: "10px"}}>
                <h4 style={{color: "white"}}> About Teamspace </h4>
                <p style={{color: "white", width: "90%", marginLeft: "30px"}} className="mt-5">Teamspace is a web application that is designed to improve the online experience when working in a team. Teamspace allows users to store and share team related files in an organised manner while being able to view, edit or delete files at the same time in real time. </p>
                <p style={{color: "white", width: "90%", marginLeft: "30px"}} className="mt-5">Teamspace isn’t about solving all problems in relation to online collaboration, it is about creating a smoother experience for teams and catering for all types of users in creating a simple to use but effective tool.</p>
            </Col>
            <Col className="col-sm-5 text-center mt-5" style={{marginTop: "10px"}}>
                <img className="rounded" style={{height: "50%"}} src={cloud}/>
            </Col>
            <Col className="col-sm-1 "></Col>
        </Row>
    </div>                   
    )
}

export default Login;