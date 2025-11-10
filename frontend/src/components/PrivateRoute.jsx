import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return user && user.role === 'admin' ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
