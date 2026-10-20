import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppointments, updateAppointmentStatus } from '../api/appointments';
import { getMyDoctorProfile } from '../api/doctors';
import StatusBadge from '../components/StatusBadge';
import PrescriptionModal from '../components/PrescriptionModal';
import EditFeeModal from '../components/EditFeeModal';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  FileEdit,
  FileCheck2,
  Stethoscope,
  Info,
  ChevronRight,
  DollarSign,
  Award,
  MapPin,
  ExternalLink,
  Edit3,
  Sparkles
} from 'lucide-react';

const DoctorAppointments = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedPrescriptionApt, setSelectedPrescriptionApt] = useState(null);
  const [selectedDetailsApt, setSelectedDetailsApt] = useState(null);

  const { user, showToast } = useAuth();
  const navigate = useNavigate();

  // Fetch all appointments for doctor to calculate tab counts accurately
  const fetchAllAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAppointments();
      const list = data.results || data || [];
      setAllAppointments(list);
    } catch (err) {
      console.error('Failed to fetch doctor appointments', err);
      showToast('Could not fetch appointments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorProfile = async () => {
    try {
      const data = await getMyDoctorProfile();
      setDoctorProfile(data);
    } catch (err) {
      console.error('Failed to fetch doctor profile', err);
    }
  };

  useEffect(() => {
    fetchAllAppointments();
    fetchDoctorProfile();
  }, []);

  // Filter based on active tab
  useEffect(() => {
    if (activeTab === 'all') {
      setAppointments(allAppointments);
    } else {
      setAppointments(allAppointments.filter((a) => a.status.toLowerCase() === activeTab));
    }
  }, [activeTab, allAppointments]);

  // Tab counts
  const pendingCount = allAppointments.filter((a) => a.status.toLowerCase() === 'pending').length;
  const acceptedCount = allAppointments.filter((a) => a.status.toLowerCase() === 'accepted').length;
  const rejectedCount = allAppointments.filter((a) => a.status.toLowerCase() === 'rejected').length;
  const completedCount = allAppointments.filter((a) => a.status.toLowerCase() === 'completed').length;

  const handleStatusChange = async (appointmentId, newStatus) => {
    setUpdatingId(appointmentId);
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      showToast(`Appointment has been ${newStatus}.`, 'success');
      fetchAllAppointments();
    } catch (err) {
      const errMsg = err.response?.data?.error || `Failed to update status to ${newStatus}.`;
      showToast(errMsg, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const tabs = [
    { id: 'pending', label: 'Pending', count: pendingCount, color: 'var(--status-pending-text)' },
    { id: 'accepted', label: 'Accepted', count: acceptedCount, color: 'var(--status-accepted-text)' },
    { id: 'rejected', label: 'Rejected', count: rejectedCount, color: 'var(--status-rejected-text)' },
    { id: 'completed', label: 'Completed', count: completedCount, color: 'var(--status-completed-text)' },
  ];

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: 'calc(100vh - 74px)', padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '1040px' }}>
        {/* Header */}
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
            <Stethoscope size={15} />
            <span>Practitioner Portal</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)', margin: '4px 0' }}>
            Appointments & Consultation Requests
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Review incoming patient bookings, manage consultation statuses, and issue digital prescriptions.
          </p>
        </div>

        {/* Practitioner Profile & Fee Overview Card */}
        <div
          className="card"
          style={{
            padding: '24px 28px',
            marginBottom: '32px',
            background: 'linear-gradient(135deg, #ffffff 0%, var(--primary-50) 100%)',
            border: '1px solid var(--primary-200)',
            boxShadow: '0 4px 20px rgba(37, 99, 235, 0.08)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px'
          }}
        >
          {/* Left: Doctor Information */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: '280px', flex: 1 }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              fontWeight: 800,
              boxShadow: 'var(--shadow-md)',
              flexShrink: 0
            }}>
              {doctorProfile?.full_name ? doctorProfile.full_name.replace(/^Dr\.?\s*/i, '').charAt(0) : 'D'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', margin: 0, fontWeight: 700 }}>
                  {doctorProfile?.full_name || user?.full_name || 'Doctor'}
                </h2>
                <span className="badge badge-accepted" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                  {doctorProfile?.specialization || 'Specialist'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                {doctorProfile?.qualification && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: 'var(--primary-700)' }}>
                    <Award size={15} />
                    {doctorProfile.qualification}
                  </span>
                )}
                {doctorProfile?.hospital_location && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={15} />
                    {doctorProfile.hospital_location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Consultation Fee & Quick Edit Action */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            background: '#ffffff',
            padding: '16px 22px',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--primary-200)',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.08)'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>
                Consultation Fee
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-700)', lineHeight: 1 }}>
                  ${Number(doctorProfile?.consultation_fee ?? user?.consultation_fee ?? 500).toFixed(0)}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ session</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                id="edit-consultation-fee-btn"
                type="button"
                onClick={() => setIsFeeModalOpen(true)}
                className="btn btn-primary btn-sm"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700,
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
                }}
              >
                <Edit3 size={15} />
                <span>Edit Fee</span>
              </button>

              {doctorProfile?.id && (
                <a
                  href={`/doctors/${doctorProfile.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.74rem',
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    justifyContent: 'center',
                    fontWeight: 500
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-600)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <span>View Public Profile</span>
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Status Tabs with Live Badges */}
        <div style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '28px'
        }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: isActive ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                  background: isActive ? 'var(--primary-50)' : '#ffffff',
                  color: isActive ? 'var(--primary-700)' : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.1)' : 'var(--shadow-sm)'
                }}
              >
                <span>{tab.label}</span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? 'var(--primary-600)' : 'var(--bg-surface)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontWeight: 800
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Appointment Rows */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div className="spinner"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Calendar size={32} />
            </div>
            <h3>No {activeTab} Appointments</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '400px' }}>
              There are currently no appointments in the "{activeTab}" state.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {appointments.map((apt) => {
              const patient = apt.patient || {};
              const isPending = apt.status.toLowerCase() === 'pending';
              const isAccepted = apt.status.toLowerCase() === 'accepted';
              const isCompleted = apt.status.toLowerCase() === 'completed';

              return (
                <div
                  key={apt.id}
                  className="card"
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  {/* Patient Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '240px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'var(--primary-100)',
                      color: 'var(--primary-700)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      flexShrink: 0
                    }}>
                      {patient.full_name ? patient.full_name[0].toUpperCase() : 'P'}
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>
                        Appointment #{apt.id}
                      </div>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: '2px 0' }}>
                        {patient.full_name || 'Patient'}
                      </h3>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                        {patient.email}
                      </div>
                    </div>
                  </div>

                  {/* Schedule Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '160px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      <Calendar size={16} color="var(--primary-600)" />
                      <span>{apt.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                      <Clock size={16} color="var(--primary-600)" />
                      <span>{apt.time_display || apt.time}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <StatusBadge status={apt.status} />
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedDetailsApt(apt)}
                      className="btn btn-outline btn-sm"
                      title="View details"
                    >
                      <Info size={15} />
                      <span>View Details</span>
                    </button>

                    {/* Pending Actions: Accept or Reject */}
                    {isPending && (
                      <>
                        <button
                          type="button"
                          disabled={updatingId === apt.id}
                          onClick={() => handleStatusChange(apt.id, 'accepted')}
                          className="btn btn-success btn-sm"
                        >
                          <CheckCircle2 size={15} />
                          <span>Accept</span>
                        </button>
                        <button
                          type="button"
                          disabled={updatingId === apt.id}
                          onClick={() => handleStatusChange(apt.id, 'rejected')}
                          className="btn btn-danger-outline btn-sm"
                        >
                          <XCircle size={15} />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {/* Accepted Actions: Write Prescription */}
                    {isAccepted && (
                      <button
                        type="button"
                        onClick={() => navigate(`/doctor/prescription/${apt.id}`)}
                        className="btn btn-primary btn-sm"
                      >
                        <FileEdit size={15} />
                        <span>Add Prescription</span>
                      </button>
                    )}

                    {/* Completed Actions: View Prescription */}
                    {isCompleted && (
                      <button
                        type="button"
                        onClick={() => setSelectedPrescriptionApt(apt)}
                        className="btn btn-secondary btn-sm"
                      >
                        <FileCheck2 size={15} />
                        <span>Prescription</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Appointment Detail Popup Modal */}
      {selectedDetailsApt && (
        <div className="modal-backdrop" onClick={() => setSelectedDetailsApt(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--text-main)' }}>
              Appointment Details #{selectedDetailsApt.id}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem' }}>
              <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                <strong>Patient Name:</strong> {selectedDetailsApt.patient?.full_name} <br />
                <strong>Email:</strong> {selectedDetailsApt.patient?.email}
              </div>

              <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                <strong>Consultation Schedule:</strong> {selectedDetailsApt.date} at {selectedDetailsApt.time_display || selectedDetailsApt.time} <br />
                <strong>Current Status:</strong> <StatusBadge status={selectedDetailsApt.status} />
              </div>

              <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                <strong>Booked On:</strong> {new Date(selectedDetailsApt.created_at).toLocaleString()}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                type="button"
                onClick={() => setSelectedDetailsApt(null)}
                className="btn btn-primary btn-sm"
              >
                Close
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

      {/* Edit Consultation Fee Modal */}
      <EditFeeModal
        isOpen={isFeeModalOpen}
        onClose={() => setIsFeeModalOpen(false)}
        currentFee={doctorProfile?.consultation_fee ?? user?.consultation_fee ?? 500}
        doctorId={doctorProfile?.id}
        onFeeUpdated={(newFee) => {
          setDoctorProfile((prev) => (prev ? { ...prev, consultation_fee: newFee } : { consultation_fee: newFee }));
        }}
      />
    </div>
  );
};

export default DoctorAppointments;
