import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import { testBackendConnection } from './services/apiService.js';
import './index.css';

const manifest = new Manifest();

function App() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [backendConnected, setBackendConnected] = useState(null);

  useEffect(() => {
    const checkConnectionAndSession = async () => {
      console.log('🚀 [APP] Starting backend connection test...');
      const result = await testBackendConnection();
      setBackendConnected(result.success);
      
      if (result.success) {
        console.log('✅ [APP] Backend connection successful. Checking user session...');
        try {
          const currentUser = await manifest.from('User').me();
          setUser(currentUser);
          setCurrentScreen('dashboard');
          console.log('✅ [APP] User session found:', currentUser.email);
        } catch (error) {
          setUser(null);
          setCurrentScreen('landing');
          console.log('ℹ️ [APP] No active user session.');
        }
      } else {
        console.error('❌ [APP] Backend connection failed.');
        setCurrentScreen('landing');
      }
    };
    
    checkConnectionAndSession();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await manifest.login(email, password);
      const currentUser = await manifest.from('User').me();
      setUser(currentUser);
      setCurrentScreen('dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = async () => {
    await manifest.logout();
    setUser(null);
    setCurrentScreen('landing');
  };
  
  const renderContent = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardPage user={user} onLogout={handleLogout} manifest={manifest} />;
      case 'landing':
        return <LandingPage onLogin={handleLogin} />;
      case 'loading':
      default:
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-gray-600">Loading Application...</p>
          </div>
        );
    }
  };

  return (
    <div>
      {backendConnected !== null && (
        <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={`text-sm font-medium ${backendConnected ? 'text-gray-700' : 'text-red-700'}`}>
            {backendConnected ? 'Backend Connected' : 'Backend Disconnected'}
          </span>
        </div>
      )}
      {renderContent()}
    </div>
  );
}

export default App;
