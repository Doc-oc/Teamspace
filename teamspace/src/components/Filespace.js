import React, { useState, useEffect } from "react"
import {Button, Card, Form, Alert, Container, Navbar, Nav, Modal, Dropdown, Tabs, Tab, FormControl} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
//import { useAuth } from "../context/AuthContext"
import { useNavigate, Link, useParams } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faCheck, faUndoAlt, faClipboard, faUser, faSignOutAlt, faTrashAlt, faPlusCircle, faEdit, faArrowAltCircleLeft, faCalendarPlus, faEye} from '@fortawesome/fontawesome-free-solid'
import { firebase, auth, logout, storage } from '../firebase';
import { set } from "firebase/database";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import db from '../firebase'
import '../styles/filespace.css'
import TextEditor from './TextEditor'
import ReactTooltip from 'react-tooltip';



export default function Filespace() {

    const { boardID, id } =  useParams();

    const [show, setShow] = useState(false);
    const [error, setError] = useState("")
    //const { currentUser, logout } = useAuth()
    const navigate = useNavigate()
    const name = auth.currentUser.displayName;
    const [modal, setModal] = useState(false);

    //filespace
    const [filespaceData, setFilespaceData] = useState();
    const [fileName, setFileName] = useState();
    const [fileData, setFileData] = useState();
    const [fileText, setFileText] = useState();
    const [filespaceHeader, setFilespaceHeader] = useState();
    const [filespaceDesc, setFilespaceDesc] = useState();
    const [boardData, setBoardData] = useState();
    const [fileViews, setFileViews] = useState();

    //todo 
    const [toDo, setToDo] = useState();
    const [todoData, setTodoData] = useState();
    const [completedData, setCompletedData] = useState();
    const [display, setDisplay] = useState({display: 'none'});
    const uid = auth.currentUser.uid;
    const [membersData, setMembersData] = useState();

    const dbFilespace = db.ref(`boards/${boardID}/filespace`)
    const dbFiles = db.ref(`boards/${boardID}/filespace/${id}/files`)
    const dbListTodo = db.ref(`boards/${boardID}/boardList/todo`)
    const dbListComp = db.ref(`boards/${boardID}/boardList/completed`)
    const dbMembers = db.ref(`boards/${boardID}/members`);
    const dbBoards = db.ref(`boards`);
    const dbRecent = db.ref(`boards/${boardID}/recentActivity/`)

    const [recentData, setRecentData] = useState();

    const userID = auth.currentUser.uid;
    const [searchData, setSearchData] = useState();
    const [search, setSearch] = useState("");

    const [count, setCount] = useState(0)

    const [createModal, setCreateModal] = useState(false);
    const [newFileName, setNewFileName] = useState();

    useEffect(() => {
        dbFilespace.on("value", (snapshot)=>{

            const filespaceDB = snapshot.val();
            const filespaceArray = [];
            for(let id in filespaceDB){
                filespaceArray.push({id, ...filespaceDB[id]});
            }        
            setFilespaceData(filespaceArray)
        });

        dbMembers.on("value", (snapshot)=>{
            const membersDB = snapshot.val();
            const membersArray = [];

            for(let id in membersDB){
                membersArray.push({id, ...membersDB[id]});
            }

            setMembersData(membersArray);
        })

        dbBoards.on("value", (snapshot)=>{
            const boardsDB = snapshot.val();
            
            const boardsArray = [];
            for(let id in boardsDB){
                boardsArray.push({id, ...boardsDB[id]});
            }
        setBoardData(boardsArray);
        })

        dbRecent.on("value", (snapshot)=>{
            const recentDB = snapshot.val();
            const recentArray = [];

            for(let id in recentDB){
                recentArray.push({id, ...recentDB[id]});
            }

            setRecentData(recentArray);
        })

        
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
    const handleUpload = (e) => {
        e.preventDefault();

        const file = e.target[0].files[0];
        uploadFile(file);
    };

    const uploadFile = (file) => {
        //
        if (!file) return;
        const storageRef = ref(storage, `files/${file.name}`);        
        const uploadTask = uploadBytesResumable(storageRef, file);
    
        uploadTask.on("state_changed",(snapshot) => {
            const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            //setProgress(prog);
            },
            (error) => console.log(error),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    const xhr = new XMLHttpRequest();
                    var data = '';
                    xhr.open('GET', downloadURL);
                    xhr.responseType = 'text';
                    xhr.onload = (event) => {
                        if (xhr.readyState === xhr.DONE) {
                            if (xhr.status === 200) {
                                data = xhr.responseText;
                                databaseFile(downloadURL, data);
                            }
                        }
                    };
                    xhr.send()
                });
            }
        );
    };

    async function databaseFile(url, data){
        var httpsReference = storage.refFromURL(url);
        const fileName = httpsReference.name;
        const file = {
            fileName,
            fileURL: url,
            fileData: data,
            fileViews: 0
        }
        await dbFiles.push(file);

        updateActivityUpload(fileName);
        setFileText('');
    }

    useEffect(() => {
        dbFiles.on("value", (snapshot)=>{
            const fileDB = snapshot.val();
            const fileArray = [];
            for(let id in fileDB){
                fileArray.push({id, ...fileDB[id]});
            }        
            setFileData(fileArray)
            setSearchData(fileData.filter((fs) => fs.fileName.toLowerCase().includes(search.toLowerCase())))
        
        });
    }, [search])


    function deleteFile(fileID, fileName){
        console.log(fileID)
        updateActivityDelete(fileName)
        db.ref(`boards/${boardID}/filespace/${id}/files/${fileID}`).remove()
        
    }

    async function updateActivityDelete(fileName){
        //we every time we save we want to add edit
        // file name, user, edit
        const recentActivity = {
        fileName,
        user: name,
        activity: "Deleted"
        }

        await dbRecent.push(recentActivity);
    }

    async function updateActivityUpload(fileName){
        //we every time we save we want to add edit
        // file name, user, edit
        const recentActivity = {
          fileName,
          user: name,
          activity: "Uploaded"
        }
    
        await dbRecent.push(recentActivity);
      }



    function editDetails(){
        
        filespaceData?.map(function(f){
            console.log(id)
            if(f.id == id){
                setFilespaceHeader(f.filespaceName)
                setFilespaceDesc(f.filespaceDesc)
            }
        })
        document.getElementById("filespaceHeader").style.display = "none"
        document.getElementById("editFilespace").style.display = "block"

        ;
    }

    //editing filespace info
    function handleEdit(){
        dbFilespace.child(id).update({'filespaceName': filespaceHeader})
        dbFilespace.child(id).update({'filespaceDesc': filespaceDesc})

        document.getElementById("filespaceHeader").style.display = "block"
        document.getElementById("editFilespace").style.display = "none"

        setFilespaceHeader('');
        setFilespaceDesc('')
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

    function increaseCount(fileID, fileViews){
        db.ref(`boards/${boardID}/filespace/${id}/files/${fileID}/`).update({"fileViews": fileViews + 1})
    }

    async function removeActivity(activityID){
        await dbRecent.child(activityID).remove();

    }

    async function createNewFile(){
        const newFile = {
            fileName: newFileName,
            fileURL: null,
            fileData: "",
            fileViews: 0
        }
        await dbFiles.push(newFile);
        setCreateModal(false);
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
                    <img src={auth.currentUser.photoURL} className="img-responsive w-50 mt-5 roundedCircle"></img>
                    <br></br>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {name}
                    <br></br>
                    <Nav className="col-md-12 d-none d-md-block mt-5 mb-5 sidebar text-center navbar-custom" activeKey="/home">
                    <div className="sidebar-sticky"></div>
                    <Nav.Item>
                    <Nav.Link><Link id="navlink" to={"/profile"}><FontAwesomeIcon icon={faUser}/> Profile</Link></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className="rounded" style={{marginTop: "5px", marginBottom: "5px", backgroundColor: "#eef2fd", color: "black", padding: 3}}><Link id="navlink" to={"/"}><FontAwesomeIcon icon={faClipboard}/>  Boards</Link></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link><Link id="navlink" to={"/settings"}><FontAwesomeIcon icon={faCog}/> Settings</Link></Nav.Link>
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
                <Row>
                    <Col className="col-sm-4">
                        <Link to={{pathname: `/board/${boardID}`, state: {boardID: boardID}}}  style={{textDecoration: 'none', color: "black"}}>
                            <p  id="backButton"><FontAwesomeIcon icon={faArrowAltCircleLeft}/> Team Board</p>
                        </Link>
                    </Col>
                    <Col className="col-sm-4">
                        {boardData == null? <p>No Board</p>
                        :
                        boardData.map(function(f){
                            if((f.id == boardID))
                                return(
                                    <p className="shadow" id="boardHeader" style={{color: "white", backgroundColor: f.boardColor}}><b>Filespace</b></p>
                                )
                        })
                        }
                    </Col>
                    <Col className="col-sm-4">
                        <p onClick={() => editDetails()} id="editFilespaceButton"><FontAwesomeIcon icon={faEdit}/> Edit</p>
                    </Col>
                </Row>

                <Container>
                <Row className="">
                    <Col className=" mt-1 ">
                    {filespaceData == null? <p>FSDATA IS NULL</p> :
                    filespaceData.map(function(fs){
                        if(fs.id == id)
                        {
                            return (
                                <div>
                                    <div id="filespaceHeader">
                                        <h5>{fs.filespaceName}</h5> 
                                        <p style={{color: "grey", fontSize: "12px"}}>{fs.filespaceDesc}</p>
                                    </div>

                                    <div id="editFilespace" style={{display: "none"}}>
                                        <Form >
                                        <Form.Group id="fileName">
                                            <Form.Control className="mb-3" type="text" value={filespaceHeader} onInput={(e) => setFilespaceHeader(e.target.value)} required/>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="boardDesc">
                                            <Form.Control as="textarea" value={filespaceDesc} onInput={(e) => setFilespaceDesc(e.target.value)} rows={3} />
                                        </Form.Group>
                                        <Button id="formButton" style={{textAlign: "right"}} onClick={() => handleEdit()} >Save Changes</Button>
                                        </Form>
                                    </div>
                                </div>
                            )
                        }
                    })
                    }
                    </Col>
                </Row>


                
                <Modal size="md" show={modal} onHide={() => setModal(false)} aria-labelledby="uploadFile">
                  <Modal.Header closeButton>
                    <Modal.Title id="uploadFile">
                      Upload File
                    </Modal.Title>
                  </Modal.Header>
                  <Form onSubmit={handleUpload}>
                    <Modal.Body>
                        <Form.Group id="fileName">
                            <Form.Control type="file" required />
                        </Form.Group>
                    </Modal.Body>
                    
                    <Modal.Footer>
                        <Button type="submit" onClick={() => setModal(false)}>Upload File</Button>
                    </Modal.Footer>
                  </Form>
                </Modal>
                </Container>
                <Row>
                    <Col className="col-sm-9 mt-4 mr-3">
                        <Form>
                            <Form.Control type="text" placeholder="Search" onInput={(e) => setSearch(e.target.value)} style={{marginLeft: "30px", marginBottom: "20px"}}/>
                        </Form>
                    </Col>


                    <Col className="col-sm-2">
                        <Dropdown>
                            <Dropdown.Toggle id="upload">
                                <FontAwesomeIcon icon={faPlusCircle}/> New
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setModal(true)}>Upload</Dropdown.Item>
                                <Dropdown.Item onClick={() => setCreateModal(true)}>Create New</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
                

                <Modal size="md" show={createModal} onHide={() => setCreateModal(false)} aria-labelledby="uploadFile">
                  <Modal.Header closeButton>
                    <Modal.Title id="newFileTitle">
                        File Name
                    </Modal.Title>
                  </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group id="newFileName">
                                <Form.Control type="text" value={newFileName} onInput={(e) => setNewFileName(e.target.value)} required />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    
                    <Modal.Footer>
                        <Button type="submit" onClick={() => createNewFile()}>Create</Button>
                    </Modal.Footer>
                </Modal>

                <Row id="displayFile" style={{marginLeft: "10px"}}>
                    {search.length > 0?
                    searchData?.map(function(s){
                        return (
                            <Col className="col-sm-2 mt-3" >
                                <Card  id="fileCard" className="shadow text-center" style={{minHeight: "80px", maxWidth: "90px", borderRadius: 15, borderTopLeftRadius: 15, borderTopRightRadius: 15, fontSize: "12px"}}>
                                    <span id="deleteButton" onClick={() => deleteFile(s.id)} style={{textAlign: "right", margin: 5, fontSize: "16px"}}><FontAwesomeIcon display={display} icon={faTrashAlt}/></span>
                                    <Card.Body style={{backgroundColor: "white", borderTopLeftRadius: 15, borderTopRightRadius: 15}}></Card.Body>
                                    <Link to={{pathname: `/texteditor/${boardID}/${id}/${s.id}`, state:{boardID: boardID, id: id, fileID: s.id}}}  style={{textDecoration: 'none', color: "black"}} style={{textDecoration: 'none', color: "black"}}>
                                        <Card.Footer>{s.fileName}</Card.Footer>
                                    </Link>
                                </Card>
                            </Col>
                        )
                    })
                    : 
                        fileData?.map(function(file){
                            return (
                                <Col className="col-sm-2 mt-3">
                                <Card  id="fileCard" className="shadow text-center" style={{minHeight: "80px", minWidth: "110px", borderRadius: 15, borderTopLeftRadius: 15, borderTopRightRadius: 15, fontSize: "12px"}}>
                                    <span id="deleteButton" onClick={() => deleteFile(file.id, file.fileName)} style={{textAlign: "right", margin: 5, fontSize: "16px"}}><FontAwesomeIcon display={display} icon={faTrashAlt}/></span>
                                    <Card.Body style={{backgroundColor: "white", borderTopLeftRadius: 15, borderTopRightRadius: 15}}></Card.Body>
                                    <Link to={{pathname: `/texteditor/${boardID}/${id}/${file.id}`, state:{boardID: boardID, id: id, fileID: file.id}}}  style={{textDecoration: 'none', color: "black"}} style={{textDecoration: 'none', color: "black"}}>
                                        <Card.Footer id="fileCardFooter" onClick={() => increaseCount(file.id, file.fileViews)}>
                                            {file.fileName}  <b style={{fontSize: "8px", marginLeft: "8px"}}><FontAwesomeIcon style={{fontSize: "8px", marginLeft: "5px"}} icon={faEye}/> {file.fileViews}</b>
                                        </Card.Footer>
                                    </Link>
                                </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Card.Body>
            </Card>
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
                                            <img style={{height: "30px", marginRight: "5px"}} data-tip={m.Name} src={m.photoURL}/>
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
                                            <span id="removeActivityFS" onClick={() => removeActivity(r.id)} style={{float: "right"}}>x</span>
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
                                            <span id="removeActivityFS" onClick={() => removeActivity(r.id)} style={{float: "right"}}>x</span>
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
                                            <span id="removeActivityFS" onClick={() => removeActivity(r.id)} style={{float: "right"}}>x</span>
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

