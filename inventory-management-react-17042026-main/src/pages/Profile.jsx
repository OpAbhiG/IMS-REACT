import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

export default function Profile() {
  const navigate = useNavigate();
  const [hospital, setHospital] = useState("H.V. Desai Eye Hospital");

  useEffect(() => {
    const selected = localStorage.getItem('selectedHospital') || 'main';
    const names = {
      main: "P.B.M.A H.V. Desai Hospital",
      solapur: "Shankarsheth Sable Eye Hospital Solapur",
      'pune-east': "Pune East Vision Center"
    };
    setHospital(names[selected] || "H.V. Desai Eye Hospital");
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  const username = localStorage.getItem('username') || 'a@123';
  const displayName = localStorage.getItem('displayName') || (username === 'a@123' ? 'Administrator' : username.charAt(0).toUpperCase() + username.slice(1));

  return (
    <div className="container py-5">
      <PageHeader
        title="User Profile"
        subtitle="Manage your account details and hospital location"
        icon="bi-person-circle"
      />

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow border-0">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex align-items-center gap-4 mb-4 pb-4 border-bottom">
                <div 
                  className="bg-primary text-white d-flex align-items-center justify-content-center rounded-circle fs-1" 
                  style={{ width: '80px', height: '80px' }}
                >
                  <i className="bi bi-person-fill"></i>
                </div>
                <div>
                  <h3 className="mb-1 text-capitalize">{displayName}</h3>
                  <p className="text-muted mb-0">{username}</p>
                </div>
              </div>

              {/* <div className="row g-4 mb-5">
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3 h-100">
                    <h6 className="text-muted mb-2">Hospital Branch</h6>
                    <p className="fs-5 fw-semibold text-primary mb-0">{hospital}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3 h-100">
                    <h6 className="text-muted mb-2">System Access</h6>
                    <p className="fs-5 fw-semibold text-success mb-0">Full Access (Read/Write)</p>
                  </div>
                </div>
              </div> */}


              <div className="text-center border-top pt-4">
                <button className="btn btn-danger px-5 py-3" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i> Logout Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}