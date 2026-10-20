import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAppointments, cancelAppointment } from '../api/appointments';
import AppointmentCard from '../components/AppointmentCard';
import PrescriptionModal from '../components/PrescriptionModal';
import { useAuth } from '../context/AuthContext';
import { Calendar, Stethoscope, Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [selectedPrescriptionApt, setSelectedPrescriptionApt] = useState(null);
  const [cancelModalApt, setCancelModalApt] = useState(null);

  const { showToast } = useAuth();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAppointments(statusFilter);
      setAppointments(data.results || data || []);
    } catch (err) {
      console.error('Failed to load appointments', err);
      showToast('Could not fetch appointments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const confirmCancelAppointment = async () => {
    if (!cancelModalApt) return;
    setCancellingId(cancelModalApt.id);

    try {
      await cancelAppointment(cancelModalApt.id);
      showToast('Appointment cancelled successfully.', 'success');
      setCancelModalApt(null);
      fetchAppointments();
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to cancel appointment.';
      showToast(errMsg, 'error');
    } finally {
      setCancellingId(null);
    }
  };

  const statusTabs = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Accepted', value: 'accepted' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: 'calc(100vh - 74px)', padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Patient Dashboard
            </span>
            <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginTop: '4px' }}>
              My Appointments
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
              Manage your upcoming visits, cancellations, and view medical prescriptions.
            </p>
          </div>

          <Link to="/doctors" className="btn btn-primary btn-sm">
            <Stethoscope size={16} />
            <span>Book New Appointment</span>
          </Link>
        </div>

        {/* Status Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '28px'
        }}>
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.label}
                onClick={() => setStatusFilter(tab.value)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  border: isActive ? '1px solid var(--primary-600)' : '1px solid var(--border-light)',
                  background: isActive ? 'var(--primary-600)' : '#ffffff',
                  color: isActive ? '#ffffff' : 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Appointments List */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div className="spinner"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Calendar size={32} />
            </div>
            <h3>No Appointments Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '400px' }}>
              {statusFilter
                ? `You have no ${statusFilter} appointments.`
                : "You haven't scheduled any doctor appointments yet."}
            </p>
            <Link to="/doctors" className="btn btn-primary" style={{ marginTop: '8px' }}>
              Browse Available Doctors
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {appointments.map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                onCancel={() => setCancelModalApt(apt)}
                onViewPrescription={(a) => setSelectedPrescriptionApt(a)}
                isCancelling={cancellingId === apt.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModalApt && (
        <div className="modal-backdrop" onClick={() => setCancelModalApt(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#fef2f2',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <AlertTriangle size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-main)' }}>
                Cancel Appointment?
              </h3>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '20px' }}>
              Are you sure you want to cancel your appointment with <strong>{cancelModalApt.doctor?.full_name}</strong> on <strong>{cancelModalApt.date}</strong> at <strong>{cancelModalApt.time_display || cancelModalApt.time}</strong>?
              This will free the slot for other patients.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setCancelModalApt(null)}
                className="btn btn-outline btn-sm"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                onClick={confirmCancelAppointment}
                disabled={cancellingId === cancelModalApt.id}
                className="btn btn-danger btn-sm"
              >
                {cancellingId === cancelModalApt.id ? 'Cancelling...' : 'Yes, Cancel Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Viewer Modal */}
      {selectedPrescriptionApt && (
        <PrescriptionModal
          appointment={selectedPrescriptionApt}
          onClose={() => setSelectedPrescriptionApt(null)}
        />
      )}
    </div>
  );
};

export default MyAppointments;
