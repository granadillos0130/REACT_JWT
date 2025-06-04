// src/components/UsersStats.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import type { DatabaseUser } from '../types/auth';
import './UsersStats.css';

interface UserStats {
  totalUsers: number;
  domains: { [key: string]: number };
  mostCommonDomain: string;
}

const UsersStats = () => {
  const { token, logout } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const calculateStats = (users: DatabaseUser[]): UserStats => {
    const domains: { [key: string]: number } = {};
    
    users.forEach(user => {
      const domain = user.email.split('@')[1];
      domains[domain] = (domains[domain] || 0) + 1;
    });

    const mostCommonDomain = Object.keys(domains).reduce((a, b) => 
      domains[a] > domains[b] ? a : b
    );

    return {
      totalUsers: users.length,
      domains,
      mostCommonDomain
    };
  };

  const loadStats = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authService.getUsers(token);
      if (response.succes) {
        const calculatedStats = calculateStats(response.data);
        setStats(calculatedStats);
      } else {
        setError('Error al cargar estadísticas');
      }
    } catch (error) {
      setError('Error al cargar estadísticas de usuarios');
      console.error('Error:', error);
      
      if (error instanceof Error && error.message.includes('Token inválido')) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="users-stats-card">
      <div className="card-header">
        <h2>📊 Estadísticas de Usuarios</h2>
        <button 
          onClick={loadStats} 
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
            <span>Calculando estadísticas...</span>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {!isLoading && !error && stats && (
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{stats.totalUsers}</div>
              <div className="stat-label">Total de Usuarios</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-number">{Object.keys(stats.domains).length}</div>
              <div className="stat-label">Dominios Únicos</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-number">{stats.domains[stats.mostCommonDomain]}</div>
              <div className="stat-label">Mayor Cantidad</div>
              <div className="stat-sublabel">({stats.mostCommonDomain})</div>
            </div>
            
            <div className="domains-breakdown">
              <h3>Distribución por Dominio</h3>
              <div className="domains-list">
                {Object.entries(stats.domains)
                  .sort(([,a], [,b]) => b - a)
                  .map(([domain, count]) => (
                    <div key={domain} className="domain-item">
                      <span className="domain-name">@{domain}</span>
                      <span className="domain-count">{count} usuario{count !== 1 ? 's' : ''}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersStats;