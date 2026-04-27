import React, { useState } from 'react';
import { ShieldAlert, MapPin, RadioTower, Flame, HeartPulse, Users } from 'lucide-react';
import axios from 'axios';
import FestivalMap from '../components/FestivalMap';

const VolunteerDashboard = ({ user, aiData, alerts }) => {
  const [reportSent, setReportSent] = useState(false);
  
  // Assign randomly for demo if none exists, default to North Stage
  const assignedZone = user.assignedZone || 'North Stage';

  const zoneAlerts = alerts.filter(a => a.zoneId === assignedZone);
  const aiZoneStatus = aiData?.zone_analysis?.[assignedZone];
  const isEmergency = zoneAlerts.length > 0 || aiZoneStatus?.severity === 'CRITICAL' || aiZoneStatus?.severity === 'HIGH';

  const handleReport = async (type, message) => {
    try {
      await axios.post('http://localhost:5000/api/alerts/sos', {
        eventId: 'event_01',
        zoneId: assignedZone,
        severity: 'CRITICAL',
        message: `${type} reported by ${user.name}: ${message}`,
        action: 'Dispatch personnel immediately.',
        type: 'SOS_MANUAL'
      });
      setReportSent(true);
      setTimeout(() => setReportSent(false), 5000);
    } catch (err) {
      console.error("Report failed", err);
    }
  };

  return (
    <div className="volunteer-view">
      <header className="dash-header" style={{ marginBottom: '1rem' }}>
        <div>
          <h1 className="dash-title">Field Agent Panel</h1>
          <p className="dash-subtitle">Stay alert, {user.name}.</p>
        </div>
      </header>

      <div className={`assignment-card glass-panel ${isEmergency ? 'emergency-pulse' : ''}`}>
        
        <FestivalMap alerts={alerts} activeZone={assignedZone} />

        <div className="assignment-header" style={{ marginTop: '1rem' }}>
          <MapPin size={32} color={isEmergency ? '#DC2626' : 'var(--color-primary)'} />
          <div>
            <h2>Your Assignment</h2>
            <h1 className="zone-display">{assignedZone}</h1>
          </div>
        </div>

        {isEmergency ? (
          <div className="emergency-notice">
            <ShieldAlert size={24} />
            <div>
              <strong>Emergency Alert in Your Zone!</strong>
              <p>Crowd density is extremely high. Follow protocol.</p>
            </div>
          </div>
        ) : (
          <div className="safe-notice">
            <p>Your zone is currently stable. Maintain position and observe.</p>
          </div>
        )}

        <div className="sos-container">
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>File Incident Report</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button 
              className={`btn-sos ${reportSent ? 'sos-sent' : ''}`}
              style={{ padding: '1rem', fontSize: '1rem' }}
              onClick={() => handleReport('MEDICAL', 'Medical assistance required')}
              disabled={reportSent}
            >
              <HeartPulse size={24} />
              <span>Medical</span>
            </button>
            <button 
              className={`btn-sos ${reportSent ? 'sos-sent' : ''}`}
              style={{ padding: '1rem', fontSize: '1rem', background: '#D97706' }}
              onClick={() => handleReport('FIRE', 'Fire hazard detected')}
              disabled={reportSent}
            >
              <Flame size={24} />
              <span>Fire</span>
            </button>
            <button 
              className={`btn-sos ${reportSent ? 'sos-sent' : ''}`}
              style={{ padding: '1rem', fontSize: '1rem', background: '#4F46E5', gridColumn: '1 / -1' }}
              onClick={() => handleReport('OVERCROWDING', 'Dangerous crowd surge happening')}
              disabled={reportSent}
            >
              <Users size={24} />
              <span>Overcrowding (General SOS)</span>
            </button>
          </div>

          {reportSent && (
            <p className="sos-helper" style={{ color: '#16A34A', fontWeight: 'bold' }}>INCIDENT REPORT DISPATCHED!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
