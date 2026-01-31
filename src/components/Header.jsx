import { Link } from "react-router-dom";
import axios from "axios";

function Header({user, setUserDetails}) {
  const logout = async() =>{
      try{
        await axios.get("http://localhost:5001/auth/logout", {withCredentials: true});
        setUserDetails(null);
        
      } catch (error){
        console.log(error);
      }
    }

  return (
    <nav className="navbar bg-dark">
      <div className="container d-flex justify-content-between">
        <Link to="/" className="navbar-brand text-light">
          Expense
        </Link>

        <div className="d-flex gap-3">
          {user ? (
            <Link to="/dashboard" className="nav-link text-light">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/" className="nav-link text-light">
                Home
              </Link>
              <Link to="/about" className="nav-link text-light">
                About Us
              </Link>
            </>
          )}
        </div>


        <div className="d-flex gap-3">
          {user? <Link to="/" className="nav-link text-light" onClick={() => logout()}>
            Log out 
          </Link> : <Link to="/login" className="nav-link text-light">
            Login
          </Link>}
          <Link to="/register" className="nav-link text-light">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;
