import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', hospital: '' });
  const [error, setError] = useState('');

  const allowedUsers = [
    { username: 'a@123', password: 'A@123' },
    { username: 'nilesh', password: 'Hvd@123' },
    { username: 'komal', password: 'Hvd@123' },
    { username: 'abhishek', password: 'Hvd@123' },
    { username: 'pramod', password: 'Hvd@123' },
    { username: 'afhaan', password: 'Hvd@123' },
    { username: 'kalpesh', password: 'Hvd@123' },
    { username: 'user', password: 'Hvd@123' },
    { username: 'user1', password: 'Hvd@123' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const matchedUser = allowedUsers.find(
      (u) => u.username.toLowerCase() === form.username.trim().toLowerCase() && u.password === form.password
    );

    if (matchedUser && form.hospital) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', form.username.trim());
      localStorage.setItem('selectedHospital', form.hospital);
      navigate('/dashboard', { replace: true });
    } else {
      setError('Invalid credentials or hospital not selected');
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="login-card card">
        <div className="card-body p-5">
          <div className="text-center mb-5">
            <h1 className="fw-bold text-primary mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Inventory Manager
            </h1>
            <p className="text-muted">Professional Hospital Asset Management</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-medium">Username</label>
              <input
                type="text"
                className="form-control"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium">Password</label>
              <input
                type="password"
                className="form-control"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium">Select Hospital</label>
              <select
                className="form-select"
                value={form.hospital}
                onChange={(e) => setForm({ ...form, hospital: e.target.value })}
                required
              >
                <option value="">Choose Location</option>
                <option value="main">P.B.M.A H.V. Desai Hospital</option>
  
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-3">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}