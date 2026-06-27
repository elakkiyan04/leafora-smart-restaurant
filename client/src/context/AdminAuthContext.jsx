import { createContext, useState, useContext, useEffect } from 'react';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);
  const [adminData, setAdminData] = useState(JSON.parse(localStorage.getItem('adminData')) || null);

  const loginAdmin = (token, data) => {
    setAdminToken(token);
    setAdminData(data);
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminData', JSON.stringify(data));
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    setAdminData(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  };

  const isAdminAuthenticated = () => !!adminToken;

  return (
    <AdminAuthContext.Provider value={{ adminToken, adminData, loginAdmin, logoutAdmin, isAdminAuthenticated }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
