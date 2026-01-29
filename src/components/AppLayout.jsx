import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function AppLayout(){
    return(
        <>
            <Header />
            <main className="container mt-4"></main>
                <Outlet />
            <Footer />
        </>
    )
}

export default AppLayout;