import React, { useState, useEffect } from 'react';
import { getDoctorSlots } from '../api/doctors';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

const SlotPicker = ({ doctorId, selectedDate, onSelectDate, selectedSlot, onSelectSlot }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate 7 upcoming dates
  const upcomingDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      iso: d.toISOString().split('T')[0],
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateFormatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });

  const currentDate = selectedDate || upcomingDates[0].iso;

  useEffect(() => {
    if (!doctorId) return;

    let isMounted = true;
    const fetchSlots = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDoctorSlots(doctorId, currentDate);
        if (isMounted) {
          setSlots(data.slots || []);
        }
      } catch (err) {
        if (isMounted) {
          setError('Could not fetch available slots for this date.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSlots();
    return () => {
      isMounted = false;
    };
  }, [doctorId, currentDate]);

  return (
    <div>
      {/* Date Tabs */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{
          fontSize: '0.88rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Calendar size={16} color="var(--primary-600)" />
          <span>Select Date</span>
        </div>

        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '8px',
          scrollbarWidth: 'thin'
        }}>
          {upcomingDates.map((item) => {
            const isSelected = item.iso === currentDate;
            return (
              <button
                key={item.iso}
                type="button"
                onClick={() => {
                  onSelectDate(item.iso);
                  onSelectSlot(null); // reset selected slot on date change
                }}
                style={{
                  minWidth: '94px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                  background: isSelected ? 'var(--primary-50)' : '#ffffff',
                  color: isSelected ? 'var(--primary-700)' : 'var(--text-main)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'var(--transition)',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: isSelected ? 'var(--primary-600)' : 'var(--text-muted)' }}>
                  {item.dayName}
                </span>
                <span style={{ fontSize: '0.92rem', fontWeight: 800 }}>
                  {item.dateFormatted}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Available Slots Chips */}
      <div>
        <div style={{
          fontSize: '0.88rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Clock size={16} color="var(--primary-600)" />
          <span>Available Time Slots</span>
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '20px 0', color: 'var(--text-muted)' }}>
            <div className="spinner spinner-sm"></div>
            <span style={{ fontSize: '0.9rem' }}>Loading available slots...</span>
          </div>
        ) : error ? (
          <div style={{ color: '#ef4444', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        ) : slots.length === 0 ? (
          <div style={{
            padding: '24px',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.9rem'
          }}>
            No available time slots for this date. Please choose another day.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
            gap: '10px'
          }}>
            {slots.map((s) => {
              const isSelected = selectedSlot && (selectedSlot.id === s.id || selectedSlot.start_time === s.start_time);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelectSlot(s)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                    background: isSelected ? 'var(--primary-600)' : '#ffffff',
                    color: isSelected ? '#ffffff' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    transition: 'var(--transition)',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'var(--shadow-sm)'
                  }}
                >
                  {s.time_display || s.start_time.slice(0, 5)}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotPicker;
