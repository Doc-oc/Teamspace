import React from "react";
import { Container } from "react-bootstrap";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Signup from "./Signup";
import { BrowserRouter , Outlet, Navigate, Router, Routes, Route} from 'react-router-dom'
import Home from "./Home"
import Login from "./Login"
import UserDetails from "./UserDetails";

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
                <Route path="/details" element={<UserDetails />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </div>
  )
}



export default App;
