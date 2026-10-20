import React, { useEffect, useState } from 'react';
import { getPrescription } from '../api/appointments';
import { FileText, X, Calendar, User, Stethoscope, Pill, AlertCircle } from 'lucide-react';

const PrescriptionModal = ({ appointment, onClose }) => {
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!appointment) return;

    // If prescription is already nested in appointment data, use it directly
    if (appointment.prescription) {
      setPrescription(appointment.prescription);
      setLoading(false);
      return;
    }

    const fetchPrescription = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPrescription(appointment.id);
        setPrescription(data);
      } catch (err) {
        setError('Unable to load prescription details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [appointment]);

  if (!appointment) return null;

  const doctor = appointment.doctor || {};
  const patient = appointment.patient || {};

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-100)',
              color: 'var(--primary-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0 }}>
                Medical Prescription
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Official Digital Prescription • Appointment #{appointment.id}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Doctor and Patient Details Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          background: 'var(--primary-50)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
          fontSize: '0.88rem'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Prescribed By
            </div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
              {doctor.full_name || 'Medical Specialist'}
            </div>
            <div style={{ color: 'var(--primary-700)', fontSize: '0.82rem' }}>
              {doctor.specialization} ({doctor.qualification})
            </div>
            {doctor.hospital_location && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
                {doctor.hospital_location}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Patient
            </div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
              {patient.full_name || 'Patient'}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              Consultation Date: {appointment.date} ({appointment.time_display || appointment.time})
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: '10px' }}>
            <div className="spinner spinner-sm"></div>
            <span>Fetching prescription details...</span>
          </div>
        ) : error ? (
          <div style={{ color: '#ef4444', textAlign: 'center', padding: '30px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        ) : prescription ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Medical Notes */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '8px'
              }}>
                <Stethoscope size={18} color="var(--primary-600)" />
                <span>Clinical Notes & Diagnosis</span>
              </div>
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                fontSize: '0.92rem',
                lineHeight: 1.6,
                color: 'var(--text-main)',
                whiteSpace: 'pre-wrap'
              }}>
                {prescription.medical_notes}
              </div>
            </div>

            {/* Prescribed Medications & Instructions */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '8px'
              }}>
                <Pill size={18} color="var(--primary-600)" />
                <span>Prescription & Dosage Schedule</span>
              </div>
              <div style={{
                background: '#fafbfc',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                fontSize: '0.92rem',
                lineHeight: 1.6,
                color: 'var(--text-main)',
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace'
              }}>
                {prescription.prescription_text}
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-light)',
              fontSize: '0.8rem',
              color: 'var(--text-light)'
            }}>
              <span>Prescription Issued on {new Date(prescription.created_at).toLocaleDateString()}</span>
              <button onClick={() => window.print()} className="btn btn-outline btn-sm">
                Print Prescription
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
            No prescription records available.
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionModal;
