import React from 'react';
import './FestivalMap.css';

const FestivalMap = ({ alerts, activeZone, onZoneClick }) => {
  // We use a public placeholder if the map isn't saved, but user was instructed to save it
  const mapImage = '/map.png'; 

  // Check if a zone has an active high/critical alert
  const hasAlert = (zoneName) => {
    return alerts?.some(a => a.zoneId === zoneName && (a.severity === 'HIGH' || a.severity === 'CRITICAL'));
  };

  const zones = [
    { id: 'North Stage', label: 'North Stage', top: '25%', left: '45%', width: '30%', height: '25%' },
    { id: 'East Stage Zone', label: 'Secondary Stage', top: '55%', left: '70%', width: '25%', height: '25%' },
    { id: 'Market & Merch', label: 'Market & Merch', top: '55%', left: '20%', width: '25%', height: '25%' },
    { id: 'Food & Beverage Plaza', label: 'Food & Beverage', top: '60%', left: '48%', width: '20%', height: '20%' },
    { id: 'DJ Tent South Zone', label: 'DJ Tent', top: '80%', left: '60%', width: '15%', height: '15%' },
    { id: 'Activation Zone', label: 'Activation Zone', top: '75%', left: '35%', width: '20%', height: '15%' },
  ];

  return (
    <div className="map-container glass-panel">
      <div className="map-wrapper">
        {/* If the image doesn't load, we show a fallback text */}
        <div className="map-fallback">
          Please save 'map.png' to 'frontend/public/'
        </div>
        <img src={mapImage} alt="Festival Map" className="map-image" />
        
        {zones.map((zone) => {
          const isAlert = hasAlert(zone.id);
          const isActive = activeZone === zone.id;
          
          return (
            <div
              key={zone.id}
              className={`map-zone ${isAlert ? 'zone-alert' : ''} ${isActive ? 'zone-active' : ''}`}
              style={{
                top: zone.top,
                left: zone.left,
                width: zone.width,
                height: zone.height
              }}
              onClick={() => onZoneClick && onZoneClick(zone.id)}
            >
              <div className="zone-tooltip">{zone.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FestivalMap;
