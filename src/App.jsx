import {Route, Routes} from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import AppLayout from "./components/AppLayout";
import CreateGroup from "./pages/CreateGroup";

function App(){
  return(
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/createGroup" element={<CreateGroup/>}/>
      </Route>
      
    </Routes>
  )
}

export default App;