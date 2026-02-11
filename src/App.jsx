import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/DashBoard";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import ResetPassword from "./pages/ResetPassword";
import UserLayout from "./components/userLayout";
import { serverEndpoint } from "./config/appConfig";
import { useSelector, useDispatch } from "react-redux"; //implement redux store to manage user state
import { SET_USER } from "./redux/user/action.js";
import Groups from "./pages/Groups.jsx";
import ManageUsers from "./pages/ManageUsers.jsx";
import GroupDetails from "./pages/GroupDetails.jsx";
import Profile from "./pages/Profile.jsx";
import ManagePayments from "./pages/ManagePayments.jsx";
import ManageSubscription from "./pages/ManageSubscriptions.jsx";
import Transactions from "./pages/Transactions.jsx";
  
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
//value of user details represents whether the user is logged in or not/ userSelector takes in 1 func as input and redux calls the fucntion that you pass to useSelector with all the values its storing or managaing. we need to take out userdetails since we are only interested in userDetails object.

function App() {
  const dispatch = useDispatch();
  const userDetails = useSelector(state => state.userDetails);
  const [loading, setLoading] = useState(true);

  const getUser = async () => { //make this getUser()
    try {
      const res = await axios.get(`${serverEndpoint}/auth/get-user`, { withCredentials: true });
      console.log(res.data)
      dispatch({ type: SET_USER, payload: res.data.user }); //update user details in redux store
      console.log("updated formatted data: ", res.data.user);

      await wait(1000);
    }
    catch (error) {
      console.log("Error fetching user data:", error);
    }
    finally {
      setLoading(false);
    }
  }

  const refreshAuth = async () => {
    setLoading(true);
    await getUser();
  };


  useEffect(() => {
    getUser();
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
        <BeatLoader color="black" size={15} />
      </div>
    );
  } 


  return (
    <Routes>
      <Route
        path="/login"
        element={
          userDetails
            ? <Navigate to="/dashboard" />
            : <Login refreshAuth={refreshAuth} />

        }
      />


      <Route
        path="/register"
        element={
          userDetails
            ? <Navigate to="/dashboard" />
            : <Register refreshAuth={refreshAuth} />
        }
      />

      <Route
        path="/manage-users"
        element={
          userDetails ? (
            <UserLayout>
              <ManageUsers />
            </UserLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/profile"
        element={
          userDetails ? (
            <UserLayout>
              <Profile />
            </UserLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/manage-payments"
        element={
          userDetails ? (
            <UserLayout>
              <ManagePayments />
            </UserLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/manage-subscriptions"
        element={
          userDetails ? (
            <UserLayout>
              <ManageSubscription />
            </UserLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />


      <Route
        path="/reset-password"
        element={<ResetPassword />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          userDetails
            ? <UserLayout><Dashboard /></UserLayout>
            : <Navigate to="/login" />
        }
      />

      <Route
        path="/groups"
        element={
          userDetails
            ? <UserLayout><Groups /></UserLayout>
            : <Navigate to="/login" />
        }
      />

      <Route
      path = "/groups/:groupId"
      element={
        userDetails
        ? <UserLayout ><GroupDetails /></UserLayout>
        : <Navigate to="/login"/>
      }
      />

      <Route
      path = "/transactions"
      element={
        userDetails
        ? <UserLayout ><Transactions /></UserLayout>
        : <Navigate to="/login"/>
      }
      />


    </Routes>
  );
}



export default App;