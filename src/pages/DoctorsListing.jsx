import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getDoctors } from '../api/doctors';
import DoctorCard from '../components/DoctorCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Stethoscope,
  Heart,
  Sparkles,
  Brain,
  Baby,
  Bone,
  Activity,
  X
} from 'lucide-react';

const specializations = [
  { name: 'All Doctors', value: '', icon: Stethoscope },
  { name: 'Cardiologist', value: 'Cardiologist', icon: Heart },
  { name: 'Dermatologist', value: 'Dermatologist', icon: Sparkles },
  { name: 'Neurologist', value: 'Neurologist', icon: Brain },
  { name: 'Pediatrician', value: 'Pediatrician', icon: Baby },
  { name: 'Orthopedist', value: 'Orthopedist', icon: Bone },
  { name: 'General Physician', value: 'General Physician', icon: Activity },
];

const DoctorsListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSpec = searchParams.get('specialization') || '';
  const initialSearch = searchParams.get('search') || '';

  const [selectedSpecialization, setSelectedSpecialization] = useState(initialSpec);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [ordering, setOrdering] = useState('-rating');
  const [doctors, setDoctors] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    setSelectedSpecialization(searchParams.get('specialization') || '');
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = {
          ordering,
        };
        if (selectedSpecialization) params.specialization = selectedSpecialization;
        if (searchTerm) params.search = searchTerm;

        const data = await getDoctors(params);
        setDoctors(data.results || []);
        setCount(data.count || 0);
      } catch (err) {
        console.error('Failed to load doctors list', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [selectedSpecialization, searchTerm, ordering]);

  const handleSelectSpecialization = (val) => {
    setSelectedSpecialization(val);
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('specialization', val);
    } else {
      newParams.delete('specialization');
    }
    setSearchParams(newParams);
    setMobileFilterOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newParams.set('search', searchTerm);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSelectedSpecialization('');
    setSearchTerm('');
    setSearchParams({});
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: 'calc(100vh - 74px)', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header Banner */}
        <div style={{ marginBottom: '32px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Medical Directory
          </span>
          <h1 style={{ fontSize: '2.2rem', marginTop: '4px', color: 'var(--text-main)' }}>
            Find & Consult Verified Doctors
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px' }}>
            Browse through specialized medical consultants, view credentials, and book verified time slots.
          </p>
        </div>

        {/* Search & Mobile Filter Toggle Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px'
        }}>
          <form
            onSubmit={handleSearchSubmit}
            style={{
              flex: '1 1 300px',
              maxWidth: '540px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              placeholder="Search by doctor name, specialty, or clinic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '42px', paddingRight: '80px' }}
            />
            <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '14px' }} />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              style={{ position: 'absolute', right: '6px', padding: '6px 14px' }}
            >
              Search
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={16} color="var(--text-muted)" />
              <select
                value={ordering}
                onChange={(e) => setOrdering(e.target.value)}
                className="form-select"
                style={{ width: 'auto', padding: '8px 12px', fontSize: '0.88rem' }}
              >
                <option value="-rating">Highest Rated</option>
                <option value="-experience_years">Most Experienced</option>
                <option value="consultation_fee">Lowest Fee</option>
                <option value="-consultation_fee">Highest Fee</option>
              </select>
            </div>

            {/* Mobile filter button */}
            <button
              className="btn btn-outline show-on-mobile btn-sm"
              onClick={() => setMobileFilterOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Filter size={16} />
              <span>Filter Specialties</span>
            </button>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Left Sidebar Filter (Desktop) */}
          <aside className="hide-on-mobile" style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            position: 'sticky',
            top: '90px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--border-light)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.98rem' }}>
                <Filter size={18} color="var(--primary-600)" />
                <span>Specialization</span>
              </div>
              {(selectedSpecialization || searchTerm) && (
                <button
                  onClick={clearFilters}
                  style={{ fontSize: '0.78rem', color: 'var(--primary-600)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Reset
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {specializations.map((item) => {
                const isSelected = selectedSpecialization === item.value;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleSelectSpecialization(item.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--primary-50)' : 'transparent',
                      color: isSelected ? 'var(--primary-700)' : 'var(--text-main)',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '0.9rem',
                      textAlign: 'left',
                      transition: 'var(--transition)',
                      cursor: 'pointer',
                      border: isSelected ? '1px solid var(--primary-200)' : '1px solid transparent'
                    }}
                  >
                    <IconComponent size={17} color={isSelected ? 'var(--primary-600)' : 'var(--text-muted)'} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Doctor Cards Grid */}
          <main>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                Showing <strong>{doctors.length}</strong> of <strong>{count}</strong> doctors
                {selectedSpecialization && ` in "${selectedSpecialization}"`}
              </div>

              {(selectedSpecialization || searchTerm) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {selectedSpecialization && (
                    <span className="badge badge-completed">
                      {selectedSpecialization}
                      <X size={13} style={{ cursor: 'pointer' }} onClick={() => handleSelectSpecialization('')} />
                    </span>
                  )}
                  {searchTerm && (
                    <span className="badge badge-pending">
                      "{searchTerm}"
                      <X size={13} style={{ cursor: 'pointer' }} onClick={() => { setSearchTerm(''); handleSearchSubmit({ preventDefault: () => {} }); }} />
                    </span>
                  )}
                </div>
              )}
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                <div className="spinner"></div>
              </div>
            ) : doctors.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Stethoscope size={32} />
                </div>
                <h3>No Doctors Found</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '420px', fontSize: '0.92rem' }}>
                  No doctors matched your current filter criteria. Try clearing search filters or selecting another medical discipline.
                </p>
                <button onClick={clearFilters} className="btn btn-secondary btn-sm" style={{ marginTop: '8px' }}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px'
              }}>
                {doctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Specialization Filter Modal Drawer */}
      {mobileFilterOpen && (
        <div className="modal-backdrop" onClick={() => setMobileFilterOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '380px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Filter by Specialty</h3>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {specializations.map((item) => {
                const isSelected = selectedSpecialization === item.value;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleSelectSpecialization(item.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--primary-50)' : 'var(--bg-surface)',
                      color: isSelected ? 'var(--primary-700)' : 'var(--text-main)',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    <IconComponent size={18} color={isSelected ? 'var(--primary-600)' : 'var(--text-muted)'} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsListing;
