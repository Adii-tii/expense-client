import {Route, Routes, Navigate} from "react-router-dom";
import { useState, useEffect} from "react";
import Login from "./pages/login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import AppLayout from "./components/AppLayout";
import CreateGroup from "./pages/CreateGroup";
import Dashboard from "./pages/DashBoard";
import axios from "axios";
import {BeatLoader} from "react-spinners";
import ResetPassword from "./pages/ResetPassword";

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function App() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true); 

  const isUserLoggedIn = async() => {
    try{
        const res = await axios.get("http://localhost:5001/auth/is-logged-in", {withCredentials: true});
        console.log(res.data)
        setUserDetails(res.data.user);
        console.log("this is the data: ", res.data);

        await wait(1000);
    }
    catch (error){
        setUserDetails(null);
        console.log(error);
    }
    finally {
    setLoading(false);
  }
  }

  const refreshAuth = async () => {
    setLoading(true);
    await isUserLoggedIn();
  };


  useEffect(() => { 
    isUserLoggedIn();
  }, [])
  
  //called when comp is rendered, if dependency array is not empty, any change in the state of the elements mentioned within the array will trigger the useEffect hook 
  
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa"
        }}
      >
        <BeatLoader color="#198754" size={15} />
      </div>
    );
  }


   return (
    <Routes>
      <Route
        path="/login"
        element={
          userDetails
            ? <Navigate to="/dashboard"/>
            : <Login refreshAuth={refreshAuth} />

        }
      />


      <Route
        path="/register"
        element={
          userDetails
            ? <Navigate to="/dashboard"/>
            : <Register refreshAuth={refreshAuth}/>
        }
      />

      <Route 
      path="/reset-password"
      element={<ResetPassword />}/>

      <Route element={<AppLayout user = {userDetails} setUserDetails={setUserDetails}/>}>
        <Route path="/" element={<Home/>} />

        <Route
          path="/dashboard"
          element={
            userDetails
              ? <Dashboard user={userDetails} />
              : <Navigate to="/login" />
          }
        />
      </Route>
    </Routes>
  );
}



export default App;