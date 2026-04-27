import React, { useEffect, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle, Map, Bell, Users, Check } from 'lucide-react';
import axios from 'axios';
import FestivalMap from '../components/FestivalMap';

const ManagerDashboard = ({ user, aiData, alerts, setAlerts }) => {
  const [volunteers, setVolunteers] = useState([]);
  const [activeZoneFilter, setActiveZoneFilter] = useState(null);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/volunteers');
        setVolunteers(res.data.volunteers || []);
      } catch (err) {
        console.error("Failed to fetch volunteers");
      }
    };
    fetchVolunteers();
  }, []);

  const handleResolve = async (alertId) => {
    try {
      await axios.put(`http://localhost:5000/api/alerts/${alertId}/resolve`);
      setAlerts(prev => prev.filter(a => a._id !== alertId));
    } catch (err) {
      console.error("Failed to resolve alert");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CRITICAL': return '#DC2626';
      case 'HIGH': return '#EA580C';
      case 'MEDIUM': return '#D97706';
      case 'LOW': return '#16A34A';
      default: return 'var(--color-primary)';
    }
  };

  const handleMapZoneClick = (zoneId) => {
    setActiveZoneFilter(prev => prev === zoneId ? null : zoneId);
  };

  // Filter alerts by the active map zone
  const displayedAlerts = activeZoneFilter 
    ? alerts.filter(a => a.zoneId === activeZoneFilter) 
    : alerts;

  return (
    <>
      <header className="dash-header">
        <div>
          <h1 className="dash-title">Command Center</h1>
          <p className="dash-subtitle">Welcome back, {user.name}. Monitoring active zones.</p>
        </div>
        
        {aiData && (
          <div className="global-status-badge glass-panel" style={{ borderLeft: `6px solid ${getStatusColor(aiData.global_status)}` }}>
            <Activity size={24} color={getStatusColor(aiData.global_status)} />
            <div>
              <span className="status-label">Global Status</span>
              <strong className="status-value" style={{ color: getStatusColor(aiData.global_status) }}>
                {aiData.global_status}
              </strong>
            </div>
          </div>
        )}
      </header>

      <div className="dash-grid">
        <section className="dash-main">
          
          <FestivalMap alerts={alerts} activeZone={activeZoneFilter} onZoneClick={handleMapZoneClick} />

          <div className="panel-header">
            <Map size={20} />
            <h2>Zone Intelligence {activeZoneFilter && `(${activeZoneFilter})`}</h2>
          </div>
          
          <div className="zone-grid">
            {aiData?.zone_analysis ? (
              Object.entries(aiData.zone_analysis)
                .filter(([zone]) => !activeZoneFilter || zone === activeZoneFilter)
                .map(([zone, data]) => (
                <div key={zone} className="zone-card glass-panel" style={{ borderTop: `4px solid ${getStatusColor(data.severity)}` }}>
                  <h3>{zone}</h3>
                  <div className="zone-stats">
                    <div className="stat-row">
                      <span>Severity</span>
                      <span className="badge" style={{ backgroundColor: getStatusColor(data.severity), color: 'white' }}>{data.severity}</span>
                    </div>
                    <div className="stat-row">
                      <span>Flow</span>
                      <strong>{data.flow_pattern}</strong>
                    </div>
                    <div className="stat-row">
                      <span>Density</span>
                      <strong>{data.density_level}</strong>
                    </div>
                    <div className="stat-row">
                      <span>Est. People</span>
                      <strong>{data.people_count || 'N/A'}</strong>
                    </div>
                  </div>
                  <div className="zone-reason">
                    <AlertTriangle size={14} />
                    <span>{data.reason}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="waiting-state">
                <div className="spinner"></div>
                <p>Waiting for AI video analysis stream...</p>
                <small>Run test_upload.py to simulate video feed</small>
              </div>
            )}
          </div>

          <div className="panel-header" style={{ marginTop: '2rem' }}>
            <Users size={20} />
            <h2>Active Volunteers</h2>
          </div>
          <div className="volunteers-list glass-panel">
            {volunteers.length > 0 ? (
              volunteers.map(vol => (
                <div key={vol._id} className="volunteer-row">
                  <div className="vol-info">
                    <strong>{vol.name}</strong>
                    <span className="vol-email">{vol.email}</span>
                  </div>
                  <div className="vol-zone badge">Assigned: {vol.assignedZone || 'Zone A'}</div>
                </div>
              ))
            ) : (
              <p style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>No active volunteers found.</p>
            )}
          </div>
        </section>

        <aside className="dash-sidebar">
          <div className="panel-header">
            <Bell size={20} />
            <h2>Live Alerts Feed</h2>
          </div>
          
          <div className="alerts-list">
            {displayedAlerts.length > 0 ? (
              displayedAlerts.map((alert, i) => (
                <div key={alert._id || i} className="alert-item glass-panel" style={{ borderLeft: `4px solid ${getStatusColor(alert.severity)}` }}>
                  <div className="alert-meta">
                    <span className="alert-zone">{alert.zoneId || 'Global'}</span>
                    <span className="alert-time">Just now</span>
                  </div>
                  <p className="alert-message">{alert.message || 'Action required'}</p>
                  <div className="alert-footer">
                    <span className="alert-type badge">{alert.type}</span>
                    <button className="btn-resolve" onClick={() => handleResolve(alert._id)}>
                      <Check size={14} /> Resolve
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-alerts">
                <CheckCircle size={32} color="var(--color-border)" />
                <p>No critical alerts.</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
};

export default ManagerDashboard;
