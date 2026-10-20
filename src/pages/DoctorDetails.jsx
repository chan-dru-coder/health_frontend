import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDoctorDetails } from '../api/doctors';
import SlotPicker from '../components/SlotPicker';
import EditFeeModal from '../components/EditFeeModal';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  MapPin,
  Award,
  Clock,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  CalendarCheck,
  Edit3,
  Stethoscope,
  DollarSign
} from 'lucide-react';

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, showToast } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const isOwnProfile = Boolean(
    isAuthenticated &&
    user?.role === 'doctor' &&
    (user?.doctor_id === Number(id) || (doctor && doctor.user_id === user?.id))
  );

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDoctorDetails(id);
        setDoctor(data);
      } catch (err) {
        setError('Doctor details could not be loaded.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  const handleProceedBooking = () => {
    if (!selectedSlot) {
      showToast('Please select an available time slot first.', 'error');
      return;
    }

    if (!isAuthenticated) {
      showToast('Please log in as a patient to book an appointment.', 'info');
      navigate('/login', { state: { from: `/book/${id}?date=${selectedDate}&time=${selectedSlot.start_time}&slot_id=${selectedSlot.id}` } });
      return;
    }

    if (user?.role === 'doctor') {
      showToast('Doctors cannot book patient appointments. Please use a patient account.', 'error');
      return;
    }

    navigate(`/book/${id}?date=${selectedDate}&time=${selectedSlot.start_time}&slot_id=${selectedSlot.id}`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Doctor Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '12px 0 24px' }}>
          {error || "The requested doctor profile does not exist or has been removed."}
        </p>
        <Link to="/doctors" className="btn btn-primary">
          Back to Doctors List
        </Link>
      </div>
    );
  }

  const fallbackImage = `https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80`;

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: 'calc(100vh - 74px)', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Back Link */}
        <Link
          to="/doctors"
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
          <span>Back to All Doctors</span>
        </Link>

        {/* Doctor Main Header Card */}
        <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            alignItems: 'center'
          }}>
            {/* Doctor Photo & Badges */}
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{
                position: 'relative',
                width: '140px',
                height: '140px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                flexShrink: 0,
                background: '#e2e8f0'
              }}>
                <img
                  src={doctor.profile_image || fallbackImage}
                  alt={doctor.full_name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = fallbackImage; }}
                />
              </div>

              <div>
                <span className="badge badge-completed" style={{ marginBottom: '8px' }}>
                  {doctor.specialization}
                </span>
                <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '6px' }}>
                  {doctor.full_name}
                </h1>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--primary-700)',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  marginBottom: '8px'
                }}>
                  <Award size={16} />
                  <span>{doctor.qualification}</span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                  fontSize: '0.88rem',
                  color: 'var(--text-muted)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={16} fill="#eab308" color="#eab308" />
                    <strong style={{ color: 'var(--text-main)' }}>{Number(doctor.rating).toFixed(1)}</strong>
                    <span>({doctor.reviews_count} reviews)</span>
                  </div>
                  <div>•</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={16} />
                    <span>{doctor.experience_years} Years Experience</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Consultation Fee & Hospital Box */}
            <div style={{
              background: 'var(--primary-50)',
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              border: isOwnProfile ? '2px solid var(--primary-300)' : '1px solid var(--primary-100)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              position: 'relative'
            }}>
              {isOwnProfile && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '16px',
                  background: 'var(--primary-700)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 10px',
                  borderRadius: 'var(--radius-full)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}>
                  Your Profile
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Consultation Fee
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                    ${Number(doctor.consultation_fee).toFixed(0)}{' '}
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ per session</span>
                  </div>
                </div>

                {isOwnProfile && (
                  <button
                    id="doctor-details-edit-fee-btn"
                    type="button"
                    onClick={() => setIsFeeModalOpen(true)}
                    className="btn btn-primary btn-sm"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 16px',
                      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)'
                    }}
                  >
                    <Edit3 size={15} />
                    <span>Edit Fee</span>
                  </button>
                )}
              </div>

              <div style={{ borderTop: '1px solid var(--primary-200)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                  <MapPin size={18} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Hospital / Practice Location:</strong>
                    <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{doctor.hospital_location}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Section: About on Left, Slot Picker & Booking on Right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Left Column: About & Credentials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '16px', color: 'var(--text-main)' }}>
                About {doctor.full_name}
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                {doctor.about || 'Specialist healthcare provider registered with MediConnect with verified credentials, rigorous board examinations, and distinguished clinical practice.'}
              </p>

              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--text-main)' }}>
                  Key Practice Highlights
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={16} color="var(--primary-600)" />
                    <span>Verified Medical License & Board Certifications</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={16} color="var(--primary-600)" />
                    <span>Digital Health Records & Online Prescriptions</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={16} color="var(--primary-600)" />
                    <span>Dedicated Follow-up & Treatment Monitoring</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Date Tabs & Available Slots or Practitioner Self-View */}
          {isOwnProfile ? (
            <div
              className="card"
              style={{
                padding: '28px',
                border: '1.5px solid var(--primary-200)',
                background: 'linear-gradient(135deg, #ffffff 0%, var(--primary-50) 100%)',
                boxShadow: '0 4px 20px rgba(37, 99, 235, 0.08)'
              }}
            >
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <Stethoscope size={26} />
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--primary-100)',
                color: 'var(--primary-800)',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                marginBottom: '12px'
              }}>
                Practitioner Preview
              </div>

              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', margin: '0 0 8px 0', fontWeight: 700 }}>
                Manage Your Public Profile
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '22px' }}>
                This is your public doctor profile as seen by patients searching for consultations. You can update your consultation fee anytime.
              </p>

              {/* Rate card box */}
              <div style={{
                background: '#ffffff',
                padding: '18px 20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--primary-200)',
                marginBottom: '22px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Current Rate
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-700)', marginTop: '2px' }}>
                    ${Number(doctor.consultation_fee).toFixed(0)}{' '}
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ session</span>
                  </div>
                </div>

                <button
                  id="self-view-edit-fee-btn"
                  type="button"
                  onClick={() => setIsFeeModalOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
                >
                  <Edit3 size={15} />
                  <span>Edit Fee</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsFeeModalOpen(true)}
                  className="btn btn-primary btn-lg"
                  style={{
                    width: '100%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <DollarSign size={18} />
                  <span>Update Consultation Fee</span>
                </button>

                <Link
                  to="/doctor/appointments"
                  className="btn btn-outline"
                  style={{ width: '100%', textAlign: 'center', fontWeight: 600 }}
                >
                  Back to Practitioner Portal
                </Link>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: '28px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border-light)'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', margin: 0 }}>
                    Book An Appointment
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Select an available slot below
                  </span>
                </div>
                <CalendarCheck size={24} color="var(--primary-600)" />
              </div>

              <SlotPicker
                doctorId={doctor.id}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
              />

              {/* Selection Summary */}
              {selectedSlot && (
                <div style={{
                  marginTop: '24px',
                  padding: '16px',
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>
                      Selected Time Slot
                    </div>
                    <div style={{ fontWeight: 800, color: '#065f46', fontSize: '1rem' }}>
                      {selectedDate} at {selectedSlot.time_display || selectedSlot.start_time}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleProceedBooking}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '24px' }}
              >
                <span>Book Appointment</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Consultation Fee Modal */}
      {isOwnProfile && (
        <EditFeeModal
          isOpen={isFeeModalOpen}
          onClose={() => setIsFeeModalOpen(false)}
          currentFee={doctor?.consultation_fee}
          doctorId={doctor?.id}
          onFeeUpdated={(newFee) => {
            setDoctor((prev) => (prev ? { ...prev, consultation_fee: newFee } : null));
          }}
        />
      )}
    </div>
  );
};

export default DoctorDetails;
