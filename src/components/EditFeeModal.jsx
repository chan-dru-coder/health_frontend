import React, { useState, useEffect } from 'react';
import { updateConsultationFee, updateDoctorById } from '../api/doctors';
import { useAuth } from '../context/AuthContext';
import {
  DollarSign,
  X,
  Check,
  AlertCircle,
  Sparkles,
  Info,
  TrendingUp,
  Stethoscope
} from 'lucide-react';

const PRESET_FEES = [200, 350, 500, 650, 800, 1000];

const EditFeeModal = ({ isOpen, onClose, currentFee, doctorId, onFeeUpdated }) => {
  const [fee, setFee] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { showToast, updateUser } = useAuth();

  useEffect(() => {
    if (isOpen) {
      const initial = currentFee !== undefined && currentFee !== null ? Number(currentFee) : 500;
      setFee(initial.toString());
      setError(null);
    }
  }, [isOpen, currentFee]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePresetSelect = (amount) => {
    setFee(amount.toString());
    setError(null);
  };

  const handleAdjust = (diff) => {
    const currentVal = parseFloat(fee) || 0;
    const newVal = Math.max(0, currentVal + diff);
    setFee(newVal.toString());
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numFee = parseFloat(fee);

    if (isNaN(numFee) || numFee < 0) {
      setError('Please enter a valid, non-negative consultation fee.');
      return;
    }

    if (numFee > 100000) {
      setError('Consultation fee cannot exceed $100,000.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      let response;
      if (doctorId) {
        // If doctorId passed, update by ID (supports direct doctor detail page)
        response = await updateDoctorById(doctorId, { consultation_fee: numFee });
      } else {
        // Otherwise update current authenticated doctor
        response = await updateConsultationFee(numFee);
      }

      const updatedFee = response.doctor?.consultation_fee ?? numFee;

      // Update auth context state and storage
      if (updateUser) {
        updateUser({ consultation_fee: parseFloat(updatedFee) });
      }

      showToast(`Consultation fee successfully updated to $${Number(updatedFee).toFixed(0)}!`, 'success');

      if (onFeeUpdated) {
        onFeeUpdated(parseFloat(updatedFee));
      }

      onClose();
    } catch (err) {
      console.error('Failed to update consultation fee:', err);
      const errMsg =
        err.response?.data?.consultation_fee?.[0] ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        'Failed to update fee. Please try again.';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const parsedCurrent = Number(currentFee || 0);
  const parsedNew = parseFloat(fee) || 0;
  const hasChanged = parsedNew !== parsedCurrent;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          padding: '28px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.25)',
          border: '1px solid var(--border-light)'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
            }}>
              <DollarSign size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0, fontWeight: 700 }}>
                Edit Consultation Fee
              </h2>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Set your per-session appointment charges
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={saving}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition)'
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            padding: '12px 16px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            color: '#b91c1c',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '18px'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Current Fee vs New Fee Visual Badge */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Current Rate
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                ${parsedCurrent.toFixed(0)} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ session</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: hasChanged ? 'var(--primary-50)' : '#f1f5f9',
              border: hasChanged ? '1px solid var(--primary-200)' : '1px solid var(--border-light)',
              color: hasChanged ? 'var(--primary-700)' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 700
            }}>
              <TrendingUp size={15} />
              <span>New: ${parsedNew >= 0 ? parsedNew.toFixed(0) : '0'}</span>
            </div>
          </div>

          {/* Fee Input with Currency Prefix and Quick Step Buttons */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label" htmlFor="consultation-fee-input">
              Fee per Consultation (USD $)
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{
                position: 'absolute',
                left: '16px',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--primary-600)',
                pointerEvents: 'none'
              }}>
                $
              </span>
              <input
                id="consultation-fee-input"
                type="number"
                step="5"
                min="0"
                max="100000"
                value={fee}
                onChange={(e) => {
                  setFee(e.target.value);
                  setError(null);
                }}
                disabled={saving}
                className="form-input"
                placeholder="500"
                style={{
                  paddingLeft: '36px',
                  paddingRight: '110px',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  height: '52px'
                }}
                autoFocus
                required
              />
              <div style={{
                position: 'absolute',
                right: '8px',
                display: 'flex',
                gap: '4px'
              }}>
                <button
                  type="button"
                  onClick={() => handleAdjust(-50)}
                  disabled={saving || (parseFloat(fee) || 0) < 50}
                  className="btn btn-outline"
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    height: '36px'
                  }}
                  title="Decrease by $50"
                >
                  -50
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjust(50)}
                  disabled={saving}
                  className="btn btn-outline"
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    height: '36px'
                  }}
                  title="Increase by $50"
                >
                  +50
                </button>
              </div>
            </div>
          </div>

          {/* Preset Buttons */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
              Quick Presets:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {PRESET_FEES.map((preset) => {
                const isSelected = parsedNew === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    disabled={saving}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      border: isSelected ? '1.5px solid var(--primary-600)' : '1px solid var(--border-light)',
                      background: isSelected ? 'var(--primary-600)' : '#ffffff',
                      color: isSelected ? '#ffffff' : 'var(--text-main)',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    ${preset}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Informational Callout */}
          <div style={{
            background: 'var(--primary-50)',
            border: '1px solid var(--primary-200)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            fontSize: '0.84rem',
            color: 'var(--primary-800)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            marginBottom: '24px',
            lineHeight: 1.45
          }}>
            <Info size={18} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--primary-600)' }} />
            <div>
              <strong>Instant Update:</strong> Patients viewing your profile and booking upcoming appointments will immediately see this updated rate. Existing booked appointments remain unaffected.
            </div>
          </div>

          {/* Modal Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="btn btn-outline"
              style={{ minWidth: '100px' }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || !hasChanged || parsedNew < 0}
              className="btn btn-primary"
              style={{
                minWidth: '140px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {saving ? (
                <>
                  <div className="spinner spinner-sm" style={{ borderTopColor: '#ffffff' }}></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Check size={18} />
                  <span>Save New Fee</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFeeModal;
