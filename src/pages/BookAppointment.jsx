import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { getDoctorDetails, getDoctorSlots } from '../api/doctors';
import { bookAppointment } from '../api/appointments';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  Award,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  X
} from 'lucide-react';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, showToast } = useAuth();

  const initialDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const initialTime = searchParams.get('time') || '';
  const initialSlotId = searchParams.get('slot_id') || null;

  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const [slotId, setSlotId] = useState(initialSlotId);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 1. Fetch Doctor details
  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const data = await getDoctorDetails(doctorId);
        setDoctor(data);
      } catch (err) {
        setError('Doctor details could not be found.');
      } finally {
        setPageLoading(false);
      }
    };
    fetchDoc();
  }, [doctorId]);

  // 2. Fetch Slots whenever date changes
  useEffect(() => {
    if (!doctorId || !date) return;

    const fetchSlots = async () => {
      setSlotsLoading(true);
      try {
        const data = await getDoctorSlots(doctorId, date);
        const slotsList = data.slots || [];
        setAvailableSlots(slotsList);

        // If current time is not in the newly fetched slots, reset or pick first
        if (slotsList.length > 0) {
          const matchingSlot = slotsList.find((s) => s.start_time === time || s.start_time.slice(0, 5) === time.slice(0, 5));
          if (matchingSlot) {
            setTime(matchingSlot.start_time);
            setSlotId(matchingSlot.id);
          } else {
            setTime(slotsList[0].start_time);
            setSlotId(slotsList[0].id);
          }
        } else {
          setTime('');
          setSlotId(null);
        }
      } catch (err) {
        console.error('Failed to load slots', err);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [doctorId, date]);

  const handleTimeChange = (e) => {
    const selectedTimeVal = e.target.value;
    setTime(selectedTimeVal);
    const found = availableSlots.find((s) => s.start_time === selectedTimeVal);
    setSlotId(found ? found.id : null);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!date || !time) {
      setError('Please select both a date and an available time slot.');
      return;
    }

    setSubmitting(true);
    try {
      await bookAppointment({
        doctor_id: parseInt(doctorId, 10),
        date,
        time,
        slot_id: slotId ? parseInt(slotId, 10) : null,
      });

      showToast('Appointment booked successfully! Our clinic will confirm your request.', 'success');
      navigate('/my-appointments');
    } catch (err) {
      const errMsg =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        err.response?.data?.error ||
        err.response?.data?.date?.[0] ||
        'Failed to book appointment. The selected slot might have already been taken.';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Doctor Not Found</h2>
        <Link to="/doctors" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Doctors List
        </Link>
      </div>
    );
  }

  const fallbackImage = `https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80`;
  const todayIso = new Date().toISOString().split('T')[0];

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: 'calc(100vh - 74px)', padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        {/* Navigation */}
        <Link
          to={`/doctors/${doctorId}`}
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
          <span>Back to Profile</span>
        </Link>

        <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--text-main)' }}>
          Confirm Your Appointment
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px' }}>
          Review doctor information and select your preferred consultation schedule.
        </p>

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

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
          alignItems: 'start'
        }}>
          {/* Doctor Summary Card */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '16px' }}>
              Doctor Summary
            </h3>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <img
                src={doctor.profile_image || fallbackImage}
                alt={doctor.full_name}
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: 'var(--radius-md)',
                  objectFit: 'cover'
                }}
                onError={(e) => { e.target.src = fallbackImage; }}
              />
              <div>
                <span className="badge badge-completed" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
                  {doctor.specialization}
                </span>
                <h4 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: '2px 0' }}>
                  {doctor.full_name}
                </h4>
                <div style={{ fontSize: '0.86rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                  {doctor.qualification}
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-light)',
              fontSize: '0.9rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <MapPin size={16} color="var(--primary-600)" />
                <span>{doctor.hospital_location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <Award size={16} color="var(--primary-600)" />
                <span>{doctor.experience_years} Years Clinical Practice</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <DollarSign size={16} color="var(--primary-600)" />
                <span>Consultation Fee: <strong style={{ color: 'var(--text-main)' }}>${Number(doctor.consultation_fee).toFixed(0)}</strong></span>
              </div>
            </div>

            <div style={{
              marginTop: '24px',
              padding: '14px',
              background: 'var(--primary-50)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--primary-100)',
              fontSize: '0.85rem',
              color: 'var(--primary-800)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Patient: <strong>{user?.full_name}</strong> ({user?.email})</span>
            </div>
          </div>

          {/* Booking Form Card */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '20px' }}>
              Select Date & Time
            </h3>

            <form onSubmit={handleBookingSubmit}>
              {/* Date Picker */}
              <div className="form-group">
                <label className="form-label" htmlFor="bookingDate">
                  Consultation Date
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="bookingDate"
                    type="date"
                    min={todayIso}
                    required
                    className="form-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                  />
                  <Calendar size={18} color="var(--text-light)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                </div>
              </div>

              {/* Time Dropdown */}
              <div className="form-group">
                <label className="form-label" htmlFor="bookingTime">
                  Available Time Slot
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    id="bookingTime"
                    required
                    disabled={slotsLoading || availableSlots.length === 0}
                    className="form-select"
                    value={time}
                    onChange={handleTimeChange}
                    style={{ paddingLeft: '40px' }}
                  >
                    {slotsLoading ? (
                      <option value="">Loading slots...</option>
                    ) : availableSlots.length === 0 ? (
                      <option value="">No available slots for this date</option>
                    ) : (
                      <>
                        <option value="">-- Choose a time slot --</option>
                        {availableSlots.map((slot) => (
                          <option key={slot.id} value={slot.start_time}>
                            {slot.time_display || slot.start_time}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  <Clock size={18} color="var(--text-light)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                </div>
                {availableSlots.length === 0 && !slotsLoading && (
                  <div style={{ fontSize: '0.82rem', color: '#dc2626', marginTop: '4px' }}>
                    All slots on {date} are booked. Please pick another date.
                  </div>
                )}
              </div>

              {/* Action Buttons: Confirm & Cancel */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '32px'
              }}>
                <button
                  type="submit"
                  disabled={submitting || !time || availableSlots.length === 0}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '12px' }}
                >
                  {submitting ? (
                    <>
                      <div className="spinner spinner-sm" style={{ borderTopColor: '#ffffff' }}></div>
                      <span>Confirming...</span>
                    </>
                  ) : (
                    <span>Confirm Booking</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/doctors/${doctorId}`)}
                  className="btn btn-outline"
                  style={{ padding: '12px 20px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
