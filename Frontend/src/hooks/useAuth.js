import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { isAuthenticated, role, token } = useSelector((state) => state.auth);



  return {
    isAuthenticated,
    role,
    token,
    isHR: role === 'hr',
    isEmployee: role === 'employee',
  };
};
