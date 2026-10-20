import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getDoctors } from '../api/doctors';
import DoctorCard from '../components/DoctorCard';
import {
  Search,
  Calendar,
  Stethoscope,
  ShieldCheck,
  CheckCircle,
  Users,
  Award,
  Clock,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopDoctors = async () => {
      try {
        const data = await getDoctors({ page_size: 4 });
        setFeaturedDoctors(data.results || []);
      } catch (err) {
        console.error('Failed to fetch featured doctors', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopDoctors();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (specialization) params.append('specialization', specialization);
    navigate(`/doctors?${params.toString()}`);
  };

  const specializationsList = [
    'Cardiologist',
    'Dermatologist',
    'Neurologist',
    'Pediatrician',
    'Orthopedist',
    'General Physician'
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #f0f7ff 0%, #e0effe 50%, #f8fbff 100%)',
        padding: '70px 0 80px',
        borderBottom: '1px solid var(--border-light)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '48px'
        }}>
          {/* Left Hero Content */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#ffffff',
              border: '1px solid var(--primary-200)',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              color: 'var(--primary-700)',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '20px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <ShieldCheck size={16} />
              <span>Verified Medical Specialists & Secure Booking</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.4rem, 4vw, 3.5rem)',
              fontWeight: 800,
              color: 'var(--text-main)',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '18px'
            }}>
              Your Health, <br />
              <span style={{ color: 'var(--primary-600)' }}>Our Priority.</span>
            </h1>

            <p style={{
              fontSize: '1.1rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '32px',
              maxWidth: '520px'
            }}>
              Schedule in-person consultations with board-certified physicians, manage real-time availability slots, and track prescriptions seamlessly on MediConnect.
            </p>

            {/* Hero Search Bar */}
            <form
              onSubmit={handleSearch}
              style={{
                background: '#ffffff',
                padding: '10px',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 12px 30px rgba(37, 99, 235, 0.1)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                border: '1px solid var(--border-light)',
                maxWidth: '560px',
                marginBottom: '28px'
              }}
            >
              <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 12px' }}>
                <Search size={20} color="var(--primary-600)" />
                <input
                  type="text"
                  placeholder="Doctor name or condition..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    color: 'var(--text-main)'
                  }}
                />
              </div>

              <div style={{ flex: '1 1 150px', borderLeft: '1px solid var(--border-light)', paddingLeft: '10px' }}>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    color: specialization ? 'var(--text-main)' : 'var(--text-muted)',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: '8px 0'
                  }}
                >
                  <option value="">All Specialties</option>
                  {specializationsList.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
                Search
              </button>
            </form>

            {/* Quick Stats Banner */}
            <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>150+</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified Specialists</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-light)', paddingLeft: '24px' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>98.9%</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Patient Satisfaction</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-light)', paddingLeft: '24px' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>24/7</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Appointment Access</div>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
              border: '6px solid #ffffff'
            }}>
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80"
                alt="Healthcare doctor team"
                style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, transparent 100%)',
                padding: '24px',
                textAlign: 'left',
                color: '#ffffff'
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-300)' }}>
                  Accredited Practitioners
                </span>
                <h4 style={{ color: '#ffffff', fontSize: '1.15rem', marginTop: '2px' }}>
                  Direct Access to Renowned Medical Leaders
                </h4>
              </div>
            </div>

            {/* Floating Trust Badge */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '-16px',
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              padding: '12px 18px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textAlign: 'left'
            }} className="hide-on-mobile">
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>Instant Confirmation</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Zero Waiting Queues</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Feature Cards Section */}
      <section style={{ padding: '80px 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px' }}>
            <span style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              color: 'var(--primary-600)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              How MediConnect Works
            </span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '8px', color: 'var(--text-main)' }}>
              Comprehensive Healthcare In 3 Simple Steps
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '10px' }}>
              Designed to connect patients with trusted clinical doctors with zero scheduling friction.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '28px'
          }}>
            {/* Feature 1: Find Doctors */}
            <div className="card card-hover" style={{ padding: '36px 28px', textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--primary-50)',
                color: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 16px rgba(37, 99, 235, 0.1)'
              }}>
                <Search size={30} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Find Doctors</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                Browse verified specialist profiles filtered by discipline, experience years, patient reviews, and hospital locations.
              </p>
              <Link to="/doctors" style={{ color: 'var(--primary-600)', fontWeight: 700, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>Explore Doctors</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Feature 2: Book Appointment */}
            <div className="card card-hover" style={{ padding: '36px 28px', textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-lg)',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 16px rgba(16, 185, 129, 0.1)'
              }}>
                <Calendar size={30} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Book Appointment</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                Select convenient real-time available time slots without double bookings and get immediate appointment confirmation.
              </p>
              <Link to="/doctors" style={{ color: '#059669', fontWeight: 700, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>View Availability</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Feature 3: Get Medical Care */}
            <div className="card card-hover" style={{ padding: '36px 28px', textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-lg)',
                background: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 16px rgba(217, 119, 6, 0.1)'
              }}>
                <Stethoscope size={30} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Get Medical Care</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                Receive expert medical care, clinical diagnosis notes, and secure digital prescriptions ready to review or print anytime.
              </p>
              <Link to="/register" style={{ color: '#d97706', fontWeight: 700, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>Join MediConnect</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section style={{ padding: '70px 0 80px', background: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '40px'
          }}>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Top Rated Practitioners
              </span>
              <h2 style={{ fontSize: '2rem', marginTop: '6px', color: 'var(--text-main)' }}>
                Consult Our Featured Specialists
              </h2>
            </div>

            <Link to="/doctors" className="btn btn-secondary">
              <span>View All Doctors</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <div className="spinner"></div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {featuredDoctors.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '80px 0', background: '#ffffff', borderTop: '1px solid var(--border-light)' }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '48px'
        }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              About MediConnect
            </span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '8px', color: 'var(--text-main)', marginBottom: '18px' }}>
              Transforming Healthcare Connectivity
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1rem', marginBottom: '16px' }}>
              MediConnect was created to eliminate the pain of clinical appointment scheduling. We bridge the gap between patient care seekers and accredited medical professionals with a transparent, digital-first healthcare system.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1rem', marginBottom: '24px' }}>
              Whether you need urgent pediatric consultation, a cardiology evaluation, or comprehensive diagnostic follow-ups, MediConnect ensures your medical records and prescriptions remain secure, organized, and accessible.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.92rem' }}>
                <CheckCircle size={18} color="var(--primary-600)" />
                <span>Verified Credentials</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.92rem' }}>
                <CheckCircle size={18} color="var(--primary-600)" />
                <span>Zero Double Booking</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.92rem' }}>
                <CheckCircle size={18} color="var(--primary-600)" />
                <span>Digital Prescriptions</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.92rem' }}>
                <CheckCircle size={18} color="var(--primary-600)" />
                <span>Role Protected Portals</span>
              </div>
            </div>
          </div>

          <div style={{
            background: 'var(--primary-50)',
            border: '1px solid var(--primary-100)',
            borderRadius: 'var(--radius-xl)',
            padding: '40px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-900)', marginBottom: '14px' }}>
              Ready to Book Your Consultation?
            </h3>
            <p style={{ color: 'var(--primary-700)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Join thousands of satisfied patients who manage their doctor appointments and medical care directly through MediConnect.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary">
                Create Free Patient Account
              </Link>
              <Link to="/doctors" className="btn btn-secondary">
                Find Doctors
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
