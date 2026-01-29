import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="navbar bg-dark">
      <div className="container d-flex justify-content-between">
        {/* Brand */}
        <Link to="/" className="navbar-brand text-light">
          Expense
        </Link>

        {/* Center links */}
        <div className="d-flex gap-3">
          <Link to="/" className="nav-link text-light">
            Home
          </Link>
          <Link to="/about" className="nav-link text-light">
            About Us
          </Link>
        </div>

        {/* Auth links */}
        <div className="d-flex gap-3">
          <Link to="/login" className="nav-link text-light">
            Login
          </Link>
          <Link to="/register" className="nav-link text-light">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;
