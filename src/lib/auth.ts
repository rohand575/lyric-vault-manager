const VIEWER_SESSION_KEY = 'viewer_session';
const ADMIN_SESSION_KEY = 'admin_session';

export const setViewerSession = (sessionId: string, passwordId: string) => {
  localStorage.setItem(VIEWER_SESSION_KEY, JSON.stringify({ sessionId, passwordId }));
};

export const getViewerSession = () => {
  const data = localStorage.getItem(VIEWER_SESSION_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const clearViewerSession = () => {
  localStorage.removeItem(VIEWER_SESSION_KEY);
};

export const setAdminSession = (isAdmin: boolean) => {
  if (isAdmin) {
    localStorage.setItem(ADMIN_SESSION_KEY, 'true');
  }
};

export const getAdminSession = () => {
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
};

export const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
};
