import React, {useEffect, useState} from "react";
//import { AuthProvider, useAuth } from "../context/AuthContext";
import Signup from "./Signup";
import { BrowserRouter, Routes, Route, useNavigate, Link, useLocation, Router, Navigate, Outlet} from 'react-router-dom'
import Home from "./Home"
import Login from "./Login"
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../firebase";
import Board from "./Board";
import Filespace from "./Filespace";
import TextEditor from "./TextEditor";
import Profile from "./Profile";
import Settings from "./Settings"


function App() {


  const ProtectedRoute = props => {
    
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(); // neither true nor false
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged( (currentUser) => {
        setIsLoggedIn(currentUser); // sets user object or null
      });
  
      return unsubscribe; // cleanup auth subscription!
    }, []);
  
    if (isLoggedIn === undefined) return null; 
    
    return isLoggedIn ? (
      <Outlet {...props} />
    ) : (
      <Navigate
        to={{
          pathname: "/login",
          state: { location }, // <-- pass current location
        }} replace 
      />
    );
  };


    
  return (
        <div className="w-100">

          <BrowserRouter> 
              

            <Routes>
                  <Route path="/login" element={<Login/>} />
                  <Route path="/signup" element={<Signup />} />
                  <Route element={<ProtectedRoute/>}>
                    <Route path="/" element={<Home />}/>
                    <Route path="/board/:boardID" element={<Board />}/>
                    <Route path="/filespace/:boardID/:id" element={<Filespace />}/>
                    <Route path="/profile" element={<Profile />}/>
                    <Route path="/settings" element = {<Settings />}/>
                    <Route path="texteditor/:boardID/:id/:fileID" element={<TextEditor />}/>
                  </Route>
                  <Route path="/*" element={<h1>404: Page not Found</h1>} />
              </Routes>
            
          </BrowserRouter>
        </div>
  )
}



export default App;
