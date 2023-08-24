const LOCAL_STORAGE_KEY = "token";

export function getAuthToken() {
  return window.localStorage.getItem(LOCAL_STORAGE_KEY);
}

export function setAuthToken(token: string) {
  return window.localStorage.setItem(LOCAL_STORAGE_KEY, token);
}

export function removeAuthToken() {
  return window.localStorage.removeItem(LOCAL_STORAGE_KEY);
}
