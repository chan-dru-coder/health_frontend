import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Award, Clock, ArrowRight } from 'lucide-react';

const DoctorCard = ({ doctor }) => {
  const fallbackImage = `https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80`;

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', overflow: 'hidden', height: '220px', background: '#e2e8f0' }}>
        <img
          src={doctor.profile_image || fallbackImage}
          alt={doctor.full_name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(4px)',
          borderRadius: 'var(--radius-full)',
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.82rem',
          fontWeight: 700,
          boxShadow: 'var(--shadow-sm)'
        }}>
          <Star size={14} fill="#eab308" color="#eab308" />
          <span>{Number(doctor.rating).toFixed(1)}</span>
          <span style={{ color: 'var(--text-light)', fontWeight: 500, fontSize: '0.75rem' }}>
            ({doctor.reviews_count})
          </span>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'var(--primary-600)',
          color: '#ffffff',
          borderRadius: 'var(--radius-sm)',
          padding: '3px 10px',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.02em',
          textTransform: 'uppercase'
        }}>
          {doctor.specialization}
        </div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '4px', color: 'var(--text-main)' }}>
          {doctor.full_name}
        </h3>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--primary-700)',
          fontSize: '0.86rem',
          fontWeight: 600,
          marginBottom: '10px'
        }}>
          <Award size={15} />
          <span>{doctor.qualification}</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-muted)',
          fontSize: '0.84rem',
          marginBottom: '6px'
        }}>
          <Clock size={15} />
          <span>{doctor.experience_years} Years Experience</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '6px',
          color: 'var(--text-muted)',
          fontSize: '0.84rem',
          marginBottom: '16px',
          lineHeight: 1.4
        }}>
          <MapPin size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span style={{
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {doctor.hospital_location}
          </span>
        </div>

        <div style={{
          marginTop: 'auto',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Consultation Fee
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              ${Number(doctor.consultation_fee).toFixed(0)}
            </div>
          </div>

          <Link
            to={`/doctors/${doctor.id}`}
            className="btn btn-primary btn-sm"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <span>View Profile</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
