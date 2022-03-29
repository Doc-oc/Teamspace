import React , {useEffect, useState} from 'react'
import {Button, Card, Form, Alert} from 'react-bootstrap';
import {useAuth} from '../context/AuthContext'
import { Link, useNavigate} from "react-router-dom"
import db from '../firebase'
import {auth, registerWithEmailAndPassword} from "../firebase"
import { useAuthState } from "react-firebase-hooks/auth";


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
        if (user) navigate.replace("/");
    }, [user, loading]);

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">SignUp</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {/*<Form onSubmit={handleSubmit}>
                        <Form.Group id="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" ref={nameRef} required />
                        </Form.Group>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        <Form.Group id="passwordConfirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required />
                        </Form.Group>
                        <Button disabled={loading} className="w-100" type="submit">Sign Up</Button>
                        </Form>*/}

                        <div className="register">
                            <div className="register__container">
                                <input
                                type="text"
                                className="register__textBox"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full Name"
                                />
                                <input
                                type="text"
                                className="register__textBox"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="E-mail Address"
                                />
                                <input
                                type="password"
                                className="register__textBox"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                />
                                <button className="register__btn" onClick={register}>
                                Register
                                </button>
                                <div>
                                Already have an account? <Link to="/">Login</Link> now.
                                </div>
                            </div>
                            </div>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
            Already Have an Account? <Link to="/login">Login</Link>
            </div>
        </>
    )
}

