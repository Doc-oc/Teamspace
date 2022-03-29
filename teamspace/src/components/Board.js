import React, { useState, useEffect } from "react"
import {Button, Card, Form, Alert, Container,  Nav, Modal, Tab, Tabs} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
//import { useAuth } from "../context/AuthContext"
import { useNavigate, Link, useParams } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faCheck, faClipboard, faUser, faSignOutAlt, faPlusCircle, faUpload, faCog, faUndoAlt, faCalendarPlus} from '@fortawesome/fontawesome-free-solid'
import { auth, logout } from '../firebase';
import db from '../firebase'
import '../board.css';
import pp from "../img/defaultpp.png"

export default function Board() {

    const { boardID } =  useParams();

    const [error, setError] = useState("")
    //const { currentUser, logout } = useAuth()
    const navigate = useNavigate()
    const name = auth.currentUser.displayName;
    const [modal, setModal] = useState(false);

    //teamboards
    const [boardData, setBoardData] = useState();

    //filespace
    const [filespaceName, setFilespaceName] = useState();
    const [filespaceDesc, setFilespaceDesc] = useState();
    const [filespaceData, setFilespaceData] = useState();

    //todolist
    const [toDo, setToDo] = useState();
    const [todoData, setTodoData] = useState();
    const [completedData, setCompletedData] = useState();
    const uid = auth.currentUser.uid;

    const dbBoards = db.ref(`${uid}/boards`);
    const dbFilespace = db.ref(`${uid}/boards/${boardID}/filespace`)
    const dbListTodo = db.ref(`${uid}/boards/${boardID}/boardList/todo`)
    const dbListComp = db.ref(`${uid}/boards/${boardID}/boardList/completed`)

    

    
    useEffect(() => {
        dbBoards.on("value", (snapshot)=>{
            const boardsDB = snapshot.val();
            
            const boardsArray = [];
            for(let id in boardsDB){
                boardsArray.push({id, ...boardsDB[id]});
            }
        setBoardData(boardsArray);
        });
        
    }, [])

    //filespaces
    useEffect(() => {
        dbFilespace.on("value", (snapshot)=>{
            const filespaceDB = snapshot.val();
            
            const filespaceArray = [];
            for(let id in filespaceDB){
                filespaceArray.push({id, ...filespaceDB[id]});
            }
        setFilespaceData(filespaceArray);
        });
        
    }, [])
  
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

    async function handleCreateFilespace(){
        setModal(false)
        console.log("function filespace")
        const filespaces = {
            filespaceName,
            filespaceDesc,
            boardID
        }
        await dbFilespace.push(filespaces);

        setFilespaceName('');
        setFilespaceDesc('');

    }

    function displayToDo(){
        document.getElementById("toDo").style.display = "block"
    }

    async function handleToDo(){
        const todoList = {
            task: toDo
        }

        await dbListTodo.push(todoList);
        setToDo('');
        document.getElementById("toDo").style.display = "none"
    }

    useEffect(() => {
        dbListTodo.on("value", (snapshot)=>{
            const todoDB = snapshot.val();
            
            const todoArray = [];
            for(let id in todoDB){
                todoArray.push({id, ...todoDB[id]});
            }
        setTodoData(todoArray);
        });
    }, [])

    const current = new Date();
    var date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;

    function handleClose(){
        document.getElementById("toDo").style.display = "none"
    }

    async function handleChecked(e, task){
        const todoComp = {
            taskCompleted: task,
            completed: date
        }
        
        await dbListComp.push(todoComp);
        db.ref(`${uid}/boards/${boardID}/boardList/todo/${e}`).remove();
        
    }

    useEffect(() => {
        dbListComp.on("value", (snapshot)=>{
            const compDB = snapshot.val();
            
            const compArray = [];
            for(let id in compDB){
                compArray.push({id, ...compDB[id]});
            }
        setCompletedData(compArray);
        });
        
    }, [])

    async function handleDeleteComp(e){
        db.ref(`${uid}/boards/${boardID}/boardList/completed/${e}`).remove()
    }

    async function deleteTodo(e){
        db.ref(`${uid}/boards/${boardID}/boardList/todo/${e}`).remove()
    }

    async function handleUndoComp(e, task){
        const undoComp = {
            task: task
        }
        await dbListTodo.push(undoComp);
        db.ref(`${uid}/boards/${boardID}/boardList/completed/${e}`).remove();
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
                    <img src={pp} className="img-responsive w-50 mt-5 roundedCircle"></img>
                    <br></br>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {name}
                    
                    <br></br>
                    <Nav className="col-md-12 d-none d-md-block mt-5 mb-5 sidebar text-center navbar-custom" activeKey="/home">
                    <div className="sidebar-sticky"></div>
                    <Nav.Item>
                    <Nav.Link eventKey="Profile"><FontAwesomeIcon icon={faUser}/> Profile</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/"><FontAwesomeIcon icon={faClipboard}/>  Boards</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="Settings"><FontAwesomeIcon icon={faCog}/> Settings</Nav.Link>
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
                
            <Col className="col-sm-7">
            <Card className="shadow" style={{minHeight: "660px", borderRadius: 15}}>
            <Card.Body>
                <Container>
                <Row className="">
                    <Col className="col-sm-2 mt-1 ">
                    {boardData == null? <p>id is null</p>
                    : 
                        boardData.map(function(board){
                            if(board.id == boardID)
                            return (
                                <div>
                                    <div id="boardHead">
                                        <h5>{board.boardName}</h5> 
                                        <p>{board.boardDesc}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                    </Col>
                </Row>
                <Row>
                    <Col className="col-sm-2 mt-3">
                        <Button id="defaultButton" className="shadow" onClick={() => setModal(true)}>
                            <FontAwesomeIcon icon={faPlusCircle}/> New
                        </Button>
                    </Col>
                    <Col className="col-sm-2 mt-3">
                        <Button id="defaultButton" className="shadow">
                            <FontAwesomeIcon icon={faUpload}/> Import
                        </Button>
                    </Col>
                    <div id="filespaceHead">
                        <p style={{color: "lightgray"}}>Team Filespaces</p>
                    </div>
                </Row>
                <Row>
                    {filespaceData == null? <p>filespace is empty</p>
                    :
                    filespaceData.map(function(fs){
                        return (
                            <Link to={{pathname: `/filespace/${boardID}/${fs.id}`, state: {boardID: boardID, id: fs.id}}}  style={{textDecoration: 'none', color: "black"}}>
                                <p id="filespace">{fs.filespaceName}</p>
                            </Link>
                        )
                        })
                    }
                </Row>
                </Container>
            </Card.Body>
            </Card>


            <Modal size="lg" show={modal} onHide={() => setModal(false)} aria-labelledby="createBoard">
                  <Modal.Header closeButton>
                    <Modal.Title id="createBoard">
                      Create Filespace
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group id="boardName">
                        <Form.Label>Filespace Name</Form.Label>
                        <Form.Control type="text" value={filespaceName} onInput={(e) => setFilespaceName(e.target.value)} required />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="boardDesc">
                        <Form.Label>Filespace Description</Form.Label>
                        <Form.Control as="textarea" value={filespaceDesc} onInput= {(e) => setFilespaceDesc(e.target.value)} rows={3} />
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button onClick={() => handleCreateFilespace()} >Create</Button>
                  </Modal.Footer>
            </Modal>

            </Col>
                <Col className="col-sm-3">
                <Card className="" style={{minHeight: "660px", borderRadius: 15, border: 0}}>

                <Card.Body>
                    <Card className="shadow" style={{borderRadius: "15px"}}>
                        <Card.Body >Members go here</Card.Body>
                    </Card>
                    <br></br>
                    <Row>
                        <Col>
                            <p style={{marginLeft: "5px"}}>Upcoming</p> 
                        </Col>
                        <Col style={{textAlign: "right", marginRight: "10px"}}>
                            <FontAwesomeIcon id="test" onClick={() => displayToDo()} icon={faCalendarPlus} style={{cursor: "pointer"}}/>
                        </Col>
                    </Row>
                    
                    <Card className="shadow" style={{minHeight: "250px", maxHeight:"250px", borderRadius: "15px", overflow: "hidden"}}>
                        <Card.Body className="scrollbar-primary"style={{margin: 0,}}>
                                <Tabs defaultActiveKey="todo" style={{fontSize: "10px"}} className="mb-3">
                                    <Tab id="tab" eventKey="todo" title="Todo">
                                        <Form id="toDo" style={{display: "none"}}>
                                            <Form.Group>
                                                <Row>
                                                    <Col className="col-sm-8">
                                                        <Form.Control id="toDoInput" type="text" placeholder="Enter item..." value={toDo} onInput= {(e) => setToDo(e.target.value)} required>
                                                        </Form.Control>
                                                    </Col>
                                                    <Col className="col-sm-2">
                                                        <span id="todoButton" onClick={() => handleToDo()}>+</span>
                                                    </Col>
                                                    <Col className="col-sm-1">
                                                        <span id="todoButton" onClick={() => handleClose()}>x</span>
                                                    </Col>
                                                </Row>
                                            </Form.Group>
                                        </Form>
                                        <div id="taskContainer">
                                        {todoData == null? <p>to do is empty</p> :
                                        todoData.map(function(t){
                                            return (
                                                <div id="todoRow">
                                                    <Row>
                                                        <Col className="col-sm-1">
                                                        <FontAwesomeIcon id="checkBox" style={{marginTop: "10px"}} icon={faCheck} onClick={() => handleChecked(t.id, t.task)}/>
                                                        </Col>
                                                        <Col className="col-sm-">
                                                            <p style={{marginTop: "9px"}}>{t.task}</p>
                                                        </Col>
                                                        <Col className="col-sm-2">
                                                            <FontAwesomeIcon  id="removeTodo" style={{marginTop: "13px"}} onClick={() => deleteTodo(t.id)}icon={faTrashAlt}/>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )
                                        })
                                        }
                                        </div>
                                    </Tab>
                                    <Tab style={{fontSize: "10px"}} eventKey="completed" title="Completed">
                                        {completedData == null? <p>Nothing Completed</p>: 
                                            completedData.map(function(c){
                                                return (
                                                    <div id="compList">
                                                        {c.taskCompleted}
                                                        <span id="removeComp" style={{float: "right"}} onClick={() => handleDeleteComp(c.id)}>x</span>
                                                        <span id="undoComp" style={{float: "right"}} onClick={() => handleUndoComp(c.id, c.taskCompleted)}> <FontAwesomeIcon icon={faUndoAlt}/></span>
                                                        <br></br>
                                                        {"Completed: " + c.completed}    
                                                    </div>
                                                )
                                            })
                                        }   
                                    </Tab>
                                </Tabs>
                                
                        </Card.Body>
                    </Card>
                    <br></br>

                    <p>Recent Activity</p>
                    <Card className="shadow" style={{minHeight: 200, borderRadius: "10px"}}>
                        
                    </Card>
                </Card.Body>

                </Card>
                </Col>
            </Row>
        </Container>
    )
}

