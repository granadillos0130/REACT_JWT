// src/components/UsersList.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import type { DatabaseUser } from '../types/auth';
import './UsersList.css';

const UsersList = () => {
  const { token, logout } = useAuth();
  const [users, setUsers] = useState<DatabaseUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authService.getUsers(token);
      if (response.succes) {
        setUsers(response.data);
      } else {
        setError('Error al cargar usuarios');
      }
    } catch (error) {
      setError('Error al cargar la lista de usuarios');
      console.error('Error:', error);
      
      // Si el token es inválido, hacer logout automático
      if (error instanceof Error && error.message.includes('Token inválido')) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="users-list-card">
      <div className="card-header">
        <h2>Lista de Usuarios</h2>
        <button 
          onClick={loadUsers} 
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
            <span>Cargando usuarios...</span>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {!isLoading && !error && users.length > 0 && (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.idusuario}>
                    <td>{user.idusuario}</td>
                    <td>{user.nombre}</td>
                    <td>{user.apellido}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!isLoading && !error && users.length === 0 && (
          <div className="no-users-message">
            No se encontraron usuarios en la base de datos.
          </div>
        )}
      </div>
      
      {!isLoading && !error && users.length > 0 && (
        <div className="users-summary">
          <strong>Total de usuarios: {users.length}</strong>
        </div>
      )}
    </div>
  );
};

export default UsersList;