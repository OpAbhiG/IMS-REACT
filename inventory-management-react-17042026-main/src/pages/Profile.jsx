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

  return (
    <div className="container py-5">
      
<PageHeader
  title="User Profile"
  subtitle="Manage your account details"
  icon="bi-person-circle"
/>

      

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body p-5">
              {/* <h4 className="mb-4">About PBMA's</h4>
              <p>
                Founded on 2nd October, 1952 by Late Mr. Tukaram Sahadeo Bamankar and fellow blind persons, PBMA started with a small room providing welfare services for the blind community. 
                With support from dedicated individuals, PBMA has grown into one of India's most recognized organizations for the visually impaired.
              </p> */}

              <div className="mt-5 p-4 bg-light rounded-3">
                <h5>Current Location</h5>
                <p className="fs-5 fw-semibold text-primary mt-2">{hospital}</p>
              </div>

              <div className="text-center mt-5">
                <button className="btn btn-danger px-5 py-3" onClick={handleLogout}>
                  Logout Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}