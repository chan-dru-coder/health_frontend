import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, LogIn, UserCheck, Stethoscope, Heart } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email, password);

      // Verify selected role matches user's registered role (or inform user)
      if (role && loggedUser.role !== role) {
        // If user logged in as doctor with patient radio, adapt to their real account role
        console.warn(`User role is actually ${loggedUser.role}`);
      }

      // Redirect by actual role
      if (from) {
        navigate(from, { replace: true });
      } else if (loggedUser.role === 'doctor') {
        navigate('/doctor/appointments', { replace: true });
      } else {
        navigate('/my-appointments', { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        'Unable to log in. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Logins
  const handleDemoLogin = async (demoRole) => {
    if (demoRole === 'patient') {
      setEmail('patient@mediconnect.com');
      setPassword('Password123!');
      setRole('patient');
    } else {
      setEmail('arun.kumar@mediconnect.com');
      setPassword('Password123!');
      setRole('doctor');
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 74px)',
      background: 'var(--bg-gradient)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div className="card" style={{ maxWidth: '460px', width: '100%', padding: '36px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 6px 16px rgba(37, 99, 235, 0.3)'
          }}>
            <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
              <path d="M24 16C21.8 13.5 17.8 13.8 16.1 16.5C14.7 18.7 15.3 22 17.5 24.5L24 31L30.5 24.5C32.7 22 33.3 18.7 31.9 16.5C30.2 13.8 26.2 13.5 24 16Z" fill="#FFFFFF" />
              <path d="M24 19V27M20 23H28" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '6px' }}>
            Welcome Back
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to access your MediConnect healthcare account
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px 14px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            color: '#b91c1c',
            fontSize: '0.88rem',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role Radio Selection */}
          <div className="form-group">
            <label className="form-label">I am logging in as</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginTop: '4px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: role === 'patient' ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                background: role === 'patient' ? 'var(--primary-50)' : '#ffffff',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: role === 'patient' ? 'var(--primary-700)' : 'var(--text-main)',
                transition: 'var(--transition)'
              }}>
                <input
                  type="radio"
                  name="role"
                  value="patient"
                  checked={role === 'patient'}
                  onChange={() => setRole('patient')}
                  style={{ accentColor: 'var(--primary-600)' }}
                />
                <UserCheck size={18} />
                <span>Patient</span>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: role === 'doctor' ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                background: role === 'doctor' ? 'var(--primary-50)' : '#ffffff',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: role === 'doctor' ? 'var(--primary-700)' : 'var(--text-main)',
                transition: 'var(--transition)'
              }}>
                <input
                  type="radio"
                  name="role"
                  value="doctor"
                  checked={role === 'doctor'}
                  onChange={() => setRole('doctor')}
                  style={{ accentColor: 'var(--primary-600)' }}
                />
                <Stethoscope size={18} />
                <span>Doctor</span>
              </label>
            </div>
          </div>

          {/* Email input */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                required
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <Mail size={18} color="var(--text-light)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            </div>
          </div>

          {/* Password with show/hide toggle */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px', paddingRight: '42px' }}
              />
              <Lock size={18} color="var(--text-light)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '12px',
                  color: 'var(--text-light)',
                  padding: '4px'
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px', padding: '12px' }}
          >
            {loading ? (
              <>
                <div className="spinner spinner-sm" style={{ borderTopColor: '#ffffff' }}></div>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Fill Buttons */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--border-light)'
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>
            Quick Demo Fill
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('patient')}
              className="btn btn-outline btn-sm"
              style={{ background: '#ffffff', fontSize: '0.8rem' }}
            >
              Demo Patient
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('doctor')}
              className="btn btn-outline btn-sm"
              style={{ background: '#ffffff', fontSize: '0.8rem' }}
            >
              Demo Doctor
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: 700 }}>
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
