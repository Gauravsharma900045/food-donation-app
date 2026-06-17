export const getAuthToken = () => localStorage.getItem('token');

export const setAuthToken = (token) => localStorage.setItem('token', token);

export const removeAuthToken = () => localStorage.removeItem('token');

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));

export const removeUser = () => localStorage.removeItem('user');

export const isAuthenticated = () => !!getAuthToken();

export const isBrowser = () => typeof window !== 'undefined';

export const showToast = (message, type = 'info') => {
  // Create a simple toast notification
  const toast = document.createElement('div');
  toast.className = `fixed bottom-6 right-6 px-6 py-3 rounded-lg text-white font-medium ${
    type === 'success' ? 'bg-green-600' :
    type === 'error' ? 'bg-red-600' :
    'bg-blue-600'
  } z-50`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};
