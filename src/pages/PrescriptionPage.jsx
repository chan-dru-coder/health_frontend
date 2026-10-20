import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAppointments, getPrescription, savePrescription } from '../api/appointments';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  User,
  Calendar,
  Clock,
  Stethoscope,
  Pill,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const PrescriptionPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [appointment, setAppointment] = useState(null);
  const [medicalNotes, setMedicalNotes] = useState('');
  const [prescriptionText, setPrescriptionText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAppointmentAndPrescription = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch doctor's appointments to find the specific one
        const data = await getAppointments();
        const list = data.results || data || [];
        const found = list.find((a) => String(a.id) === String(appointmentId));

        if (!found) {
          setError('Appointment not found or you are not authorized to view it.');
          setLoading(false);
          return;
        }

        setAppointment(found);

        // Try loading existing prescription if already present
        try {
          const presData = await getPrescription(appointmentId);
          if (presData) {
            setMedicalNotes(presData.medical_notes || '');
            setPrescriptionText(presData.prescription_text || '');
          }
        } catch {
          // No prescription yet - empty form is fine
        }
      } catch (err) {
        setError('Failed to load appointment details.');
      } finally {
        setLoading(false);
      }
    };

    loadAppointmentAndPrescription();
  }, [appointmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!medicalNotes.trim() || !prescriptionText.trim()) {
      setError('Please provide both medical clinical notes and prescription details.');
      return;
    }

    setSaving(true);
    try {
      await savePrescription(appointmentId, {
        medical_notes: medicalNotes,
        prescription_text: prescriptionText,
      });

      showToast('Prescription saved and appointment completed!', 'success');
      navigate('/doctor/appointments');
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to save prescription.';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error && !appointment) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Appointment Error</h2>
        <p style={{ color: 'var(--text-muted)', margin: '12px 0 24px' }}>{error}</p>
        <Link to="/doctor/appointments" className="btn btn-primary">
          Back to Appointments
        </Link>
      </div>
    );
  }

  const patient = appointment?.patient || {};

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: 'calc(100vh - 74px)', padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Navigation */}
        <Link
          to="/doctor/appointments"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.9rem',
            marginBottom: '24px'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Doctor Dashboard</span>
        </Link>

        {/* Title */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--primary-50)',
            border: '1px solid var(--primary-200)',
            padding: '4px 14px',
            borderRadius: 'var(--radius-full)',
            color: 'var(--primary-700)',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '8px'
          }}>
            <FileText size={15} />
            <span>Digital Medical Record</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)', margin: '4px 0' }}>
            Medical Notes & Prescription
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Document patient clinical observations and prescribe medications. Saving marks the appointment as <strong>Completed</strong>.
          </p>
        </div>

        {error && (
          <div style={{
            padding: '14px 18px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            color: '#b91c1c',
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '24px'
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Patient & Appointment Banner Card */}
        <div className="card" style={{ padding: '24px', marginBottom: '28px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '18px',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'var(--primary-100)',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem'
              }}>
                {patient.full_name ? patient.full_name[0].toUpperCase() : 'P'}
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Patient Name
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {patient.full_name}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {patient.email}
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>
                Consultation Date & Time
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} color="var(--primary-600)" />
                <span>{appointment?.date}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <Clock size={15} color="var(--primary-600)" />
                <span>{appointment?.time_display || appointment?.time}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>
                Appointment Status
              </div>
              <div style={{ marginTop: '4px' }}>
                <span className="badge badge-accepted" style={{ textTransform: 'capitalize' }}>
                  {appointment?.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Prescription Form */}
        <form onSubmit={handleSubmit} className="card" style={{ padding: '32px' }}>
          {/* Medical Notes Textarea */}
          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
              <Stethoscope size={18} color="var(--primary-600)" />
              <span>Medical Notes & Clinical Diagnosis</span>
            </label>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '-2px 0 8px' }}>
              Document symptoms, physical examination findings, vital readings, and clinical diagnosis.
            </p>
            <textarea
              required
              rows={5}
              className="form-textarea"
              placeholder="e.g. Patient presents with seasonal allergic rhinitis and mild bronchial congestion. Vital signs: BP 120/80 mmHg, SpO2 99%, Pulse 72 bpm..."
              value={medicalNotes}
              onChange={(e) => setMedicalNotes(e.target.value)}
              style={{ lineHeight: 1.6 }}
            />
          </div>

          {/* Prescription Textarea */}
          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
              <Pill size={18} color="var(--primary-600)" />
              <span>Prescription & Medications Schedule</span>
            </label>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '-2px 0 8px' }}>
              List medicine names, dosages, frequencies, duration, and dietary recommendations.
            </p>
            <textarea
              required
              rows={6}
              className="form-textarea"
              placeholder="1. Tab. Cetirizine 10mg - 1 tablet at bedtime for 5 days&#10;2. Fluticasone Nasal Spray - 2 sprays per nostril daily&#10;3. Steam inhalation twice daily&#10;4. Review consultation in 7 days if congestion persists."
              value={prescriptionText}
              onChange={(e) => setPrescriptionText(e.target.value)}
              style={{ lineHeight: 1.6, fontFamily: 'monospace' }}
            />
          </div>

          {/* Form Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '14px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-light)'
          }}>
            <button
              type="button"
              onClick={() => navigate('/doctor/appointments')}
              className="btn btn-outline"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary btn-lg"
            >
              {saving ? (
                <>
                  <div className="spinner spinner-sm" style={{ borderTopColor: '#ffffff' }}></div>
                  <span>Saving Prescription...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Prescription</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionPage;
