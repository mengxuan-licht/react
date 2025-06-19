export const API_CONFIG = {
  baseURL: 'http://localhost/project/backend/public',
  assetBaseURL: "http://localhost/project/backend/",
}

export function getApiUrl(action) {
  return `${API_CONFIG.baseURL}?action=${action}`;
}