// src/components/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import './Dashboard.css';

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [protectedData, setProtectedData] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProtectedData();
  }, []);

  const loadProtectedData = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const data = await authService.getProtectedData(token);
      setProtectedData(data.message);
    } catch (error) {
      setError('Error al cargar datos protegidos');
      console.error('Error:', error);
      
      // Si el token es inválido, hacer logout automático
      if (error instanceof Error && error.message.includes('Token inválido')) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="user-info">
          <h1>¡Bienvenido, {user?.nombre} {user?.apellido}!</h1>
          <p className="user-subtitle">Panel de administración</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>

      <div className="dashboard-content">
        <div className="info-card">
          <h2>Información del Usuario</h2>
          <div className="user-details">
            <div className="detail-item">
              <span className="label">Nombre:</span>
              <span className="value">{user?.nombre}</span>
            </div>
            <div className="detail-item">
              <span className="label">Apellido:</span>
              <span className="value">{user?.apellido}</span>
            </div>
            <div className="detail-item">
              <span className="label">Estado:</span>
              <span className="value status-active">Sesión Activa</span>
            </div>
          </div>
        </div>

        <div className="protected-data-card">
          <div className="card-header">
            <h2>Datos del Endpoint Protegido</h2>
            <button 
              onClick={loadProtectedData} 
              className="refresh-button"
              disabled={isLoading}
            >
              {isLoading ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>
          
          <div className="card-content">
            {isLoading && (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Cargando datos...</span>
              </div>
            )}
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            {!isLoading && !error && protectedData && (
              <div className="success-message">
                <strong>Respuesta del servidor:</strong>
                <p>{protectedData}</p>
              </div>
            )}
          </div>
        </div>

        <div className="token-info-card">
          <h2>Información del Token</h2>
          <div className="token-display">
            <label>Token JWT:</label>
            <div className="token-value">
              {token ? `${token.substring(0, 50)}...` : 'No disponible'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;