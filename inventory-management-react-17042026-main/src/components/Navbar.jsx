import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.webp';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container">
        <NavLink className="navbar-brand d-flex align-items-center" to="/dashboard">
          <img src={logo} alt="Logo" height="48" className="me-2" />
        </NavLink>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-2">
            <li className="nav-item"><NavLink className="nav-link" to="/dashboard">Dashboard</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/add-item">Register Item</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/view-items">View Items</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/profile">Profile</NavLink></li>
       
          </ul>
        </div>
      </div>
    </nav>
  );
}