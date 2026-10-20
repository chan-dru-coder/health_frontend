import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Stethoscope, UserCheck } from 'lucide-react';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [specialization, setSpecialization] = useState('General Physician');
  const [qualification, setQualification] = useState('MBBS');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        full_name: fullName,
        email,
        password,
        role,
      };

      if (role === 'doctor') {
        payload.specialization = specialization;
        payload.qualification = qualification;
      }

      const registeredUser = await register(payload);

      if (registeredUser.role === 'doctor') {
        navigate('/doctor/appointments');
      } else {
        navigate('/doctors');
      }
    } catch (err) {
      let errMsg = 'Registration failed. Please check your details.';
      if (err.response?.data) {
        const errors = err.response.data;
        const firstKey = Object.keys(errors)[0];
        if (firstKey) {
          const val = errors[firstKey];
          errMsg = Array.isArray(val) ? `${firstKey}: ${val[0]}` : String(val);
        }
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const specializationsList = [
    'General Physician',
    'Cardiologist',
    'Dermatologist',
    'Neurologist',
    'Pediatrician',
    'Orthopedist'
  ];

  return (
    <div style={{
      minHeight: 'calc(100vh - 74px)',
      background: 'var(--bg-gradient)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '36px' }}>
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
            Create Your Account
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Join MediConnect to book and manage medical care
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
          {/* Role selection */}
          <div className="form-group">
            <label className="form-label">Register as</label>
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

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                id="fullName"
                type="text"
                required
                className="form-input"
                placeholder={role === 'doctor' ? 'Dr. John Watson' : 'John Doe'}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <User size={18} color="var(--text-light)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            </div>
          </div>

          {/* Email */}
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

          {/* If Doctor: Specialization & Qualification */}
          {role === 'doctor' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="form-select"
                >
                  {specializationsList.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Qualification</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. MBBS, MD"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password (min 6 characters)</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                className="form-input"
                placeholder="Create a strong password"
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
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 700 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
