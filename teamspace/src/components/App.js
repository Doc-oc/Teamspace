import React from "react";
//import { AuthProvider, useAuth } from "../context/AuthContext";
import Signup from "./Signup";
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from "./Home"
import Login from "./Login"
import UserDetails from "./UserDetails";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../firebase";
import Board from "./Board";
import Filespace from "./Filespace";
import TextEditor from "./TextEditor";
/*state = { data: null };

function componentDidMount() {
  this.callBackendAPI()
    .then(res => this.setState({ data: res.express }))
    .catch(err => console.log(err));
}
  // fetching the GET route from the Express server which matches the GET route from server.js
callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };*/

//Checking if user is logged in 


function App() {
  const [user] = useAuthState(auth);

  return (
        <div className="w-100">

          <BrowserRouter> 
          {user == null? 
              <Routes>
                <Route path="/login" element={<Login/>} />
                <Route path="/signup" element={<Signup />} />
              </Routes>
              :
              <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/details" element={<UserDetails />} />
                <Route path="/board/:boardID" element={<Board />}/>
                <Route path="/filespace/:boardID/:id" element={<Filespace />}/>
                <Route path="texteditor/:boardID/:id/:fileID" element={<TextEditor />}/>
              </Routes>
          }
          </BrowserRouter>
        </div>
  )
}



export default App;
