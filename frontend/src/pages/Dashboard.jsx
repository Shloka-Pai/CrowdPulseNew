import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import ManagerDashboard from './ManagerDashboard';
import VolunteerDashboard from './VolunteerDashboard';
import './Dashboard.css';

const Dashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [aiData, setAiData] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));

    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('ai-crowd-update', (data) => {
      setAiData(data);
    });

    socket.on('new-alert', (alertData) => {
      const newAlerts = Array.isArray(alertData) ? alertData : [alertData];
      setAlerts((prev) => [...newAlerts, ...prev].filter(a => !a.isResolved).slice(0, 10));
    });

    socket.on('resolved-alert', (alertId) => {
      setAlerts((prev) => prev.filter(a => a._id !== alertId));
    });

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="dashboard-container">
      {user.role === 'volunteer' ? (
        <VolunteerDashboard user={user} aiData={aiData} alerts={alerts} />
      ) : (
        <ManagerDashboard user={user} aiData={aiData} alerts={alerts} setAlerts={setAlerts} />
      )}
    </div>
  );
};

export default Dashboard;
