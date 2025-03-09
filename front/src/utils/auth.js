
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  // Add token expiration check if your token includes exp
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp) {
      const isExpired = Date.now() >= payload.exp * 1000;
      if (isExpired) {
        localStorage.removeItem('token');
        return false;
      }
    }
    return true;
  } catch (error) {
    localStorage.removeItem('token');
    return false;
  }
};