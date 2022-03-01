import React, {useState} from 'react'
import db from '../firebase'
import "firebase/database"
import {Button, Card, Form, Alert} from 'react-bootstrap';
import {useAuth} from '../context/AuthContext'
import {useNavigate} from "react-router-dom"




export default function UserDetails() {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [lastName, setLast] = useState('')

    const handleChangeName = (e) => {
        setName(e.target.value);
    };

    const handleChangeLast = (e) => {
        setLast(e.target.value);
    };

    const createUser = (e) => {
        e.preventDefault()

        const usersRef = db.ref('users');
        const user = {
            name,
            lastName
        }
        usersRef.push(user);
        navigate("/")

        setName('')
        setLast('')  
}

  return (
        <Card className="w-500 shadow rounded">
            <Card.Body>
                <h5 className="text-center mb-4">Display Name</h5>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={createUser}>
                    <Form.Group id="name">
                        <Form.Control type="text" placeholder="First Name" value={name} required onChange={handleChangeName}/>
                    </Form.Group>
                    <Form.Group id="lastName">
                        <Form.Control type="text" placeholder="Second Name" value={lastName} required onChange={handleChangeLast} />
                    </Form.Group>
                    <Button disabled={loading} className="button w-100 mt-3" type="submit">Next</Button>
                </Form>
            </Card.Body>
        </Card>
  )
}
