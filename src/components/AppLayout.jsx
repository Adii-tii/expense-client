import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function AppLayout({user, setUserDetails}){
    return(
        <>
            <Header user={user} setUserDetails={setUserDetails}/>
                <Outlet />
            <Footer />
        </>
    )
}

export default AppLayout;