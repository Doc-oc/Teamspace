import React , {useEffect, useState} from 'react'
import {Button, Card, Form, Alert, Row, Container, Col} from 'react-bootstrap';
import { Link, useNavigate} from "react-router-dom"
import db from '../firebase'
import {auth, registerWithEmailAndPassword, storage} from "../firebase"
import { useAuthState } from "react-firebase-hooks/auth";
import '../styles/signup.css'
import { faUserAlt } from '@fortawesome/fontawesome-free-solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import stock from '../img/stockphoto.jpg'

export default function Signup(){

    /*const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault()

        if(passwordRef.current.value !== passwordConfirmRef.current.value){
            return setError("Passwords do not match")
        }
        try {
            setError("")
            setLoading(true)

            const res = await signup(emailRef.current.value, passwordRef.current.value)
            console.log("after write")
            const user = res.user;
            const userRef = db.ref("users");
            const users = {
                uid: user.uid,
                email: emailRef,
                name: nameRef
            }
            userRef.push(users);
            navigate("/")
        } catch {
            setError("Failed to create an account!")
        }
        setLoading(false)
    }*/

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    const register = () => {
        if (!name) alert("Please enter name");
        registerWithEmailAndPassword(name, email, password);


    };

    useEffect(() => {
        if (loading) return;
        if (user) navigate("/");
    }, [user, loading]);

    return (
        <>
        <div id="backgroundImage"></div>
        <Container style={{width: "35rem"}}>

            <Card id="registerCard" className="shadow text-center" style={{padding: "20px"}}>
                <Card.Body>
                    <h5 className="text-center mb-4" style={{color: "#4176FF"}}>Welcome To Teamspace</h5>
                    <p style={{marginBottom: "20px", color: "grey"}}>Please sign up below to continue!</p>
                    {error && <Alert variant="danger">{error}</Alert>}
                        {/*<label for="file-upload" className="profilePicture">
                            Upload Profile Picture
                        </label>
                        <br></br>
                        <input id="file-upload" type="file"/>*/}
                        <br></br>
                        <input type="text" id="registerInput" value={name} onChange={(e) => setName(e.target.value)} style={{fontFamily: "Arial, sans-serif, FontAwesome", fontSize: "14px"}} placeholder="&#xf007;  Full Name"/>
                        <br></br>
                        <input type="text" id="registerInput" value={email} onChange={(e) => setEmail(e.target.value)} style={{fontFamily: "Arial, sans-serif, FontAwesome", fontSize: "14px"}} placeholder="&#xf0e0;  E-mail Address" />
                        <br></br>
                        <input type="password" id="registerInput" value={password} onChange={(e) => setPassword(e.target.value)} style={{fontFamily: "Arial, sans-serif, FontAwesome", fontSize: "14px", marginBottom: "30px"}} placeholder="&#xf023;  Password"/>
                        <br></br>
                        <button className="shadow" id="registerBtn" onClick={register}>Sign Up</button>
                        <br></br>
                        Already have an account? <Link to="/login">Login</Link>
                </Card.Body>
            </Card>

        </Container>

        </>
    )
}

