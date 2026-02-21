export function getExtenstion(filename: string) {
  return filename.split(".").pop();
}

const TOKEN_KEY = "google_id_token";

export function getIdToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setIdToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearIdToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getAuthHeaders(): { Authorization: string } | Record<string, never> {
  const token = getIdToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
