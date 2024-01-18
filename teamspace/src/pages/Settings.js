import React, { useState, useEffect } from "react"
import {Button, Card, Form, Alert, Container, Navbar, Nav, Modal, Dropdown, Accordion, Tab, ListGroup} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
//import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSlidersH, faClipboard, faUser, faSignOutAlt, faCog, faPlusCircle, faTrashAlt } from '@fortawesome/fontawesome-free-solid'
import '../styles/settings.css'
import { auth, logout, storage} from '../firebase';
import db from '../firebase'
import boardData from './Board';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";


export default function Settings() {
  const [error, setError] = useState("")
  //const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const name = auth.currentUser.displayName;
  const [modal, setModal] = useState(false);
  const [boardName, setBoardName] = useState();
  const [boardDesc, setBoardDesc] = useState();
  const [boardColor, setBoardColor] = useState();
  const [boards, setBoards] = useState();
  const [url, setURL] = useState();
  const [members, setMembers] = useState();
  const [boardID, setBoardID] = useState();
  const [display, setDisplay] = useState({display: 'none'});


  const uid = auth.currentUser.uid;
  const [email, setEmail] = useState(auth.currentUser.email)
  const [newPassword, setNewPassword] = useState();
  const [oldPassword, setOldPassword] = useState();
  const [newPassConfirm, setNewPassConfirm] = useState();

  const dbRef = db.ref(`boards/`);

  async function handleCreateBoard(){
    setModal(false)
    console.log("function")
        const boards = {
            boardName,
            boardDesc,
            boardColor,
            createdBy: uid
        }
        await dbRef.push(boards);


        setBoardName('');
        setBoardDesc('');
        setBoardDesc('');
  }

  useEffect(() => {
    

    dbRef.on("value", (snapshot)=>{
      const boardsFromDatabase = snapshot.val();
      const boardArray = [];
      for(let id in boardsFromDatabase){
          boardArray.push({id, ...boardsFromDatabase[id]});
      }
      setBoards(boardArray);
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

  async function deleteBoard(id){
    db.ref(`boards/${id}`).remove()
  }


  /*function handlePP(){
    const storageRef = ref(storage, `ProfilePictures/defaultpp.png`);        
        const uploadTask = uploadBytesResumable(storageRef, file);
    
        /*uploadTask.on("state_changed",(snapshot) => {
            const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            //setProgress(prog);
            },
            (error) => console.log(error),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  setURL(downloadURL)
                })
          })
  }*/
  
  function handleJoined(boardID){
    db.ref(`boards/${boardID}/members/`).on("value", (snapshot)=>{
        const membersFromDatabase = snapshot.val();
  
        const membersArray = [];
        for(let id in membersFromDatabase){
            membersArray.push({id, ...membersFromDatabase[id]});
        }
        setMembers(membersArray);
    })
  }

  async function handleNewEmail(){

  }

  async function handleNewPass(){

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
                    <Nav.Link><Link id="navlink" to={"/"}><FontAwesomeIcon icon={faClipboard}/>  Boards</Link></Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link className="rounded" style={{marginTop: "5px", marginBottom: "5px", backgroundColor: "#eef2fd", color: "black", padding: 3}}><Link id="navlink" to={"/settings"}><FontAwesomeIcon icon={faCog}/> Settings</Link></Nav.Link>
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

            <Col sm={10}>
            <Card id="settingsCard"className="text-center shadow" style={{minHeight: "660px", borderRadius: 15}}>
            <h4>Settings</h4>
            <Card.Body>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>About</Accordion.Header>
                    <Accordion.Body style={{fontSize: "11px" , textAlign: "Left", maxHeight: "200px", overflowY: "scroll"}}>
                    The breakout of COVID-19 has forced many workers and students to relocate from their traditional work or college environments to a workspace at home which can be unsuitable to many individuals. As explored by a lot of research, this massive change 
                    from work environments to virtual environments due to COVID-19 has dealt a big blow to collaboration among teams. Collaboration among teams is key to delivering goals and meeting deadlines.
                    The virtual environment makes it difficult to achieve this effectively as tools can be overly complicated or simply don’t have good enough team features.
                    <br></br>
                    <br></br>
                    Teamspace is a web application that is designed to improve the online experience when working in a team. Teamspace allows users to store and share team related files in an organised manner while being able to view, edit or delete files at the same time in real time.
                    The overall aim of this project is to provide a platform that improves the online collaboration experience for a team that needs to store and work on files together.
                    The name of this Web app Teamspace, comes from having a space for a team to collaborate in. The tools team choose are a major part of improving the experience.


                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Account</Accordion.Header>
                    <Accordion.Body style={{fontSize: "11px" , textAlign: "Left", maxHeight: "200px", overflowY: "scroll"}}>
                        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
                            <Row>
                                <Col sm={4}>
                                <ListGroup>
                                    <ListGroup.Item action href="#link1">
                                        Change Email
                                    </ListGroup.Item>
                                    <ListGroup.Item action href="#link2">
                                        Change Password
                                    </ListGroup.Item>
                                    <ListGroup.Item action href="#link3">
                                        Delete Account
                                    </ListGroup.Item>
                                </ListGroup>
                                </Col>
                                <Col sm={8}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="#link1">
                                        <Form >
                                            <Form.Group className="mb-3" controlId="newEmail">
                                                <Form.Label>Enter New Email:</Form.Label>
                                                <Form.Control style={{fontSize: "12px"}} className="mb-3" type="text" value={email} onInput={(e) => setEmail(e.target.value)} required/>
                                            </Form.Group>
                                            <Button id="formButton" style={{textAlign: "right"}} onClick={() => handleNewEmail()} >Save Email</Button>
                                        </Form>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="#link2">
                                        <Form>
                                            <Form.Group className="mb-3" controlId="newEmail">
                                                <Form.Label>Enter Old Password: </Form.Label>
                                                <Form.Control style={{fontSize: "12px"}} className="mb-3" type="text"  onInput={(e) => setOldPassword(e.target.value)} required/>
                                                <Form.Label>Enter New Password: </Form.Label>
                                                <Form.Control style={{fontSize: "12px"}} className="mb-3" type="text"  onInput={(e) => setNewPassword(e.target.value)} required/>
                                            </Form.Group>
                                            <Button id="formButton" style={{textAlign: "right"}} onClick={() => handleNewPass()} >Change Password</Button>
                                        </Form>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="#link3">
                                        <Form>
                                            <Form.Label>Enter phrase to delete account: <i style={{color: "grey"}}>Delete Teamspace Account</i> </Form.Label>
                                            <Form.Control style={{fontSize: "12px"}}className="mb-3" type="text"  onInput={(e) => setOldPassword(e.target.value)} required/>
                                            <Button style={{color: "white", backgroundColor: "red", fontSize:"12px", border: 0}}><FontAwesomeIcon icon={faTrashAlt}/> Delete Account</Button>
                                        </Form>
                                    </Tab.Pane>
                                </Tab.Content>
                                </Col>
                            </Row>
                        </Tab.Container>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2" >
                    <Accordion.Header>Help</Accordion.Header>
                    <Accordion.Body style={{fontSize: "11px" , textAlign: "Left", maxHeight: "200px", overflowY: "scroll"}}>
                    <b>What is a Team Board?</b>
                    <p>A team board is used to store and manage team related files using Filespaces. It is aimed to encourage users to stay organised and keep all team related files 
                        on the same platform that is accessible to all team members. Team boards are invite only. Users can manage tasks using the minimal to-do list feature
                    </p>
                    
                    <br></br>
                    <b>What is a Filespace?</b>
                    <p>A filespace is essentially a space for users files. It acts as a folder inside of the team boards. Filespaces are used to encourage
                        users to seperate their files into appropriate folders so they are easy accessible and easier to find. For example one filespace could be for UI/UX, another 
                        could be for the marketing team etc..
                    </p>
                    <br></br>
                    <b>How can I collaborate with team members on a file?</b>
                    <p>It is as simple as joining the same file at the same time. Once on the file begin typing and the other user(s) that are present in the file
                        can see what is being typed. Once the file is saved it is saved for all users.
                    </p>
                    <br></br>
                    <b>How do I create a Team board?</b>
                    <p>Any user can create a team board for their team. It is as simple as selecting the "New" button that is located on the home page for the users boards
                        . This will then prompt the user to enter in the board details into a form, once the form is completed just select create board. 
                    </p>
                    <br></br>
                    <b>What is the point of choosing a Board Color?</b>
                    <p>The idea of the board theme color is so that users can colour coordinate their boards. Users can label their boards by colour. For example
                        all boards related to work can be green, while all personal boards can be blue etc..
                    </p>
                    <b>Can a another user view my profile?</b>
                    <p>In the current version of Teamspace, only a user can view their own profile, other members of teamspace, do not have the capability to 
                        view a another users profile. This may be changed and added in future.
                    </p>


                    
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                    <Accordion.Header>Privacy Policy</Accordion.Header>
                    <Accordion.Body style={{fontSize: "10px" , textAlign: "Left", maxHeight: "200px", overflowY: "scroll"}}>
                    <h4>Privacy Policy</h4>
                    <p>Last updated: April 10, 2022</p>
                    <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
                    <p>We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy. This Privacy Policy has been created with the help of the <a href="https://www.freeprivacypolicy.com/blog/sample-privacy-policy-template/" target="_blank">Privacy Policy Template</a>.</p>
                    <h4>Interpretation and Definitions</h4>
                    <h5>Interpretation</h5>
                    <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
                    <h5>Definitions</h5>
                    <p>For the purposes of this Privacy Policy:</p>
                    <ul>
                    <li>
                    <p><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</p>
                    </li>
                    <li>
                    <p><strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to Teamspace.</p>
                    </li>
                    <li>
                    <p><strong>Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.</p>
                    </li>
                    <li>
                    <p><strong>Country</strong> refers to:  Ireland</p>
                    </li>
                    <li>
                    <p><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</p>
                    </li>
                    <li>
                    <p><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</p>
                    </li>
                    <li>
                    <p><strong>Service</strong> refers to the Website.</p>
                    </li>
                    <li>
                    <p><strong>Service Provider</strong> means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.</p>
                    </li>
                    <li>
                    <p><strong>Usage Data</strong> refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).</p>
                    </li>
                    <li>
                    <p><strong>Website</strong> refers to Teamspace, accessible from <a href="Teamspace" rel="external nofollow noopener" target="_blank">Teamspace</a></p>
                    </li>
                    <li>
                    <p><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</p>
                    </li>
                    </ul>
                    <h4>Collecting and Using Your Personal Data</h4>
                    <h5>Types of Data Collected</h5>
                    <h6>Personal Data</h6>
                    <p>While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:</p>
                    <ul>
                    <li>
                    <p>Email address</p>
                    </li>
                    <li>
                    <p>First name and last name</p>
                    </li>
                    <li>
                    <p>Usage Data</p>
                    </li>
                    </ul>
                    <h3>Usage Data</h3>
                    <p>Usage Data is collected automatically when using the Service.</p>
                    <p>Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>
                    <p>When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.</p>
                    <p>We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.</p>
                    <h3>Tracking Technologies and Cookies</h3>
                    <p>We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service. The technologies We use may include:</p>
                    <ul>
                    <li><strong>Cookies or Browser Cookies.</strong> A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service. Unless you have adjusted Your browser setting so that it will refuse Cookies, our Service may use Cookies.</li>
                    <li><strong>Flash Cookies.</strong> Certain features of our Service may use local stored objects (or Flash Cookies) to collect and store information about Your preferences or Your activity on our Service. Flash Cookies are not managed by the same browser settings as those used for Browser Cookies. For more information on how You can delete Flash Cookies, please read &quot;Where can I change the settings for disabling, or deleting local shared objects?&quot; available at <a href="https://helpx.adobe.com/flash-player/kb/disable-local-shared-objects-flash.html#main_Where_can_I_change_the_settings_for_disabling__or_deleting_local_shared_objects_" rel="external nofollow noopener" target="_blank">https://helpx.adobe.com/flash-player/kb/disable-local-shared-objects-flash.html#main_Where_can_I_change_the_settings_for_disabling__or_deleting_local_shared_objects_</a></li>
                    <li><strong>Web Beacons.</strong> Certain sections of our Service and our emails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages or opened an email and for other related website statistics (for example, recording the popularity of a certain section and verifying system and server integrity).</li>
                    </ul>
                    <p>Cookies can be &quot;Persistent&quot; or &quot;Session&quot; Cookies. Persistent Cookies remain on Your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close Your web browser. Learn more about cookies: <a href="https://www.freeprivacypolicy.com/blog/sample-privacy-policy-template/#Use_Of_Cookies_And_Tracking" target="_blank">Use of Cookies by Free Privacy Policy</a>.</p>
                    <p>We use both Session and Persistent Cookies for the purposes set out below:</p>
                    <ul>
                    <li>
                    <p><strong>Necessary / Essential Cookies</strong></p>
                    <p>Type: Session Cookies</p>
                    <p>Administered by: Us</p>
                    <p>Purpose: These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.</p>
                    </li>
                    <li>
                    <p><strong>Cookies Policy / Notice Acceptance Cookies</strong></p>
                    <p>Type: Persistent Cookies</p>
                    <p>Administered by: Us</p>
                    <p>Purpose: These Cookies identify if users have accepted the use of cookies on the Website.</p>
                    </li>
                    <li>
                    <p><strong>Functionality Cookies</strong></p>
                    <p>Type: Persistent Cookies</p>
                    <p>Administered by: Us</p>
                    <p>Purpose: These Cookies allow us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.</p>
                    </li>
                    </ul>
                    <p>For more information about the cookies we use and your choices regarding cookies, please visit our Cookies Policy or the Cookies section of our Privacy Policy.</p>
                    <h2>Use of Your Personal Data</h2>
                    <p>The Company may use Personal Data for the following purposes:</p>
                    <ul>
                    <li>
                    <p><strong>To provide and maintain our Service</strong>, including to monitor the usage of our Service.</p>
                    </li>
                    <li>
                    <p><strong>To manage Your Account:</strong> to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.</p>
                    </li>
                    <li>
                    <p><strong>For the performance of a contract:</strong> the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</p>
                    </li>
                    <li>
                    <p><strong>To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</p>
                    </li>
                    <li>
                    <p><strong>To provide You</strong> with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless You have opted not to receive such information.</p>
                    </li>
                    <li>
                    <p><strong>To manage Your requests:</strong> To attend and manage Your requests to Us.</p>
                    </li>
                    <li>
                    <p><strong>For business transfers:</strong> We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about our Service users is among the assets transferred.</p>
                    </li>
                    <li>
                    <p><strong>For other purposes</strong>: We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.</p>
                    </li>
                    </ul>
                    <p>We may share Your personal information in the following situations:</p>
                    <ul>
                    <li><strong>With Service Providers:</strong> We may share Your personal information with Service Providers to monitor and analyze the use of our Service,  to contact You.</li>
                    <li><strong>For business transfers:</strong> We may share or transfer Your personal information in connection with, or during negotiations of, any merger, sale of Company assets, financing, or acquisition of all or a portion of Our business to another company.</li>
                    <li><strong>With Affiliates:</strong> We may share Your information with Our affiliates, in which case we will require those affiliates to honor this Privacy Policy. Affiliates include Our parent company and any other subsidiaries, joint venture partners or other companies that We control or that are under common control with Us.</li>
                    <li><strong>With business partners:</strong> We may share Your information with Our business partners to offer You certain products, services or promotions.</li>
                    <li><strong>With other users:</strong> when You share personal information or otherwise interact in the public areas with other users, such information may be viewed by all users and may be publicly distributed outside.</li>
                    <li><strong>With Your consent</strong>: We may disclose Your personal information for any other purpose with Your consent.</li>
                    </ul>
                    <h5>Retention of Your Personal Data</h5>
                    <p>The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.</p>
                    <p>The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of Our Service, or We are legally obligated to retain this data for longer time periods.</p>
                    <h5>Transfer of Your Personal Data</h5>
                    <p>Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from Your jurisdiction.</p>
                    <p>Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer.</p>
                    <p>The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of Your data and other personal information.</p>
                    <h5>Disclosure of Your Personal Data</h5>
                    <h6>Business Transactions</h6>
                    <p>If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.</p>
                    <h6>Law enforcement</h6>
                    <p>Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).</p>
                    <h6>Other legal requirements</h6>
                    <p>The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:</p>
                    <ul>
                    <li>Comply with a legal obligation</li>
                    <li>Protect and defend the rights or property of the Company</li>
                    <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
                    <li>Protect the personal safety of Users of the Service or the public</li>
                    <li>Protect against legal liability</li>
                    </ul>
                    <h5>Security of Your Personal Data</h5>
                    <p>The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.</p>
                    <h4>Children's Privacy</h4>
                    <p>Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 13 without verification of parental consent, We take steps to remove that information from Our servers.</p>
                    <p>If We need to rely on consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require Your parent's consent before We collect and use that information.</p>
                    <h4>Links to Other Websites</h4>
                    <p>Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit.</p>
                    <p>We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</p>
                    <h4>Changes to this Privacy Policy</h4>
                    <p>We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.</p>
                    <p>We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the &quot;Last updated&quot; date at the top of this Privacy Policy.</p>
                    <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
                    <h4>Contact Us</h4>
                    <p>If you have any questions about this Privacy Policy, You can contact us:</p>
                    <ul>
                    <li>By email: dylanoconnor32@gmail.com</li>
                    </ul>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                    <Accordion.Header>Terms & Conditions</Accordion.Header>
                    <Accordion.Body style={{fontSize: "10px", textAlign: "Left", maxHeight: "200px", overflowY: "scroll"}}>
                        <h4>Terms and Conditions for Teamspace</h4>

                        <h5>Introduction</h5> 

                        <p>These Website Standard Terms and Conditions written on this webpage shall manage your use of our website, Teamspace accessible at Teamspace:localhost.</p>

                        <p>These Terms will be applied fully and affect to your use of this Website. By using this Website, you agreed to accept all terms and conditions written in here. You must not use this Website if you disagree with any of these Website Standard Terms and Conditions. These Terms and Conditions have been generated with the help of the <a href="https://www.termsandcondiitionssample.com">Terms And Conditiions Sample Generator</a>.</p>

                        <p>People below 13 years old are not allowed to use this Website.</p>

                        <h5>Intellectual Property Rights</h5>

                        <p>Other than the content you own, under these Terms, Teamspace and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>

                        <p>You are granted limited license only for purposes of viewing the material contained on this Website.</p>

                        <h5>Restrictions</h5>

                        <p>You are specifically restricted from all of the following:</p>

                        <ul>
                            <li>publishing any Website material in any other media;</li>
                            <li>selling, sublicensing and/or otherwise commercializing any Website material;</li>
                            <li>publicly performing and/or showing any Website material;</li>
                            <li>using this Website in any way that is or may be damaging to this Website;</li>
                            <li>using this Website in any way that impacts user access to this Website;</li>
                            <li>using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity;</li>
                            <li>engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website;</li>
                            <li>using this Website to engage in any advertising or marketing.</li>
                        </ul>

                        <p>Certain areas of this Website are restricted from being access by you and Teamspace may further restrict access by you to any areas of this Website, at any time, in absolute discretion. Any user ID and password you may have for this Website are confidential and you must maintain confidentiality as well.</p>

                        <h5>Your Content</h5>

                        <p>In these Website Standard Terms and Conditions, "Your Content" shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant Teamspace a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>

                        <p>Your Content must be your own and must not be invading any third-party’s rights. Teamspace reserves the right to remove any of Your Content from this Website at any time without notice.</p>

                        <h5>Your Privacy</h5>

                        <p>Please read Privacy Policy.</p>

                        <h5>No warranties</h5>

                        <p>This Website is provided "as is," with all faults, and Teamspace express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.</p>

                        <h5>Limitation of liability</h5>

                        <p>In no event shall Teamspace, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract.  Teamspace, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.</p>

                        <h5>Indemnification</h5>

                        <p>You hereby indemnify to the fullest extent Teamspace from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these Terms.</p>

                        <h5>Severability</h5>

                        <p>If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.</p>

                        <h5>Variation of Terms</h5>

                        <p>Teamspace is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.</p>

                        <h5>Assignment</h5>

                        <p>The Teamspace is allowed to assign, transfer, and subcontract its rights and/or obligations under these Terms without any notification. However, you are not allowed to assign, transfer, or subcontract any of your rights and/or obligations under these Terms.</p>

                        <h5>Entire Agreement</h5>
                            
                        <p>These Terms constitute the entire agreement between Teamspace and you in relation to your use of this Website, and supersede all prior agreements and understandings.</p>

                        <h5>Governing Law & Jurisdiction</h5>

                        <p>These Terms will be governed by and interpreted in accordance with the laws of the State of ie, and you submit to the non-exclusive jurisdiction of the state and federal courts located in ie for the resolution of any disputes.</p>
                    </Accordion.Body>
                </Accordion.Item>
                </Accordion>
              </Card.Body>
            </Card>


            </Col>
          </Row>
      </Container>


  )
}