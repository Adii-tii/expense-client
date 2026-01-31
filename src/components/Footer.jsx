import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-light mt-auto">
      <div className="container py-4">
        <div className="row">

          {/* Brand */}
          <div className="col-md-4 mb-3">
            <h5 className="fw-semibold">Expense</h5>
            <p className="text-muted small mb-0">
              Track shared expenses easily.
            </p>
          </div>

          {/* Links */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-semibold">Quick Links</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-light text-decoration-none">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-light text-decoration-none">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-light text-decoration-none">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-semibold">Legal</h6>
            <ul className="list-unstyled">
              <li className="text-muted small">Privacy Policy</li>
              <li className="text-muted small">Terms of Service</li>
            </ul>
          </div>

        </div>

        <hr className="border-secondary" />

        <div className="text-center text-muted small">
          © {new Date().getFullYear()} Splitwise. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
