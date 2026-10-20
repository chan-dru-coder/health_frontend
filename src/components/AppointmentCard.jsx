import React from 'react';
import StatusBadge from './StatusBadge';
import { Calendar, Clock, MapPin, User, FileText, Ban } from 'lucide-react';

const AppointmentCard = ({ appointment, onCancel, onViewPrescription, isCancelling = false }) => {
  const canCancel = ['pending', 'accepted'].includes(appointment.status.toLowerCase());
  const hasPrescription = appointment.status.toLowerCase() === 'completed';

  const doctor = appointment.doctor || {};
  const patient = appointment.patient || {};

  return (
    <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {doctor.profile_image ? (
            <img
              src={doctor.profile_image}
              alt={doctor.full_name}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: 'var(--radius-md)',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-100)',
              color: 'var(--primary-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem'
            }}>
              {doctor.full_name ? doctor.full_name[0] : 'D'}
            </div>
          )}

          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>
              Appointment #{appointment.id}
            </div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '2px' }}>
              {doctor.full_name || 'Specialist Consultation'}
            </h3>
            <div style={{ fontSize: '0.86rem', color: 'var(--primary-600)', fontWeight: 600 }}>
              {doctor.specialization} • {doctor.qualification}
            </div>
          </div>
        </div>

        <StatusBadge status={appointment.status} />
      </div>

      {/* Appointment Date / Time / Location metadata */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        background: 'var(--primary-50)',
        padding: '14px 18px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--primary-100)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-main)' }}>
          <Calendar size={17} color="var(--primary-600)" />
          <span>
            <strong>Date:</strong> {appointment.date}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-main)' }}>
          <Clock size={17} color="var(--primary-600)" />
          <span>
            <strong>Time:</strong> {appointment.time_display || appointment.time}
          </span>
        </div>

        {doctor.hospital_location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-main)' }}>
            <MapPin size={17} color="var(--primary-600)" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {doctor.hospital_location}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '12px',
        marginTop: 'auto',
        paddingTop: '8px'
      }}>
        {canCancel && onCancel && (
          <button
            onClick={() => onCancel(appointment.id)}
            disabled={isCancelling}
            className="btn btn-danger-outline btn-sm"
          >
            <Ban size={15} />
            <span>{isCancelling ? 'Cancelling...' : 'Cancel Appointment'}</span>
          </button>
        )}

        {hasPrescription && onViewPrescription && (
          <button
            onClick={() => onViewPrescription(appointment)}
            className="btn btn-secondary btn-sm"
          >
            <FileText size={15} />
            <span>View Prescription</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
