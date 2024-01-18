import React, { useState, useEffect} from "react"
import {Button, Card, Form, Alert, Container,  Nav, Modal, Tab, Tabs, Dropdown} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
//import { useAuth } from "../context/AuthContext"
import { useNavigate, Link, useParams } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faCheck, faClipboard, faUser, faSignOutAlt, faPlusCircle, faUpload, faCog, faUndoAlt, faUserPlus, faCalendarPlus, faEllipsisH, faQuestionCircle} from '@fortawesome/fontawesome-free-solid'
import { auth, logout} from '../firebase';
import db from '../firebase'
import '../styles/board.css';
import { ref, set, get, child, orderByChild } from "firebase/database"
import ScrollMenu from 'react-horizontal-scrolling-menu';
import ReactTooltip from 'react-tooltip';
import NavBar from '../components/NavBar';

export default function Board() {

    const { boardID } =  useParams();

    const [error, setError] = useState("")
    //const { currentUser, logout } = useAuth()
    const navigate = useNavigate()
    const name = auth.currentUser.displayName;
    const photo = auth.currentUser.photoURL;
    const [modal, setModal] = useState(false);
    const [modalInvite, setModalInvite] = useState(false);
    const [modalInfo, setModalInfo] = useState(false)
    const [newData, setNewData] = useState();
    const [joinModal, setJoinModal] = useState();
    const [membersData, setMembersData] = useState();



    //teamboards
    const [boardData, setBoardData] = useState();
    const [boardInfoName, setBoardInfoName] = useState();
    const [boardInfoDesc, setBoardInfoDesc] = useState();
    const [createdBy, setCreatedBy] = useState();
    const [boardInfoColor, setBoardInfoColor] = useState();


    //filespace
    const [filespaceName, setFilespaceName] = useState();
    const [filespaceDesc, setFilespaceDesc] = useState();
    const [filespaceData, setFilespaceData] = useState([]);

    //todolist
    const [toDo, setToDo] = useState();
    const [todoData, setTodoData] = useState();
    const [completedData, setCompletedData] = useState();
    const uid = auth.currentUser.uid;

    const [recentData, setRecentData] = useState();
    const [searchData, setSearchData] = useState()

    const dbUsers = db.ref(`users/`)
    const dbBoards = db.ref(`boards`)
    const dbFilespace = db.ref(`boards/${boardID}/filespace`)
    const dbListTodo = db.ref(`boards/${boardID}/boardList/todo`)
    const dbListComp = db.ref(`boards/${boardID}/boardList/completed`)
    const dbMembers = db.ref(`boards/${boardID}/members`)
    const dbRecent = db.ref(`boards/${boardID}/recentActivity/`)


    
    useEffect(() => {
        
        db.ref(`boards/${boardID}/members/`).orderByChild('userID').equalTo(uid).once("value", snapshot => {
            if(snapshot.exists()){

                    dbBoards.on("value", (snapshot)=>{
                        const boardsDB = snapshot.val();
                        
                        const boardsArray = [];
                        for(let id in boardsDB){
                            boardsArray.push({id, ...boardsDB[id]});
                        }
                    setBoardData(boardsArray);

                    dbFilespace.on("value", (snapshot)=>{
                        const filespaceDB = snapshot.val();
                        
                        const filespaceArray = [];
                        for(let id in filespaceDB){
                            filespaceArray.push({id, ...filespaceDB[id]});
                        }
                    setFilespaceData(filespaceArray);

                    dbMembers.on("value", (snapshot)=>{
                        const membersDB = snapshot.val();
                        const membersArray = [];

                        for(let id in membersDB){
                            membersArray.push({id, ...membersDB[id]});
                        }

                        setMembersData(membersArray);
                    })

                    dbRecent.on("value", (snapshot)=>{
                        const recentDB = snapshot.val();
                        const recentArray = [];

                        for(let id in recentDB){
                            recentArray.push({id, ...recentDB[id]});
                        }

                        setRecentData(recentArray);
                    })



                });; 
        
                });
            }
            else {
                setJoinModal(true)
            }
            })
        
    }, [])

    function handleJoinModal(){
        //db.ref(`boards/${boardID}/members/`).push(uid);

        db.ref(`boards/${boardID}/members/`).push({userID: uid, Name: name, photoURL: photo})
        window.location.reload()
        setJoinModal(false)
    }   

    //filespaces
    useEffect(() => {
        /*dbUsers.once('value',function (snapshotVal) {
            snapshotVal.forEach(function(data) {
                const snap = data.child('boards').child(boardID).val();
                if (snap != null){
                    db.ref(`users/${uid}`)
                        .orderByChild('boards')
                        .equalTo(boardID)
                        .once('value', function (snapshot) {
                            db.ref(`users/${uid}/boards/`).child(boardID).update(snap);
                        })
                }              
            })
        })*/
        
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

        //db.ref(`users/${uid}/boards/`).child(boardID).update(filespaces)

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
        db.ref(`boards/${boardID}/boardList/todo/${e}`).remove();
        
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
        db.ref(`boards/${boardID}/boardList/completed/${e}`).remove()
    }

    async function deleteTodo(e){
        db.ref(`boards/${boardID}/boardList/todo/${e}`).remove()
    }

    async function handleUndoComp(e, task){
        const undoComp = {
            task: task
        }
        await dbListTodo.push(undoComp);
        db.ref(`boards/${boardID}/boardList/completed/${e}`).remove();
    }

    /*function checkUser(board){
        console.log("check user")
        db.ref(`users/${uid}/boards/${board}/`).once("value", snapshot => {
            if (snapshot.exists()){
               console.log("exists!");
            } else {
                alert("Do you want to join board?")

            }

         });
    }*/



    /*useEffect(() => {

        const userId = auth.currentUser.uid;
        console.log(userId, auth.currentUser.displayName)

        db.ref(`users/${userId}/boards/${boardID}/`).once("value", snapshot => {
            if(!snapshot.exists()){
                dbUsers.once('value',function (snapshotVal) {
                snapshotVal.forEach(function(data) {
                    console.log("in")
                    const snap = data.child('boards').child(boardID).val();
                    if (snap != null){
                        console.log(snap);
                        db.ref(`users/${uid}/boards/`).child(boardID).set(snap)
                        //ref(`users/${uid}/boards/${boardID}`).push(snap)
                        /*set(db.ref(`users/${uid}/boards/${boardID}`), {
                            ${board} : snap
                        });
                    }
                    });
                })
            } else {
                console.log("board exists")
            }
        })
    }, [])*/

    async function handleInvite(obj){
        await db.ref(`users/${uid}/boards/`).child(boardID).update(obj);
    }

    async function deleteBoard(){
        await dbBoards.child(boardID).remove();
        setModalInfo(false)
        navigate("/")
    }

    function handleBoardInfo(){
        setModalInfo(true)
        boardData?.map(function(b){
            if(b.id == boardID){
                setBoardInfoName(b.boardName)
                setBoardInfoDesc(b.boardDesc)
                setCreatedBy(b.createdBy)
            }
        })
    }

    async function handleEditBoard(){
        dbBoards.child(boardID).update({'boardName': boardInfoName})
        dbBoards.child(boardID).update({'boardDesc': boardInfoDesc})
        dbBoards.child(boardID).update({'boardColor': boardInfoColor})

        setModalInfo(false)

    }

    async function removeActivity(activityID){
        await dbRecent.child(activityID).remove();

    }

    async function removeActivity(activityID){
        await dbRecent.child(activityID).remove();
    }

    async function deleteFilespace(id){
        await dbFilespace.child(id).remove();
    }

    return (    
        <Container fluid className="mt-3" style={{minHeight: "100vh"}}>
            <Row>  
            <Col className="col-sm-2">
                <NavBar />
            </Col>
            
            <Col className="col-sm-7">
            
            <Card className="shadow" style={{minHeight: "660px", borderRadius: 15}}>
            <Card.Body>
                <Row>
                    <Col className="col-sm-4">
                        <p onClick={() => handleBoardInfo()} id="infoButton"><FontAwesomeIcon icon={faQuestionCircle}/> Info</p>
                    </Col>
                    <Col className="col-sm-4">
                        {boardData == null? <p>No Board</p>
                        :
                        boardData.map(function(f){
                            if((f.id == boardID))
                                return(
                                    <p className="shadow" id="boardHeader" style={{color: "white", backgroundColor: f.boardColor}}><b>Team Boards</b></p>
                                )
                        })
                        }
                    </Col>
                    <Col className="col-sm-4">
                        <p onClick={() => setModalInvite(true)} id="inviteButton"><FontAwesomeIcon icon={faUserPlus}/> Invite</p>
                    </Col>
                </Row>
                <Container>
                <Row className="">
                    <Col className="col-sm-2 mt-1 ">
                    {boardData == null? <p>board data empty</p>
                    : 
                        boardData.map(function(board){
                        if((board.id == boardID))  
                            return (
                                <div>
                                    {console.log("insideif")}
                                    <div id="boardHead">
                                        <h5>{board.boardName}</h5> 
                                        <p style={{color: "grey", fontSize: "12px"}}>{board.boardDesc}</p>
                                    </div>
                                </div>
                            )
                        else {
                            <p>No data</p>
                        }
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
                <Row >
                    {typeof filespaceData == null? <p>33xxw</p>
                    :
                    filespaceData?.map(function(fs){
                        if(fs.id.length > 0){
                        return (
                            <div id="filespaceDiv">
                                <Link to={{pathname: `/filespace/${boardID}/${fs.id}`, state: {boardID: boardID, id: fs.id}}}  style={{textDecoration: 'none', color: "black"}}>
                                    <p id="boardFilespaceName">{fs.filespaceName}</p>
                                </Link>
                                <Dropdown id="boardEditFilespace" drop="end" style={{maxWidth: "20%"}}>
                                    <Dropdown.Toggle id="filespaceToggle" style={{backgroundColor: "white", border: 0}}>
                                        ...
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu   style={{fontSize: "10px", minWidth: "50px"}}>
                                        <Dropdown.Item onClick={() => deleteFilespace(fs.id)}><FontAwesomeIcon icon={faTrashAlt}/> Delete</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>  
                        )}
                        else {
                            return (<p>sum, sum</p>)
                        }
                    })
                    }
                </Row>
                </Container>
            </Card.Body>
            </Card>

            <Modal size="lg" show={modalInfo} onHide={() => setModalInfo(false)} aria-labelledby="boardInfo">
                  <Modal.Header closeButton>
                    <Modal.Title id="viewBoard">
                      Board Information
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group id="boardEditTitle">
                        <Form.Label>Board Name </Form.Label>
                        <Form.Control type="text" value={boardInfoName} onInput={(e) => setBoardInfoName(e.target.value)} required/>
                      </Form.Group>
                      <Form.Group id="boardEditDesc" style={{marginTop: "10px"}}>
                        <Form.Label>Board Description </Form.Label>
                        <Form.Control type="text" value={boardInfoDesc} onInput={(e) => setBoardInfoDesc(e.target.value)} rows={3} required/>
                      </Form.Group>
                      <Form.Group className="mb-3" style={{marginTop: "10px"}} controlId="boardColor">
                        <Form.Label>Board Theme Color</Form.Label>
                        <Form.Select value={boardInfoColor} aria-label="selectColor" onInput = {(e) => setBoardInfoColor(e.target.value)}>
                          <option value="#ff575f">Red</option>
                          <option value="#41993f">Green</option>
                          <option value="#69a2ff">Blue</option>
                          <option value="#02a6ac">Aqua</option>
                          <option value="#cc85ff">Purple</option>
                          <option value="#e06e38">Orange</option>
                        </Form.Select>
                    </Form.Group>
                      <Form.Group id="boardCreatedBy" style={{marginTop: "40px", color: "grey"}}>
                        <Form.Label>Created By: {createdBy}</Form.Label>
                      </Form.Group>
                      <Button style={{backgroundColor: "red", border: 0, marginTop: "20px"}}onClick={() => deleteBoard()}><FontAwesomeIcon icon={faTrashAlt}/> Delete Board</Button>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button onClick={() => handleEditBoard()} >Save</Button>
                  </Modal.Footer>
            </Modal>

            <Modal size="lg" show={joinModal} onHide={() => setJoinModal(false)} aria-labelledby="createBoard">
                  <Modal.Header closeButton>
                    <Modal.Title id="createBoard">
                      Join Team Board
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group id="joinTitle">
                        <Form.Label>Do you want to join this team board?</Form.Label>
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button onClick={() => handleJoinModal()} >Join</Button>
                    <Button onClick={() => window.location.reload()} >Close</Button>
                  </Modal.Footer>
            </Modal>


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

            <Modal size="lg" show={modalInvite} onHide={() => setModalInvite(false)} aria-labelledby="createBoard">
                  <Modal.Header closeButton>
                    <Modal.Title id="createBoard">
                      Invite Users <FontAwesomeIcon icon={faUserPlus}/>
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group id="boardName">
                        <Form.Label>Invite Link: <b style={{color: "#4176FF"}}>{window.location.href}</b>  <FontAwesomeIcon icon={faClipboard} style={{cursor: "pointer"}} onClick={() =>  navigator.clipboard.writeText(window.location.href)}Copy/></Form.Label>
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button onClick={() => setModalInvite(false)}>Close</Button>
                  </Modal.Footer>
            </Modal>

            </Col>
                <Col className="col-sm-3">
                <Card className="" style={{minHeight: "660px", borderRadius: 15, border: 0}}>
                
                <Card.Body>
                    <Card className="shadow" style={{minWidth: "20px", overflowY: "scroll", borderRadius: "15px"}}>
                        <Card.Body >
                            {membersData == null? <p>No members</p> :
                            membersData.map(function(m){
                                return(
                                    <div style={{display: "inline"}}>
                                        <img id="memberImage" style={{height: "30px", marginRight: "5px"}} data-tip={m.Name} src={m.photoURL}/>
                                        <ReactTooltip />
                                    </div>
                                )   
                            })
                            }
                        </Card.Body>
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
                                    <Tab id="tab" eventKey="todo" title="To do">
                                        <Form id="toDo" style={{display: "none"}}>
                                            <Form.Group>
                                                <Row>
                                                    <Col className="col-sm-8 mb-3">
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
                        <Card.Body style={{height: "150px", overflowY: "scroll", marginLeft: 5, marginBottm: 5}}>
                            {recentData == null? <p>Nothing to show</p> 
                            :
                            recentData.slice(0).reverse().map(function(r){
                                if(r.activity == "Edited")
                                return (
                                    <Row style={{paddingBottom: "5px"}}>
                                        <Col className="col-sm-9">
                                            <p style={{fontSize: "11px"}}>{r.user} <b style={{color: "#4176FF"}}> {r.activity}</b> <u> {r.fileName}</u></p>
                                        </Col>
                                        <Col className="col-sm-3">
                                            <span id="removeActivity" onClick={() => removeActivity(r.id)} style={{float: "right"}}>x</span>
                                        </Col>
                                    </Row>
                                )
                                else if(r.activity == "Deleted")
                                return (
                                    <Row style={{paddingBottom: "5px"}}>
                                        <Col className="col-sm-9">
                                            <p style={{fontSize: "11px"}}>{r.user} <b style={{color: "red"}}> {r.activity}</b> <u> {r.fileName}</u></p>
                                        </Col>
                                        <Col className="col-sm-3">
                                            <span id="removeActivity" onClick={() => removeActivity(r.id)} style={{float: "right"}}>x</span>
                                        </Col>
                                    </Row>
                                )
                                else if(r.activity == "Uploaded")
                                return (
                                    <Row style={{paddingBottom: "5px"}}>
                                        <Col className="col-sm-9">
                                            <p style={{fontSize: "11px"}}>{r.user} <b style={{color: "green"}}> {r.activity}</b> <u> {r.fileName}</u></p>
                                        </Col>
                                        <Col className="col-sm-3">
                                            <span id="removeActivity" onClick={() => removeActivity(r.id)} style={{float: "right"}}>x</span>
                                        </Col>
                                    </Row>
                                )
                            })
                            }

                        </Card.Body>
                    </Card>
                </Card.Body>

                </Card>
                </Col>
            </Row>
        </Container>
    )
}

