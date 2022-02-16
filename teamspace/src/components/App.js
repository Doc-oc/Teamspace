import React from "react";
import { Container } from "react-bootstrap";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Signup from "./Signup";
import { BrowserRouter , Outlet, Navigate, Router, Routes, Route} from 'react-router-dom'
import Home from "./Home"
import Login from "./Login"

//Checking if user is logged in 
function PrivateRoute({ children }) {
  const auth = useAuth();
  return auth ? children : <Navigate to="/login" />;
}


function App() {

  return (
        <div className="w-100">
          <BrowserRouter> 
            <AuthProvider>
              <Routes>
                <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>}/>
                <Route path="/signup" element={<Signup/>} />
                <Route path="/login" element={<Login/>} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </div>
  )
}



export default App;
