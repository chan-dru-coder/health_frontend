import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, Heart, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: '#ffffff',
      borderTop: '1px solid var(--border-light)',
      marginTop: 'auto',
      paddingTop: '60px',
      paddingBottom: '30px'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
                  <path d="M24 16C21.8 13.5 17.8 13.8 16.1 16.5C14.7 18.7 15.3 22 17.5 24.5L24 31L30.5 24.5C32.7 22 33.3 18.7 31.9 16.5C30.2 13.8 26.2 13.5 24 16Z" fill="#FFFFFF" />
                  <path d="M24 19V27M20 23H28" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Medi<span style={{ color: 'var(--primary-600)' }}>Connect</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Empowering patients with verified specialist consultations, real-time slot bookings, and secure digital medical prescriptions.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-700)', fontSize: '0.85rem', fontWeight: 600 }}>
              <ShieldCheck size={18} />
              <span>HIPAA & Healthcare Compliant Architecture</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '18px', color: 'var(--text-main)' }}>
              Patient Portals
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li><Link to="/doctors" style={{ transition: 'var(--transition)' }}>Find Specialists</Link></li>
              <li><Link to="/doctors?specialization=Cardiologist">Cardiology Consultations</Link></li>
              <li><Link to="/doctors?specialization=Dermatologist">Dermatology & Skin Care</Link></li>
              <li><Link to="/doctors?specialization=Pediatrician">Pediatric Child Care</Link></li>
              <li><Link to="/my-appointments">Patient Appointments</Link></li>
            </ul>
          </div>

          {/* Specializations */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '18px', color: 'var(--text-main)' }}>
              Popular Disciplines
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li><Link to="/doctors?specialization=Neurologist">Neurology & Brain Health</Link></li>
              <li><Link to="/doctors?specialization=Orthopedist">Orthopedics & Joint Care</Link></li>
              <li><Link to="/doctors?specialization=General Physician">General Family Medicine</Link></li>
              <li><Link to="/login">Doctor Practitioner Portal</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '18px', color: 'var(--text-main)' }}>
              Emergency & Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="var(--primary-600)" />
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>+1 (800) 456-MEDI (24/7 Hotline)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="var(--primary-600)" />
                <span>support@mediconnect.org</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} color="var(--primary-600)" />
                <span>Central Medical Complex, Metro City</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={16} color="var(--primary-600)" />
                <span>OPD Slot Hours: 09:00 AM – 06:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.85rem',
          color: 'var(--text-light)'
        }}>
          <div>
            &copy; {new Date().getFullYear()} MediConnect Healthcare Network. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> for accessible healthcare.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
