import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, Calendar, LogOut, Stethoscope, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border-light)',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px'
      }}>
        {/* Brand Logo with Heart-Shield */}
        <Link to="/" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
          }}>
            <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
              <path d="M24 4L7 11V22C7 33.2 14.3 43.6 24 46C33.7 43.6 41 33.2 41 22V11L24 4Z" fill="#2563EB" opacity="0.1" />
              <path d="M24 16C21.8 13.5 17.8 13.8 16.1 16.5C14.7 18.7 15.3 22 17.5 24.5L24 31L30.5 24.5C32.7 22 33.3 18.7 31.9 16.5C30.2 13.8 26.2 13.5 24 16Z" fill="#FFFFFF" />
              <path d="M24 19V27M20 23H28" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Medi<span style={{ color: 'var(--primary-600)' }}>Connect</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '-3px' }}>
              Healthcare Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive ? 'var(--primary-600)' : 'var(--text-main)',
              transition: 'var(--transition)'
            })}
          >
            Home
          </NavLink>
          <NavLink
            to="/doctors"
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive ? 'var(--primary-600)' : 'var(--text-main)',
              transition: 'var(--transition)'
            })}
          >
            Doctors
          </NavLink>
          <a
            href="/#about"
            style={{
              fontWeight: 600,
              fontSize: '0.95rem',
              color: 'var(--text-main)',
              transition: 'var(--transition)'
            }}
          >
            About
          </a>

          {/* Role specific links */}
          {isAuthenticated && user?.role === 'patient' && (
            <NavLink
              to="/my-appointments"
              style={({ isActive }) => ({
                fontWeight: 600,
                fontSize: '0.95rem',
                color: isActive ? 'var(--primary-600)' : 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              })}
            >
              <Calendar size={17} />
              My Appointments
            </NavLink>
          )}

          {isAuthenticated && user?.role === 'doctor' && (
            <NavLink
              to="/doctor/appointments"
              style={({ isActive }) => ({
                fontWeight: 600,
                fontSize: '0.95rem',
                color: isActive ? 'var(--primary-600)' : 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              })}
            >
              <Stethoscope size={17} />
              Doctor Portal
            </NavLink>
          )}
        </nav>

        {/* Desktop User / Auth Actions */}
        <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 14px',
                background: 'var(--primary-50)',
                border: '1px solid var(--primary-100)',
                borderRadius: 'var(--radius-full)'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--primary-600)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
                    {user?.full_name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--primary-700)', textTransform: 'capitalize', fontWeight: 600 }}>
                    {user?.role}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                title="Logout"
                style={{ color: 'var(--text-muted)' }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="show-on-mobile"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            padding: '8px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-light)'
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="show-on-mobile" style={{
          background: '#ffffff',
          borderBottom: '1px solid var(--border-light)',
          padding: '20px',
          boxShadow: 'var(--shadow-xl)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {isAuthenticated && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: 'var(--primary-50)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--primary-600)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700
                }}>
                  {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user?.full_name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--primary-700)', textTransform: 'capitalize' }}>
                    {user?.email} ({user?.role})
                  </div>
                </div>
              </div>
            )}

            <Link
              to="/"
              onClick={closeMenu}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 600,
                fontSize: '1rem',
                padding: '8px 0',
                borderBottom: '1px solid var(--border-light)'
              }}
            >
              <span>Home</span>
              <ChevronRight size={18} color="var(--text-light)" />
            </Link>

            <Link
              to="/doctors"
              onClick={closeMenu}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 600,
                fontSize: '1rem',
                padding: '8px 0',
                borderBottom: '1px solid var(--border-light)'
              }}
            >
              <span>Find Doctors</span>
              <ChevronRight size={18} color="var(--text-light)" />
            </Link>

            <a
              href="/#about"
              onClick={closeMenu}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 600,
                fontSize: '1rem',
                padding: '8px 0',
                borderBottom: '1px solid var(--border-light)'
              }}
            >
              <span>About Us</span>
              <ChevronRight size={18} color="var(--text-light)" />
            </a>

            {isAuthenticated && user?.role === 'patient' && (
              <Link
                to="/my-appointments"
                onClick={closeMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 600,
                  fontSize: '1rem',
                  padding: '8px 0',
                  color: 'var(--primary-600)',
                  borderBottom: '1px solid var(--border-light)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} />
                  <span>My Appointments</span>
                </div>
                <ChevronRight size={18} />
              </Link>
            )}

            {isAuthenticated && user?.role === 'doctor' && (
              <Link
                to="/doctor/appointments"
                onClick={closeMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 600,
                  fontSize: '1rem',
                  padding: '8px 0',
                  color: 'var(--primary-600)',
                  borderBottom: '1px solid var(--border-light)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Stethoscope size={18} />
                  <span>Doctor Portal</span>
                </div>
                <ChevronRight size={18} />
              </Link>
            )}

            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {isAuthenticated ? (
                <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%' }}>
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu} className="btn btn-outline" style={{ width: '100%' }}>
                    Login
                  </Link>
                  <Link to="/register" onClick={closeMenu} className="btn btn-primary" style={{ width: '100%' }}>
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
